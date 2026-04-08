import google.generativeai as genai
import os
import json
try:
    import easyocr
    import cv2
    import numpy as np
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
from dotenv import load_dotenv

load_dotenv()

class AIAnalysisService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            self.model = None
            
        # Initialize EasyOCR Reader (English)
        if EASYOCR_AVAILABLE:
            try:
                self.reader = easyocr.Reader(['en'], gpu=False) # Set gpu=True if available
            except Exception as e:
                print(f"ERROR: Failed to initialize EasyOCR: {e}")
                self.reader = None
        else:
            print("INFO: EasyOCR not available yet. Using multimodal image analysis only.")
            self.reader = None

    def extract_text_from_image(self, image_data):
        """
        Extracts raw text from image bytes using EasyOCR
        """
        if not self.reader:
            return "OCR Engine unavailable."
            
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Use EasyOCR to get text
            results = self.reader.readtext(img, detail=0)
            raw_text = " ".join(results)
            return raw_text
        except Exception as e:
            print(f"OCR Error: {e}")
            return f"Error during OCR: {str(e)}"

    def analyze_report(self, image_data, mime_type="image/jpeg", previous_metrics=None):
        """
        Advanced Medical AI Engine Pipeline:
        Steps 1-9 as per user request.
        """
        if not self.model:
            return {"error": "Gemini API key not configured"}

        ocr_text = self.extract_text_from_image(image_data)
        
        prev_context = ""
        if previous_metrics:
            prev_context = f"\nPREVIOUS REPORT METRICS (FOR COMPARISON):\n{json.dumps(previous_metrics, indent=2)}\n"

        prompt = f"""
        You are an advanced AI Medical Report Analysis Engine used inside a healthcare application called REVA.
        The purpose of the system is to analyze ANY uploaded hospital report, extract patient information, detect medical risks, calculate a recovery score, generate diet recommendations, and track patient progress through follow-up reports.

        The system must support ANY hospital document format (Blood Test, CBC, Renal, Liver, Radiology, Prescriptions, Discharge Summary, etc.).
        The document may be scanned, rotated, low quality, messy, partially readable, or structured differently.

        OCR TEXT NORMALIZATION:
        1. Correct OCR errors.
        2. Normalize measurement units (mg/dL, g/dL, mmol/L, bpm).
        3. Standardize medical terminology using these mappings:
           "S. Creat", "Sr Creatinine", "Creat." -> creatinine
           "Hb", "Hgb" -> hemoglobin
           "WBC Count" -> wbc
           "PLT", "Platelet" -> platelet_count
           "BP", "B.P.", "Blood Pressure" -> blood_pressure
           "Trop-T", "Troponin T" -> troponin
        4. If multiple readings appear, choose the most medically plausible value.
        5. Each extracted metric MUST include a confidence_score (0-1).

        TABLE DETECTION:
        Detect table structures in the OCR text. For each row, extract: test_name, value, unit, reference_range.

        EXTRACTED OCR TEXT (MAY BE MESSY):
        {ocr_text}
        {prev_context}

        -------------------------------------
        STEP 1: DOCUMENT TYPE DETECTION
        Identify the medical document type. Possible types: Blood Test Report, CBC Report, Renal Function Test, Liver Function Test, Electrolyte Report, Dialysis Report, Radiology Report, Prescription, Discharge Summary, Hospital Lab Report, Follow-up Medical Report, General Medical Report.
        If NOT a medical report, return: {{"document_type": "Unknown", "error": "Uploaded file is not a valid medical report"}}

        STEP 2: PATIENT IDENTITY EXTRACTION
        Extract: patient_name, patient_id, uhid, hospital_id, age, gender, doctor_name, department, hospital_name, report_date, sample_collection_date.

        STEP 3: MEDICAL METRIC EXTRACTION
        Extract all medical metrics. Categorize them:
        - Kidney: creatinine, urea, bun, uric_acid, calcium, phosphorus, sodium, potassium
        - CBC: wbc, rbc, hemoglobin, pcv, mcv, mch, mchc, platelet_count, rdw, neutrophils, lymphocytes, monocytes, eosinophils, basophils
        - Cardiac: troponin, heart_rate, blood_pressure
        - Liver: bilirubin, sgpt, sgot, albumin
        - Electrolytes: sodium, potassium, chloride, magnesium
        
        For each metric, return: {{"value": "...", "unit": "...", "confidence_score": 0.0}}. Use "Not Available" for missing values.

        STEP 4: RISK DETECTION
        Analyze values and detect health risks.
        Return: primary_risk, secondary_risks (list), severity_level (Excellent, Stable, Moderate, At Risk, Critical).

        STEP 5: RECOVERY SCORE
        Calculate a score (0-100) based on abnormalities and risk severity.
        90-100: Excellent, 80-89: Good, 60-79: Moderate, 40-59: At Risk, <40: Critical.

        STEP 6: RECOMMENDATIONS
        Generate: foods_to_eat, foods_to_avoid, water_intake, exercise_guidelines, recovery_precautions.

        STEP 7: FOLLOW-UP COMPARISON
        If PREVIOUS REPORT METRICS are provided, compare with current values.
        Return:
        - improvement_percentage, decline_percentage, health_trend (Improving, Stable, Deteriorating).
        - improvement: dictionary where keys are metric names and values are {{"current": number, "previous": number, "change": number, "percent": number, "trend": "improving/stable/deteriorating"}}.

        OUTPUT FORMAT:
        Return strictly in RAW JSON format:
        {{
          "report_type": "string",
          "patient_identity": {{
            "patient_name": "string",
            "patient_id": "string",
            "uhid": "string",
            "hospital_id": "string",
            "age": "string",
            "gender": "string",
            "doctor_name": "string",
            "department": "string",
            "hospital_name": "string",
            "report_date": "string",
            "sample_collection_date": "string"
          }},
          "medical_metrics": {{
             "metric_name": {{ "value": "string", "unit": "string", "confidence_score": number }}
          }},
          "risk_analysis": {{
            "primary_risk": "string",
            "secondary_risks": ["string"],
            "severity_level": "string"
          }},
          "recovery_score": integer,
          "recommendations": {{
            "foods_to_eat": ["string"],
            "foods_to_avoid": ["string"],
            "water_intake": "string",
            "exercise_guidelines": "string",
            "recovery_precautions": ["string"]
          }},
          "follow_up_analysis": {{
            "improvement_percentage": number,
            "decline_percentage": number,
            "health_trend": "string"
          }},
          "improvement": {{
             "metric_name": {{ "current": number, "previous": number, "change": number, "percent": number, "trend": "string" }}
          }}
        PRECISION IS PARAMOUNT. Use visual context to disambiguate handwriting.
        """

        try:
            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": image_data}
            ])
            
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            result = json.loads(text)
            
            def ensure_dict(val):
                if isinstance(val, str):
                    try: return json.loads(val)
                    except: return {}
                return val if isinstance(val, dict) else {}

            # 1. Normalize Medical Metrics
            raw_metrics = ensure_dict(result.get("medical_metrics", {}))
            normalized_metrics = {}
            for k, v in raw_metrics.items():
                if isinstance(v, dict):
                    normalized_metrics[k] = {
                        "value": str(v.get("value", "Not Available")),
                        "unit": str(v.get("unit", "")),
                        "confidence_score": float(v.get("confidence_score") or v.get("confidence") or 0.0)
                    }
                else:
                    normalized_metrics[k] = {"value": str(v), "unit": "", "confidence_score": 0.0}

            # 2. Normalize Recommendations
            raw_recs = ensure_dict(result.get("recommendations", {}))
            normalized_recs = {
                "foods_to_eat": raw_recs.get("foods_to_eat", []),
                "foods_to_avoid": raw_recs.get("foods_to_avoid", []),
                "water_intake": raw_recs.get("water_intake", "Not Available"),
                "exercise": raw_recs.get("exercise") or raw_recs.get("exercise_guidelines") or "Not Available",
                "recovery_precautions": raw_recs.get("recovery_precautions") or raw_recs.get("precautions") or []
            }

            final_result = {
                "status": "success",
                "report_type": result.get("report_type") or result.get("document_type", "General Medical Report"),
                "patient_identity": ensure_dict(result.get("patient_identity", {})),
                "diagnosis": result.get("diagnosis") or result.get("risk_analysis", {}).get("summary"),
                "medical_metrics": normalized_metrics,
                "risk_analysis": {
                    "primary_risk": result.get("risk_analysis", {}).get("primary_risk", "None Detected"),
                    "secondary_risks": result.get("risk_analysis", {}).get("secondary_risks", []),
                    "severity_level": result.get("risk_analysis", {}).get("severity_level") or "Stable",
                    "summary": result.get("risk_analysis", {}).get("summary") or "Analysis complete."
                },
                "recovery_score": int(result.get("recovery_score", 100)),
                "recommendations": normalized_recs,
                "follow_up_analysis": {
                    "improvement_percentage": float(result.get("follow_up_analysis", {}).get("improvement_percentage", 0.0)),
                    "decline_percentage": float(result.get("follow_up_analysis", {}).get("decline_percentage", 0.0)),
                    "health_trend": result.get("follow_up_analysis", {}).get("health_trend", "Stable"),
                    "is_follow_up": bool(result.get("follow_up_analysis", {}).get("is_follow_up", False)),
                    "matched_patient": bool(result.get("follow_up_analysis", {}).get("matched_patient", True))
                },
                "improvement": ensure_dict(result.get("improvement", {})),
                "medications": result.get("medications", [])
            }
            
            print("FINAL AI ANALYSIS RESPONSE:", json.dumps(final_result, indent=2))
            return final_result
        except Exception as e:
            print(f"Gemini Analysis Error: {e}")
            return {"error": f"AI Analysis failed: {str(e)}"}
