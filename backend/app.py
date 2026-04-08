import os
import socket
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database.db_connection import db, ma
from routes.auth_routes import auth_bp
from routes.report_routes import report_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    CORS(app)
    
    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@127.0.0.1/reva_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'reva-secret-key')
    
    # Initialize DB and Marshmallow
    db.init_app(app)
    ma.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(report_bp)

    # Health Check
    @app.route('/ping', methods=['GET'])
    def ping():
        return {"status": "online", "system": "REVA Modular Engine"}, 200

    @app.route('/', methods=['GET'])
    def index():
        return {
            "status": "ok",
            "service": "REVA backend running"
        }, 200

    # 404 handler returning JSON
    @app.errorhandler(404)
    def handle_404(e):
        return {
            "status": "error",
            "message": "The requested URL was not found on the server.",
            "details": str(e)
        }, 404

    # Ensure upload folder exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    def list_gemini_models():
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        print("\n🔍 [DEBUG] Checking Available Gemini Models:")
        try:
            available_models = []
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    available_models.append(m.name.replace('models/', ''))
            print(f"📊 [MODELS] Found: {', '.join(available_models)}")
        except Exception as e:
            print(f"⚠️ [MODELS] Could not list models: {str(e)}")
        print("----------------------------------------------")

    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        list_gemini_models()
        print("✅ REVA Backend Modular Engine Ready.")

    return app

if __name__ == "__main__":
    def get_local_ip():
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(('8.8.8.8', 1))
            IP = s.getsockname()[0]
        except Exception:
            IP = '127.0.0.1'
        finally:
            s.close()
        return IP

    app = create_app()
    local_ip = get_local_ip()
    print(f"\n🚀 REVA Modular Backend starting on: http://{local_ip}:8000")
    print(f"📡 Local fallback: http://127.0.0.1:8000")
    print("----------------------------------------------")
    app.run(debug=False, host='0.0.0.0', port=8000, threaded=True)
