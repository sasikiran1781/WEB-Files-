from flask import Blueprint, request, jsonify
from database.db_connection import db
from database.models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('full_name')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        full_name=name,
        email=email,
        phone=data.get('phone'),
        password_hash=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Signup successful",
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone
        }
    }), 200

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    data = request.json
    user_id = data.get('user_id')
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not all([user_id, current_password, new_password, confirm_password]):
        return jsonify({"status": "error", "stage": "change_password", "message": "Missing required fields"}), 400

    if new_password != confirm_password:
        return jsonify({"status": "error", "stage": "change_password", "message": "Passwords do not match"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "stage": "change_password", "message": "User not found"}), 404

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({"status": "error", "stage": "change_password", "message": "Current password is incorrect"}), 401

    try:
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"status": "success", "message": "Password updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "stage": "change_password", "message": "Password update failed", "details": str(e)}), 500
@auth_bp.route('/send-otp', methods=['POST'])
@auth_bp.route('/send-otp/', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # In a real app, generate and send a real OTP. For now, we return a debug OTP.
    return jsonify({
        "message": "OTP sent successfully",
        "debug_otp": "123456"
    }), 200

@auth_bp.route('/verify-otp', methods=['POST'])
@auth_bp.route('/verify-otp/', methods=['POST'])
def verify_otp():
    data = request.json
    otp = data.get('otp')
    if otp == "123456":
        return jsonify({"message": "OTP verified"}), 200
    return jsonify({"error": "Invalid OTP"}), 400

@auth_bp.route('/reset-password', methods=['POST'])
@auth_bp.route('/reset-password/', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    try:
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
