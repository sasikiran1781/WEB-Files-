import os
import json
import time
import re
import google.generativeai as genai
from google.api_core import exceptions
from dotenv import load_dotenv
from PIL import Image

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class AIAnalysisService:
    def __init__(self):
        # Professional AI Medical Assistant Model Selection
        self.primary_model = "gemini-2.0-flash"
        self.fallback_model = "gemini-1.5-flash"
        print(f"📡 [REVA AI] Initializing REVA Lead Medical Architect ({self.primary_model})")

    def _extract_json(self, text):
        """
        Step 2: Substring-based JSON extraction.
        Finds the first '{' and the last '}' to isolate the JSON block.
        """
        try:
            start_index = text.find('{')
            end_index = text.rfind('}')
            
            if start_index != -1 and end_index != -1 and end_index > start_index:
                json_str = text[start_index:end_index + 1]
                # Validate it's actual JSON
                json.loads(json_str)
                return json_str
            
            # Fallback to regex if substringing fails
            match = re.search(r'(\{.*\})', text, re.DOTALL)
            if match:
                return match.group(1)
        except Exception as e:
            print(f"⚠️ [JSON EXTRACT] Substring extraction failed: {str(e)}")
            
        return text

    def _validate_and_fill_defaults(self, data):
        """Final validation pass to ensure REVA schema compliance."""
        defaults = {
            "status": "success",
            "report_type": "General Medical Report",
            "patient_identity": {
                "patient_name": "Not Available",
                "patient_id": "Not Available",
                "hospital_name": "Not Available",
                "report_date": "Not Available"
            },
            "medical_metrics": {},
            "risk_analysis": {
                "primary_risk": "None Detected",
                "secondary_risks": [],
                "severity_level": "Stable"
            },
            "recovery_score": 100,
            "recommendations": {
                "foods_to_eat": [],
                "foods_to_avoid": [],
                "water_intake": "Not Available",
                "exercise": "Not Available",
                "precautions": []
            },
            "follow_up_analysis": {
                "is_follow_up": False,
                "matched_patient": False,
                "improvement_percentage": 0,
                "decline_percentage": 0,
                "health_trend": "Stable"
            }
        }

        if not isinstance(data, dict):
            return defaults

        def ensure_dict(val):
            if isinstance(val, str):
                try:
                    return json.loads(val)
                except:
                    return {}
            return val if isinstance(val, dict) else {}

        # Pre-process known JSON fields to ensure they are dictionaries
        json_fields = ["patient_identity", "medical_metrics", "risk_analysis", "recommendations", "follow_up_analysis"]
        for field in json_fields:
            if field in data:
                data[field] = ensure_dict(data[field])

        # Recursive Deep Merge for REVA Schema
        def deep_merge(target, source):
            for key, value in source.items():
                if key not in target or target[key] is None or target[key] == "":
                    target[key] = value
                elif isinstance(value, dict) and isinstance(target[key], dict):
                    deep_merge(target[key], value)
            return target

        return deep_merge(data, defaults)

    def _generate_prompt(self, ocr_text, existing_patients=None, previous_metrics=None):
        context = ""
        if existing_patients:
            context += f"\n[DATABASE] Known Patients: {json.dumps(existing_patients)}"
        if previous_metrics:
            context += f"\n[LONGITUDINAL] Previous Metrics (Baseline): {json.dumps(previous_metrics)}"

        prompt = f"""
            Role: Lead AI Medical Architect (REVA)
            Objective: Analyze the medical report and return a valid JSON object.
    
            {context}
    
            INPUT:
            {f"EXTRACTED TEXT: {ocr_text}" if ocr_text else "MULTIMODAL IMAGE SCAN"}
    
            -------------------------------------------------
            PIPELINE INSTRUCTIONS:
    
            1. OCR CLEANING: Standardize medical lab terms and units (mg/dL).
            2. ENTITY DETECTION: Extract Patient Identity (Name, ID, Hospital, Date).
            3. MEDICAL METRICS: Extract every detectable metric (Value, Unit, Confidence).
            4. COMPARISON ENGINE (CRITICAL):
               - If the detected patient matches one from '[DATABASE] Known Patients':
                 - Identify that patient's 'latest_metrics'.
                 - Compare EACH metric with the previous value.
                 - Calculate 'improvement_percentage' or 'decline_percentage' for each.
                 - Determine overall 'health_trend' (Improving, Stable, Deteriorating).
               - If no match or no previous metrics, skip comparison.
            5. RECOVERY SCORING (0-100): Start at 100 and deduct for abnormalities.
            6. DYNAMIC RECOMMENDATIONS (CRITICAL):
               Generate professional diet and activity advice based on LATEST metrics:
               - If KIDNEY indicators (Creatinine/Urea) are high: Recommend low sodium, low protein, and specific water guidance.
               - If DIABETIC indicators (Sugar/HbA1c) are high: Recommend low glycemic index foods.
               - If HEART/LIVER issues detected: Give targeted cardiac/hepatic diet advice.
               - Provide EXACT items for "foods_to_eat" and "foods_to_avoid".
               - Provide a clear "water_intake" guidance (e.g., "2.0 - 2.5 Liters per day").
               - Provide a "recovery_precautions" list for the patient to follow.
               - Provide a "calorie_goal" (e.g., "1800") and a "protein_goal" (e.g., "90g") based on recovery needs.
            7. MEDICATION EXTRACTION: Extract any prescribed medications found in the report.
    
            OUTPUT FORMAT:
            {{
                "status": "success",
                "report_type": "...",
                "patient_identity": {{
                    "patient_name": "...",
                    "patient_id": "...",
                    "uhid": "...",
                    "age": "...",
                    "gender": "...",
                    "hospital_name": "...",
                    "report_date": "..."
                }},
                "medical_metrics": {{
                    "metric_name": {{ "value": 0.0, "unit": "...", "confidence": 0.0 }}
                }},
                "risk_analysis": {{
                    "primary_risk": "...",
                    "secondary_risks": [],
                    "severity_level": "Excellent|Good|Moderate|Poor|Critical",
                    "summary": "Detailed medical summary..."
                }},
                "recovery_score": 0,
                "recommendations": {{
                    "foods_to_eat": ["Item 1", "Item 2"],
                    "foods_to_avoid": ["Item 1", "Item 2"],
                    "water_intake": "...",
                    "exercise": "...",
                    "precautions": [],
                    "calorie_goal": "1800",
                    "protein_goal": "90g",
                    "diet_summary": "High protein, low sodium recovery diet"
                }},
                "follow_up_analysis": {{
                    "is_follow_up": true,
                    "matched_patient": true,
                    "improvement_percentage": 15.5,
                    "decline_percentage": 0.0,
                    "health_trend": "Improving",
                    "comparisons": {{
                        "creatinine": {{ "previous": 1.5, "current": 1.2, "change_type": "improved", "change_percent": 20 }},
                        "uric_acid": {{ "previous": 9.2, "current": 7.5, "change_type": "improved", "change_percent": 18.5 }}
                    }}
                }},
                "medications": [
                    {{ "name": "Tablet A", "dosage": "500mg", "frequency": "Twice daily", "duration": "5 days", "instructions": "Take after meals" }}
                ]
            }}
            """
        return prompt

    def analyze_report(self, ocr_text=None, file_path=None, previous_metrics=None, existing_patients=None, is_identity_pass=False):
        """
        MASTER MEDICAL PIPELINE:
        OCR Cleaning -> Entity Extraction -> Risk Scoring -> Recovery Evaluation
        """
        
        if is_identity_pass:
            prompt = f"""
            Role: Medical Data Clerk
            Objective: Extract ONLY the patient identity and report type from the document.
            
            INPUT: {ocr_text if ocr_text else "IMAGE SCAN"}
            
            Return JSON:
            {{
                "report_type": "Initial|Follow-up",
                "patient_identity": {{
                    "patient_name": "...",
                    "patient_id": "...",
                    "uhid": "...",
                    "age": "...",
                    "gender": "...",
                    "hospital_name": "..."
                }}
            }}
            """
        else:
            prompt = self._generate_prompt(ocr_text, existing_patients, previous_metrics)

        # Execution with Fallbacks
        for model_name in [self.primary_model, self.fallback_model]:
            print(f"STEP 5: Sending request to Gemini ({model_name})")
            model = genai.GenerativeModel(model_name)
            
            try:
                content = [prompt]
                if file_path and os.path.exists(file_path):
                    content.append(Image.open(file_path))
                
                # Step 5: Gemini Request with 300s Timeout and Retry
                start_time = time.time()
                response = None
                
                # Manual Retry Loop
                for attempt in range(2):
                    try:
                        print(f"STEP 5: Sending request to Gemini (Attempt {attempt + 1})")
                        response = model.generate_content(
                            content, 
                            request_options={"timeout": 300}
                        )
                        break # Success
                    except Exception as e:
                        print(f"⚠️ Attempt {attempt + 1} failed: {str(e)}")
                        if attempt == 1: # Last attempt failed
                            print(f"❌ STEP 5 ALL ATTEMPTS FAILED")
                            return {
                                "status": "error",
                                "stage": "AI Analysis",
                                "message": "Gemini API request failed after retry",
                                "details": str(e)
                            }
                
                # Step 6: Gemini Response
                try:
                    if not response or not hasattr(response, 'text'):
                        raise Exception("Empty response from AI")
                    
                    raw_text = response.text.strip()
                    end_time = time.time()
                    print(f"STEP 6: Gemini response received ({end_time - start_time:.2f}s)")
                except Exception as ree:
                    print(f"❌ STEP 6 FAILED: {str(ree)}")
                    return {
                        "status": "error",
                        "stage": "AI Analysis",
                        "message": "AI returned empty or invalid response",
                        "details": str(ree)
                    }
                
                # Step 7: JSON Extraction
                try:
                    clean_json_str = self._extract_json(raw_text)
                    print(f"STEP 7: Extracted JSON block")
                except Exception as exe:
                    print(f"❌ STEP 7 FAILED: {str(exe)}")
                    return {
                        "status": "error",
                        "stage": "json_extraction",
                        "message": "Failed to isolate JSON block from AI response",
                        "details": str(exe)
                    }
                
                # Step 8: Safe JSON Parsing
                try:
                    data = json.loads(clean_json_str)
                    print(f"STEP 8: Parsed JSON success")
                except json.JSONDecodeError as je:
                    print(f"❌ STEP 8 FAILED: {str(je)}")
                    return {
                        "status": "error",
                        "stage": "json_parsing",
                        "message": "AI response format invalid (JSON decode failed)",
                        "details": f"Expected JSON but got: {clean_json_str[:200]}..."
                    }
                
                # Final Pass: Schema Perfection
                final_data = self._validate_and_fill_defaults(data)
                return final_data
                
            except Exception as e:
                print(f"⚠️ [AI] Model {model_name} failed unexpectedly: {str(e)}")
                continue

        return {
            "status": "error",
            "stage": "gemini_request",
            "message": "AI analysis engine failed after trying all models",
            "details": "Check internet connection or Gemini API key quota."
        }
