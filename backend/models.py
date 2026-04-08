import datetime
from database.db_connection import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=True) # Alias to match user naming
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True) # password_hash in user request
    password_hash = db.Column(db.String(255), nullable=True) # For compatibility with request
    
    # Profile Details
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    dob = db.Column(db.String(20), nullable=True)
    height = db.Column(db.String(20), nullable=True)
    weight = db.Column(db.String(20), nullable=True)
    blood_type = db.Column(db.String(10), nullable=True)
    allergies = db.Column(db.String(255), nullable=True)
    patient_id = db.Column(db.String(20), nullable=True) # This is the app's internal user patient id
    
    # Security
    otp = db.Column(db.String(6), nullable=True)
    otp_expiry = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    reports = db.relationship("HealthReport", backref="owner", lazy=True, cascade="all, delete-orphan")

class HealthReport(db.Model):
    __tablename__ = "health_reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    report_image = db.Column(db.String(255), nullable=True) 
    document_type = db.Column(db.String(100), nullable=False, default="General")
    
    # Patient Identity (Extracted from Report - Step 2)
    patient_name = db.Column(db.String(100), nullable=True)
    patient_report_id = db.Column(db.String(100), nullable=True) # patient_id inside doc
    uhid = db.Column(db.String(100), nullable=True) # UHID / IP Number
    hospital_id = db.Column(db.String(100), nullable=True)
    report_age = db.Column(db.String(20), nullable=True)
    report_gender = db.Column(db.String(20), nullable=True)
    doctor_name = db.Column(db.String(100), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    hospital_name = db.Column(db.String(200), nullable=True)
    report_date_str = db.Column(db.String(100), nullable=True) # report_date
    sample_collection_date = db.Column(db.String(100), nullable=True)

    # Medical Metrics (Fixed shared ones for quick access)
    blood_sugar = db.Column(db.String(50), nullable=True)
    blood_pressure = db.Column(db.String(50), nullable=True)
    cholesterol = db.Column(db.String(50), nullable=True)
    heart_rate = db.Column(db.String(50), nullable=True)
    hemoglobin = db.Column(db.String(50), nullable=True)
    creatinine = db.Column(db.String(50), nullable=True)
    urea = db.Column(db.String(50), nullable=True)
    
    # Dynamic Metrics (Stored as JSON - Step 3)
    all_metrics_json = db.Column(db.Text, nullable=True) 
    
    # Analysis & Risks (Step 4 & 5)
    recovery_score = db.Column(db.Integer, nullable=True)
    primary_risk = db.Column(db.String(255), nullable=True)
    secondary_risks_json = db.Column(db.Text, nullable=True) # JSON list
    severity_level = db.Column(db.String(50), nullable=True) # Excellent, Critical, etc.
    health_summary = db.Column(db.Text, nullable=True)
    
    diagnosis = db.Column(db.Text, nullable=True)
    medications_json = db.Column(db.Text, nullable=True) # JSON list of medications
    
    # Recommendations (Stored as JSON/Text - Step 6)
    foods_to_eat = db.Column(db.Text, nullable=True)
    foods_to_avoid = db.Column(db.Text, nullable=True)
    water_intake = db.Column(db.String(100), nullable=True)
    exercise = db.Column(db.Text, nullable=True)
    precautions_json = db.Column(db.Text, nullable=True) # JSON list
    
    # Follow-up Analysis (Step 7)
    improvement_percentage = db.Column(db.Float, default=0.0)
    decline_percentage = db.Column(db.Float, default=0.0)
    health_trend = db.Column(db.String(50), nullable=True) # Improving, Stable, Deteriorating
    improvement_comparison_json = db.Column(db.Text, nullable=True) # JSON dictionary of ImprovementMetric
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class DailyMetric(db.Model):
    __tablename__ = "daily_metrics"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    water_intake = db.Column(db.String(50), nullable=True)
    steps = db.Column(db.Integer, nullable=True)
    sleep_hours = db.Column(db.String(20), nullable=True)
    symptoms = db.Column(db.Text, nullable=True)
    
    # Additional daily tracking
    heart_rate = db.Column(db.Integer, nullable=True)
    calories_burned = db.Column(db.Integer, nullable=True)
    active_minutes = db.Column(db.Integer, nullable=True)
