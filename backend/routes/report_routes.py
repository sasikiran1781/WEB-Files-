from flask import Blueprint, request, jsonify, send_file
from database.db_connection import db
from database.models import HealthReport, Patient, MedicalMetric
from services.ocr_service import OCRService
from services.ai_analysis_service import AIAnalysisService
from services.patient_service import PatientService
from services.recovery_service import RecoveryService
from services.pdf_service import PDFService
from utils.text_cleaner import clean_ocr_text
import os
import json
from werkzeug.utils import secure_filename

def ensure_dict(data):
    """Ensures that the input data is a Python dictionary."""
    if isinstance(data, str):
        try:
            parsed = json.loads(data)
            return parsed if isinstance(parsed, dict) else {}
        except:
            return {}
    return data if isinstance(data, dict) else {}

def ensure_list(data):
    """Ensures that the input data is a Python list."""
    if isinstance(data, str):
        try:
            parsed = json.loads(data)
            return parsed if isinstance(parsed, list) else []
        except:
            return []
    return data if isinstance(data, list) else []

def normalize_json_field(value, for_db_json_column=True):
    """
    Step 4: Normalization Helper for JSON storage.
    Ensures values are safe for SQLAlchemy db.JSON columns or TEXT columns.
    """
    if value is None:
        return {} if for_db_json_column else "{}"
    
    # Already a dict/list
    if isinstance(value, (dict, list)):
        return value if for_db_json_column else json.dumps(value)
    
    # If it's a string, try to parse it
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if for_db_json_column else value
        except:
            # If not valid JSON string, but column is JSON, return as key?: value
            return {} if for_db_json_column else "{}"
            
    return {} if for_db_json_column else "{}"

def map_analysis_to_swift(analysis, report_id=None):
    """Maps the raw AI analysis dictionary to the exact schema expected by the Swift app."""
    # 1. Normalize Medical Metrics (ensure confidence_score)
    raw_metrics = ensure_dict(analysis.get('medical_metrics', {}))
    normalized_metrics = {}
    for key, val in raw_metrics.items():
        if isinstance(val, dict):
            normalized_metrics[key] = {
                "value": str(val.get('value', 'Not Available')),
                "unit": str(val.get('unit', '')),
                "confidence_score": float(val.get('confidence_score') or val.get('confidence') or 0.0)
            }
        else:
            normalized_metrics[key] = {"value": str(val), "unit": "", "confidence_score": 0.0}

    # 2. Normalize Recommendations (ensure recovery_precautions and exercise)
    raw_recs = ensure_dict(analysis.get('recommendations', {}))
    normalized_recs = {
        "foods_to_eat": raw_recs.get("foods_to_eat", []),
        "foods_to_avoid": raw_recs.get("foods_to_avoid", []),
        "water_intake": raw_recs.get("water_intake", "Not Available"),
        "exercise": raw_recs.get("exercise") or raw_recs.get("exercise_guidelines") or "Not Available",
        "recovery_precautions": raw_recs.get("recovery_precautions") or raw_recs.get("precautions") or [],
        "diet_summary": raw_recs.get("diet_summary") or "Custom Recovery Diet",
        "calorie_goal": str(raw_recs.get("calorie_goal", "1800")),
        "protein_goal": str(raw_recs.get("protein_goal", "85g"))
    }

    # 3. Final Response Construction
    return {
        "id": report_id or analysis.get('id'),
        "status": "success",
        "stage": "analysis_complete",
        "report_type": analysis.get('report_type') or analysis.get('document_type', 'General Medical Report'),
        "patient_identity": ensure_dict(analysis.get('patient_identity', {})),
        "diagnosis": analysis.get('diagnosis') or analysis.get('risk_analysis', {}).get('summary'),
        "medical_metrics": normalized_metrics,
        "risk_analysis": {
            "primary_risk": analysis.get('risk_analysis', {}).get('primary_risk', 'None Detected'),
            "secondary_risks": analysis.get('risk_analysis', {}).get('secondary_risks', []),
            "severity_level": analysis.get('risk_analysis', {}).get('severity_level') or analysis.get('severity_level', 'Stable'),
            "summary": analysis.get('risk_analysis', {}).get('summary') or analysis.get('diagnosis', 'Analysis complete.')
        },
        "recovery_score": int(analysis.get('recovery_score', 100)),
        "recommendations": normalized_recs,
        "follow_up_analysis": {
            "is_follow_up": bool(analysis.get('follow_up_analysis', {}).get('is_follow_up', False)),
            "matched_patient": bool(analysis.get('follow_up_analysis', {}).get('matched_patient', True)),
            "improvement_percentage": float(analysis.get('follow_up_analysis', {}).get('improvement_percentage', 0.0)),
            "decline_percentage": float(analysis.get('follow_up_analysis', {}).get('decline_percentage', 0.0)),
            "health_trend": analysis.get('follow_up_analysis', {}).get('health_trend', 'Stable'),
            "comparisons": {
                k: {
                    "current": float(v.get('current', 0.0)) if isinstance(v, dict) and v.get('current') is not None else 0.0,
                    "previous": float(v.get('previous', 0.0)) if isinstance(v, dict) and v.get('previous') is not None else 0.0,
                    "change_type": str(v.get('change_type', 'Stable')) if isinstance(v, dict) else 'Stable',
                    "change_percent": float(v.get('change_percent', 0.0)) if isinstance(v, dict) and v.get('change_percent') is not None else 0.0
                } for k, v in ensure_dict(analysis.get('follow_up_analysis', {}).get('comparisons', {})).items()
            }
        },
        "improvement": ensure_dict(analysis.get('improvement', {})),
        "medications": ensure_list(analysis.get('medications', []))
    }

report_bp = Blueprint('report', __name__)
UPLOAD_FOLDER = 'uploads'
ai_service = AIAnalysisService()

@report_bp.route('/upload-report', methods=['POST'])
@report_bp.route('/upload-followup', methods=['POST'])
def upload_report():
    """
    MASTER REVA PIPELINE: Metadata -> OCR -> Cleaning -> AI Pass 1 -> Identity Match -> Comparison Pass -> Storage
    """
    print("upload-followup endpoint hit")
    print("Files:", request.files)
    print("Form:", request.form)
    print("\n--- 📥 [PIPELINE START] ---")
    
    # STEP 1: RECEIVED
    try:
        print("STAGE 1: File upload received")
        if 'file' not in request.files:
            return jsonify({
                "status": "error", 
                "stage": "STAGE 1: File upload",
                "message": "Upload request missing 'file' key"
            }), 400
        
        user_id = request.form.get('user_id')
        file = request.files['file']
        
        if not file or file.filename == '':
            return jsonify({
                "status": "error", 
                "stage": "STAGE 1: File upload",
                "message": "Empty filename in request"
            }), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            
        file.save(file_path)
        print(f"STAGE 1: File saved success: {filename}")
    except Exception as e:
        print(f"❌ STAGE 1 FAILED: {str(e)}")
        return jsonify({
            "status": "error", 
            "stage": "STAGE 1: File upload",
            "message": "System could not save your medical file"
        }), 500

    # STEP 2: OCR EXTRACTION
    try:
        print("STAGE 2: OCR extraction started")
        raw_text = OCRService.extract_text(file_path)
    except Exception as e:
        print(f"❌ STAGE 2 FAILED: {str(e)}")
        return jsonify({
            "status": "error", 
            "stage": "STAGE 1: OCR Extraction",
            "message": "Failed to read the document scan"
        }), 500
    
    # STEP 3: OCR CLEANING
    try:
        print("STAGE 3: OCR cleaning started")
        clean_text = clean_ocr_text(raw_text)
    except Exception as e:
        print(f"❌ STAGE 3 FAILED: {str(e)}")
        return jsonify({
            "status": "error", 
            "stage": "STAGE 2: OCR Cleaning",
            "message": "Failed to clean document noise"
        }), 500
    
    # STEP 4: MEDICAL VALIDATION
    try:
        print("STAGE 4: Medical validation started")
        is_multimodal = "[Multimodal Processing Triggered]" in raw_text
        
        if not is_multimodal:
            if not clean_text or len(clean_text) < 100:
                 return jsonify({
                     "status": "error", 
                     "stage": "STAGE 3: Patient Identity Detection",
                     "message": "Medical report content too short to analyze"
                 }), 400

            medical_keywords = [
                "creatinine", "urea", "hemoglobin", "platelet", "sodium", 
                "potassium", "blood", "report", "test", "lab", "mg/dl", "mmol", "range"
            ]
            found_keywords = [k for k in medical_keywords if k in clean_text.lower()]
            if not found_keywords:
                return jsonify({
                    "status": "error", 
                    "stage": "STAGE 3: Patient Identity Detection",
                    "message": "Document does not appear to be a medical report"
                }), 400
    except Exception as e:
        return jsonify({
            "status": "error", 
            "stage": "STAGE 4: Medical Metric Extraction",
            "message": "Validation process failed"
        }), 400

    # STEP 5: PRE-FETCH PATIENT CONTEXT
    try:
        print("STAGE 5: Building historical context for all user patients")
        patients = Patient.query.filter_by(user_id=user_id).all()
        user_patients_context = []
        for p in patients:
            # Get latest metrics for each patient to provide as context
            latest_metrics = RecoveryService.get_latest_metrics(p.id)
            user_patients_context.append({
                "patient_name": p.patient_name,
                "patient_id": p.patient_id,
                "age": p.age,
                "gender": p.gender,
                "latest_metrics": latest_metrics
            })
            
        # STEP 6: UNIFIED AI ANALYSIS PASS
        print(f"STAGE 6: Unified AI Analysis with {len(user_patients_context)} known patient profiles")
        
        analysis = ai_service.analyze_report(
            ocr_text=clean_text, 
            file_path=file_path, 
            existing_patients=user_patients_context if user_patients_context else None
        )
        
        if analysis.get('status') == 'error':
            return jsonify(analysis), 400

        # STEP 7: PATIENT IDENTIFICATION (POST-ANALYSIS)
        print("STAGE 7: Verifying results and matching identity in database")
        extracted_identity = analysis.get('patient_identity', {})
        report_type = analysis.get('report_type', 'Medical Report')
        is_follow_up_detected = "FOLLOW-UP" in report_type.upper() or "FOLLOW UP" in report_type.upper()
        
        patient, patient_status = PatientService.identify_or_create_patient(
            user_id, 
            extracted_identity, 
            is_follow_up_request=is_follow_up_detected
        )
        
        if is_follow_up_detected and patient_status == "mismatch":
            print(f"❌ IDENTITY MISMATCH: Report belongs to a different person.")
            return jsonify({
                "status": "error",
                "stage": "identity_validation",
                "message": "Identity mismatch. This report appears to belong to a different patient."
            }), 400

        # Sync analysis flags
        if 'follow_up_analysis' not in analysis:
            analysis['follow_up_analysis'] = {}
        analysis['follow_up_analysis']['is_follow_up'] = is_follow_up_detected
        analysis['follow_up_analysis']['matched_patient'] = (patient_status != "mismatch")

    except Exception as e:
        print(f"❌ UNIFIED PIPELINE FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error", 
            "stage": "Unified AI Analysis",
            "message": "AI Engine failed to process report within timeout",
            "details": str(e)
        }), 500

    # STEP 9: DATABASE SAVE
    try:
        # Validate Schema Before Store
        required_cols = ['patient_identity_json', 'medical_metrics_json', 'recommendations_json', 'recovery_score', 'risk_level', 'primary_risk', 'diagnosis']
        table_cols = [c.name for c in HealthReport.__table__.columns]
        missing = [rc for rc in required_cols if rc not in table_cols]
        if missing:
             return jsonify({
                 "status": "error",
                 "stage": "database_save",
                 "message": "Critical database schema mismatch",
                 "details": f"Missing columns in 'health_reports': {', '.join(missing)}"
             }), 500

        # APPLY NORMALIZATION & DEBUG LOGGING
        patient_identity = analysis.get('patient_identity', {})
        medical_metrics = analysis.get('medical_metrics', {})
        risk_analysis = analysis.get('risk_analysis', {})
        recommendations = analysis.get('recommendations', {})
        follow_up_analysis = analysis.get('follow_up_analysis', {})

        # Normalize for DB
        norm_metrics = normalize_json_field(medical_metrics)
        norm_identity = normalize_json_field(patient_identity)
        norm_recs = normalize_json_field(recommendations)
        norm_meds = normalize_json_field(analysis.get('medications', []))
        
        new_report = HealthReport(
            patient_id=patient.id,
            report_type=analysis.get('report_type', 'General'),
            report_file=filename,
            medical_metrics_json=norm_metrics,
            patient_identity_json=norm_identity,
            recovery_score=analysis.get('recovery_score', 0),
            risk_level=risk_analysis.get('severity_level'),
            primary_risk=risk_analysis.get('primary_risk'),
            diagnosis=risk_analysis.get('summary') or analysis.get('diagnosis'),
            recommendations_json=norm_recs,
            medications_json=norm_meds
        )
        db.session.add(new_report)
        db.session.flush()
        
        # Save individual metrics
        for m_name, m_data in medical_metrics.items():
            if isinstance(m_data, dict):
                db.session.add(MedicalMetric(
                    report_id=new_report.id,
                    metric_name=m_name,
                    value=str(m_data.get('value', '')),
                    unit=m_data.get('unit', ''),
                    confidence=m_data.get('confidence', 0.0) if m_data.get('confidence') else m_data.get('confidence_score', 0.0)
                ))
            
        # Store Comparison if follow-up
        if is_follow_up_detected:
            last_report = HealthReport.query.filter(HealthReport.patient_id == patient.id, HealthReport.id != new_report.id).order_by(HealthReport.created_at.desc()).first()
            RecoveryService.store_comparison(patient.id, last_report.id if last_report else None, new_report.id, follow_up_analysis)
        
        db.session.commit()
        print(f"STEP 9: Database save success. Report ID: {new_report.id}")
    except Exception as e:
        db.session.rollback()
        print(f"❌ STEP 9 FAILED: {str(e)}")
        return jsonify({
            "status": "error", 
            "stage": "database_save",
            "message": "Failed to store analysis results in database",
            "details": str(e)
        }), 500

    # STEP 10: SUCCESS
    print("STEP 10: Final API response sent")
    
    # Map to Swift Schema
    final_response = map_analysis_to_swift(analysis, report_id=new_report.id)
    
    print("FINAL API RESPONSE (SCANNED):", json.dumps(final_response, indent=2))
    return jsonify(final_response), 200

@report_bp.route('/patient-history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    """
    Returns all reports for all patients under a user account in standard HealthAnalysis format.
    """
    patients = Patient.query.filter_by(user_id=user_id).all()
    history = []
    
    from database.models import FollowupComparison
    
    for p in patients:
        reports = HealthReport.query.filter_by(patient_id=p.id).order_by(HealthReport.created_at.desc()).all()
        for r in reports:
            comp = FollowupComparison.query.filter_by(current_report_id=r.id).first()
            
            # Construct analysis-like dict for mapping
            mock_analysis = {
                "report_type": r.report_type,
                "patient_identity": ensure_dict(r.patient_identity_json),
                "medical_metrics": ensure_dict(r.medical_metrics_json),
                "risk_analysis": {
                    "severity_level": r.risk_level,
                    "primary_risk": r.primary_risk,
                    "summary": r.diagnosis
                },
                "recovery_score": r.recovery_score,
                "recommendations": ensure_dict(r.recommendations_json),
                "medications": ensure_list(r.medications_json),
                "follow_up_analysis": {
                    "is_follow_up": comp is not None,
                    "improvement_percentage": comp.improvement_percentage if comp else 0.0,
                    "decline_percentage": comp.decline_percentage if comp else 0.0,
                    "health_trend": comp.health_trend if comp else "Stable",
                    "comparisons": ensure_dict(comp.comparisons_json) if comp else {}
                },
                "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            history.append(map_analysis_to_swift(mock_analysis, report_id=r.id))
            
    return jsonify(history), 200

@report_bp.route('/report-details/<int:report_id>', methods=['GET'])
def get_report_details(report_id):
    """
    Returns full details for a specific report ID in Swift-compatible format.
    """
    report = HealthReport.query.get(report_id)
    if not report:
        return jsonify({"status": "error", "message": "Report not found"}), 404
        
    from database.models import FollowupComparison
    comp = FollowupComparison.query.filter_by(current_report_id=report.id).first()
    
    mock_analysis = {
        "report_type": report.report_type,
        "patient_identity": ensure_dict(report.patient_identity_json),
        "medical_metrics": ensure_dict(report.medical_metrics_json),
        "risk_analysis": {
            "severity_level": report.risk_level,
            "primary_risk": report.primary_risk,
            "summary": report.diagnosis
        },
        "recovery_score": report.recovery_score,
        "recommendations": ensure_dict(report.recommendations_json),
        "medications": ensure_list(report.medications_json),
        "follow_up_analysis": {
            "is_follow_up": comp is not None,
            "improvement_percentage": comp.improvement_percentage if comp else 0.0,
            "decline_percentage": comp.decline_percentage if comp else 0.0,
            "health_trend": comp.health_trend if comp else "Stable",
            "comparisons": ensure_dict(comp.comparisons_json) if comp else {}
        }
    }
    
    return jsonify(map_analysis_to_swift(mock_analysis, report_id=report.id)), 200

@report_bp.route('/latest-analysis/<int:user_id>', methods=['GET'])
def get_latest_analysis(user_id):
    """
    Returns the absolute latest report analysis in standard Swift-compatible format.
    Refined logic: Prioritizes the user's primary patient profile.
    """
    from database.models import User
    user = User.query.get(user_id)
    patients = Patient.query.filter_by(user_id=user_id).all()
    
    if not patients:
        return jsonify({"status": "error", "message": "No patients found"}), 404
        
    # Attempt to find the "Primary" patient (matches user name)
    primary_patient = None
    if user:
        for p in patients:
            if user.full_name and (user.full_name.lower() in p.patient_name.lower() or p.patient_name.lower() in user.full_name.lower()):
                primary_patient = p
                break
    
    # Target report selection
    if primary_patient:
        latest_report = HealthReport.query.filter_by(patient_id=primary_patient.id).order_by(HealthReport.created_at.desc()).first()
    else:
        # Fallback to absolute latest report
        patient_ids = [p.id for p in patients]
        latest_report = HealthReport.query.filter(
            HealthReport.patient_id.in_(patient_ids)
        ).order_by(HealthReport.created_at.desc()).first()
    
    if not latest_report:
        return jsonify({"status": "error", "message": "No medical reports found"}), 404

    from database.models import FollowupComparison
    comp = FollowupComparison.query.filter_by(current_report_id=latest_report.id).first()
    
    mock_analysis = {
        "report_type": latest_report.report_type,
        "patient_identity": ensure_dict(latest_report.patient_identity_json),
        "medical_metrics": ensure_dict(latest_report.medical_metrics_json),
        "risk_analysis": {
            "severity_level": latest_report.risk_level or "Stable",
            "primary_risk": latest_report.primary_risk or "None Detected",
            "summary": latest_report.diagnosis or "No summary available"
        },
        "recovery_score": latest_report.recovery_score or 0,
        "recommendations": ensure_dict(latest_report.recommendations_json),
        "medications": ensure_list(latest_report.medications_json),
        "follow_up_analysis": {
            "is_follow_up": comp is not None,
            "improvement_percentage": comp.improvement_percentage if comp else 0.0,
            "decline_percentage": comp.decline_percentage if comp else 0.0,
            "health_trend": comp.health_trend if comp else "Stable",
            "matched_patient": True,
            "comparisons": ensure_dict(comp.comparisons_json) if comp else {}
        }
    }
    
    return jsonify(map_analysis_to_swift(mock_analysis, report_id=latest_report.id)), 200

@report_bp.route('/report-pdf/<int:report_id>', methods=['GET'])
def get_report_pdf(report_id):
    """
    Generates and returns a PDF for a specific medical report.
    """
    print(f"\n--- 📄 [PDF GENERATION START] Report ID: {report_id} ---")
    report = HealthReport.query.get(report_id)
    if not report:
        return jsonify({"status": "error", "message": "Report not found"}), 404
        
    from database.models import FollowupComparison
    comp = FollowupComparison.query.filter_by(current_report_id=report.id).first()
    
    # Construct analysis-like dict for PDF generator
    report_data = {
        "report_type": report.report_type,
        "patient_identity": ensure_dict(report.patient_identity_json),
        "medical_metrics": ensure_dict(report.medical_metrics_json),
        "risk_analysis": {
            "severity_level": report.risk_level,
            "primary_risk": report.primary_risk,
            "summary": report.diagnosis
        },
        "recovery_score": report.recovery_score,
        "recommendations": ensure_dict(report.recommendations_json),
        "medications": ensure_list(report.medications_json),
        "follow_up_analysis": {
            "is_follow_up": comp is not None,
            "improvement_percentage": comp.improvement_percentage if comp else 0.0,
            "decline_percentage": comp.decline_percentage if comp else 0.0,
            "health_trend": comp.health_trend if comp else "Stable",
            "comparisons": ensure_dict(comp.comparisons_json) if comp else {}
        }
    }
    
    # Generate PDF
    pdf_service = PDFService()
    temp_filename = f"REVA_Report_{report_id}.pdf"
    
    # Ensure PDF directory exists
    pdf_dir = os.path.join(UPLOAD_FOLDER, 'pdfs')
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
        
    temp_path = os.path.join(pdf_dir, temp_filename)
    
    try:
        pdf_service.generate_report_pdf(report_data, temp_path)
        print(f"✅ PDF Generated: {temp_path}")
        return send_file(
            temp_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=temp_filename
        )
    except Exception as e:
        print(f"❌ PDF GENERATION FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": "Failed to generate PDF",
            "details": str(e)
        }), 500

@report_bp.route('/test', methods=['GET'])
def test():
    return {"status": "ok"}, 200
