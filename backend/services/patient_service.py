from database.models import Patient, HealthReport, User, db
import json

class PatientService:
    @staticmethod
    def identify_or_create_patient(user_id, identity, is_follow_up_request=False):
        """
        Confidence-based matching logic:
        - High weight on name match with User's registered name
        - Confidence score based on name, age, gender, hospital
        """
        extracted_name = identity.get('patient_name', '')
        extracted_id = identity.get('patient_id') or identity.get('uhid') or identity.get('id')
        extracted_age = str(identity.get('age', ''))
        extracted_gender = identity.get('gender')
        extracted_hospital = identity.get('hospital_name')

        print(f"🔍 [MATCHING] Attempting to match: {extracted_name} ({extracted_id})")

        user = User.query.get(user_id)
        patients = Patient.query.filter_by(user_id=user_id).all()
        
        best_match = None
        highest_score = 0

        # Check against User's own name (Primary Profile)
        user_name_match = False
        if user and user.full_name and extracted_name:
            if user.full_name.lower().strip() in extracted_name.lower().strip() or \
               extracted_name.lower().strip() in user.full_name.lower().strip():
                user_name_match = True

        for p in patients:
            score = 0
            
            # CORE IDENTIFIERS (Highest Weight)
            if extracted_id and p.patient_id and str(extracted_id).strip().lower() == str(p.patient_id).strip().lower():
                score += 80
            
            # Name Matching
            if extracted_name and p.patient_name:
                p_name = p.patient_name.strip().lower()
                e_name = extracted_name.strip().lower()
                if p_name == e_name:
                    score += 40
                elif e_name in p_name or p_name in e_name:
                    score += 25
            
            # PRIMARY USER BONUS
            if user_name_match and p.patient_name and user.full_name.lower() in p.patient_name.lower():
                score += 20

            if extracted_age and p.age and extracted_age.strip() == str(p.age).strip():
                score += 10
                
            if extracted_gender and p.gender and extracted_gender.strip().lower() == p.gender.strip().lower():
                score += 5
                
            if extracted_hospital and p.hospital and extracted_hospital.strip().lower() in p.hospital.strip().lower():
                score += 5

            if score > highest_score:
                highest_score = score
                best_match = p

        print(f"📊 [MATCHING] Best match score: {highest_score}")
        
        # STRICT MATCHING FOR FOLLOW-UPS
        if is_follow_up_request:
            if highest_score >= 45:
                print(f"✅ [MATCHING] Match found for Follow-up (Score {highest_score})")
                return best_match, "existing_patient"
            else:
                print(f"❌ [MATCHING] Follow-up mismatch. Score {highest_score} below threshold.")
                return None, "mismatch"

        # RELAXED MATCHING FOR INITIAL REPORTS
        if highest_score >= 35:
            return best_match, "existing_patient"

        # Create new patient if no match found
        new_patient = Patient(
            user_id=user_id,
            patient_name=extracted_name,
            patient_id=extracted_id,
            age=extracted_age,
            gender=extracted_gender,
            hospital=extracted_hospital
        )
        db.session.add(new_patient)
        db.session.commit()
        return new_patient, "new_patient"

    @staticmethod
    def get_patient_history(patient_id):
        """
        Retrieves all reports for a specific patient.
        """
        return HealthReport.query.filter_by(patient_id=patient_id).order_by(HealthReport.created_at.desc()).all()
