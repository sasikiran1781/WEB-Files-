import socket
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from database.db_connection import db, ma
from models import User, HealthReport, DailyMetric
from schemas import user_schema, users_schema, report_schema, reports_schema, metric_schema, metrics_schema
import os
import random
import json
from datetime import datetime, timedelta, timezone
from ai_analysis import AIAnalysisService
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "online", "timestamp": datetime.now().isoformat()}), 200

# Initialize AI Service
ai_service = AIAnalysisService()

# Database Configuration (MySQL)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://root:@localhost/reva_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'reva-secret')

# Mail Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

db.init_app(app)
ma.init_app(app)
mail = Mail(app)

# Create tables
with app.app_context():
    try:
        db.create_all()
        print("REVA Advanced Engine Database ready.")
    except Exception as e:
        print(f"CRITICAL: DB Error - {e}")

# --- ROUTES ---

@app.route("/", methods=["GET"])
def hello():
    return jsonify({"message": "REVA Advanced Medical AI Engine is active"})

from werkzeug.security import generate_password_hash, check_password_hash

@app.route("/signup/", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    new_user = User(
        full_name=data.get('full_name', data.get('name')),
        email=email,
        password_hash=generate_password_hash(data.get('password', data.get('password_hash')))
    )
    db.session.add(new_user)
    db.session.commit()
    return user_schema.jsonify(new_user)

@app.route("/login/", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    user = User.query.filter_by(email=email).first()
    
    password = data.get('password')
    if not user or not user.password_hash or not check_password_hash(user.password_hash, password):
        # Fallback to plain text check for legacy users missing a hashed password
        if user and user.password == password:
            # Optionally hash it here and save to DB
            user.password_hash = generate_password_hash(password)
            user.password = None
            db.session.commit()
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    return jsonify({"message": "Login successful", "user": user_schema.dump(user)})

@app.route("/users/<int:user_id>/upload-report/", methods=["POST"])
def upload_report(user_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        image_data = file.read()
        mime_type = "application/pdf" if file.filename.lower().endswith('.pdf') else "image/jpeg"
        
        # 1. Fetch Previous Report Context (Step 7)
        previous_report = HealthReport.query.filter_by(user_id=user_id).order_by(HealthReport.created_at.desc()).first()
        prev_metrics = None
        if previous_report and previous_report.all_metrics_json:
            try:
                prev_metrics = json.loads(previous_report.all_metrics_json)
            except:
                prev_metrics = None

        # 2. Advanced AI Analysis Engine (Step 1-9)
        analysis = ai_service.analyze_report(image_data, mime_type=mime_type, previous_metrics=prev_metrics)
        
        if "error" in analysis:
            return jsonify(analysis), 500
        
        # 3. Patient Identification
        identity = analysis.get('patient_identity', {})
        
        # Searching for existing patient records using multiple identifiers
        existing_report = HealthReport.query.filter_by(user_id=user_id).filter(
            (HealthReport.patient_name == identity.get('patient_name')) |
            (HealthReport.patient_report_id == identity.get('patient_id')) |
            (HealthReport.uhid == identity.get('uhid')) |
            (HealthReport.hospital_id == identity.get('hospital_id'))
        ).first()
        patient_status = "existing_patient" if existing_report else "new_patient"

        # 4. Data Processing
        metrics = analysis.get('medical_metrics', {})
        risks = analysis.get('risk_analysis', {})
        recs = analysis.get('recommendations', {})
        follow_up = analysis.get('follow_up_analysis', {})
        
        def get_metric_val(key):
            m = metrics.get(key)
            if isinstance(m, dict):
                return f"{m.get('value')} {m.get('unit')}".strip()
            return m

        # 5. Create Report Entry
        new_report = HealthReport(
            user_id=user_id,
            document_type=analysis.get('report_type', 'General'),
            # Identity extraction
            patient_name=identity.get('patient_name'),
            patient_report_id=identity.get('patient_id'),
            uhid=identity.get('uhid'),
            hospital_id=identity.get('hospital_id'),
            report_age=identity.get('age'),
            report_gender=identity.get('gender'),
            doctor_name=identity.get('doctor_name'),
            department=identity.get('department'),
            hospital_name=identity.get('hospital_name'),
            report_date_str=identity.get('report_date'),
            sample_collection_date=identity.get('sample_collection_date'),
            
            # Shared Metrics Mapping (for quick access)
            blood_sugar=get_metric_val('blood_sugar') or get_metric_val('fasting_blood_sugar'),
            blood_pressure=get_metric_val('blood_pressure'),
            cholesterol=get_metric_val('cholesterol'),
            heart_rate=get_metric_val('heart_rate'),
            hemoglobin=get_metric_val('hemoglobin'),
            creatinine=get_metric_val('creatinine'),
            urea=get_metric_val('urea'),
            
            # Dynamic Metrics Storage
            all_metrics_json=json.dumps(metrics),
            
            # Analysis & Risks
            recovery_score=analysis.get('recovery_score', 0),
            primary_risk=risks.get('primary_risk'),
            secondary_risks_json=json.dumps(risks.get('secondary_risks', [])),
            severity_level=risks.get('severity_level'),
            health_summary=risks.get('summary'),
            diagnosis=analysis.get('diagnosis'),
            medications_json=json.dumps(analysis.get('medications', [])),
            
            # Recommendations
            foods_to_eat=json.dumps(recs.get('foods_to_eat', [])),
            foods_to_avoid=json.dumps(recs.get('foods_to_avoid', [])),
            water_intake=recs.get('water_intake'),
            exercise=recs.get('exercise_guidelines'),
            precautions_json=json.dumps(recs.get('recovery_precautions', [])),
            
            # Step 7 Follow-up Comparison (AI Outputs)
            improvement_percentage=follow_up.get('improvement_percentage', 0.0),
            decline_percentage=follow_up.get('decline_percentage', 0.0),
            health_trend=follow_up.get('health_trend', 'Baseline'),
            improvement_comparison_json=json.dumps(analysis.get('improvement', {}))
        )
        
        db.session.add(new_report)
        db.session.commit()

        # Step 10 Output Format
        return jsonify({
            "message": "Analysis Complete",
            "patient_status": patient_status,
            "analysis": analysis,
            "improvement": new_report.improvement_percentage,
            "record_id": new_report.id
        }), 200

    except Exception as e:
        print(f"CRASH: {e}")
        return jsonify({"error": f"Internal process crash: {str(e)}"}), 500

@app.route("/users/<int:user_id>/report-history/", methods=["GET"])
def get_report_history(user_id):
    reports = HealthReport.query.filter_by(user_id=user_id).order_by(HealthReport.created_at.desc()).all()
    return reports_schema.jsonify(reports)

@app.route("/users/<int:user_id>/metrics/", methods=["POST"])
def create_metric(user_id):
    data = request.get_json()
    new_metric = DailyMetric(
        user_id=user_id,
        water_intake=data.get('water_intake'),
        steps=data.get('steps'),
        sleep_hours=data.get('sleep_hours'),
        symptoms=data.get('symptoms')
    )
    db.session.add(new_metric)
    db.session.commit()
    return metric_schema.jsonify(new_metric)

@app.route("/users/<int:user_id>/metrics/", methods=["GET"])
def get_metrics(user_id):
    metrics = DailyMetric.query.filter_by(user_id=user_id).order_by(DailyMetric.date.desc()).all()
    return metrics_schema.jsonify(metrics)

if __name__ == "__main__":
    def get_local_ip():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            # doesn't even have to be reachable
            s.connect(('8.8.8.8', 1))
            IP = s.getsockname()[0]
        except Exception:
            IP = '127.0.0.1'
        finally:
            s.close()
        return IP

    local_ip = get_local_ip()
    print(f"\n🚀 REVA Server is starting on: http://{local_ip}:8000")
    print(f"📡 Local fallback: http://127.0.0.1:8000")
    print("----------------------------------------------")
    app.run(debug=True, host='0.0.0.0', port=8000)
