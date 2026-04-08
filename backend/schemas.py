from database.db_connection import ma
from marshmallow import fields
from models import User, HealthReport, DailyMetric

class HealthReportSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = HealthReport
        include_fk = True
        load_instance = True
        exclude = (
            "document_type", "patient_name", "patient_report_id", "uhid", "hospital_id",
            "report_age", "report_gender", "doctor_name", "department", "hospital_name",
            "report_date_str", "sample_collection_date", "all_metrics_json",
            "primary_risk", "secondary_risks_json", "severity_level",
            "foods_to_eat", "foods_to_avoid", "water_intake", "exercise", "precautions_json",
            "improvement_percentage", "decline_percentage", "health_trend", "improvement_comparison_json",
            "medications_json"
        )
    
    # Nested mapping for frontend consistency
    report_type = fields.String(attribute="document_type")
    patient_identity = fields.Method("get_patient_identity")
    medical_metrics = fields.Method("get_metrics")
    risk_analysis = fields.Method("get_risk_analysis")
    recommendations = fields.Method("get_recommendations")
    follow_up_analysis = fields.Method("get_follow_up_analysis")
    improvement = fields.Method("get_improvement")
    medications = fields.Method("get_medications")
    
    def _parse_json(self, value):
        import json
        try:
            return json.loads(value) if value else []
        except:
            return []

    def get_patient_identity(self, obj):
        return {
            "patient_name": obj.patient_name,
            "patient_id": obj.patient_report_id,
            "uhid": obj.uhid,
            "hospital_id": obj.hospital_id,
            "age": obj.report_age,
            "gender": obj.report_gender,
            "doctor_name": obj.doctor_name,
            "department": obj.department,
            "hospital_name": obj.hospital_name,
            "report_date": obj.report_date_str,
            "sample_collection_date": obj.sample_collection_date
        }

    def get_metrics(self, obj):
        import json
        try:
            return json.loads(obj.all_metrics_json) if obj.all_metrics_json else {}
        except:
            return {}
            
    def get_risk_analysis(self, obj):
        return {
            "primary_risk": obj.primary_risk,
            "secondary_risks": self._parse_json(obj.secondary_risks_json),
            "severity_level": obj.severity_level,
            "summary": f"Analyzed on {obj.created_at.strftime('%Y-%m-%d')}"
        }
            
    def get_recommendations(self, obj):
        return {
            "foods_to_eat": self._parse_json(obj.foods_to_eat),
            "foods_to_avoid": self._parse_json(obj.foods_to_avoid),
            "water_intake": obj.water_intake,
            "exercise_guidelines": obj.exercise,
            "recovery_precautions": self._parse_json(obj.precautions_json)
        }

    def get_follow_up_analysis(self, obj):
        return {
            "improvement_percentage": obj.improvement_percentage or 0.0,
            "decline_percentage": obj.decline_percentage or 0.0,
            "health_trend": obj.health_trend or "Baseline"
        }
    
    def get_improvement(self, obj):
        return self._parse_json_dict(obj.improvement_comparison_json)
    
    def get_medications(self, obj):
        return self._parse_json(obj.medications_json)

    def _parse_json_dict(self, value):
        import json
        try:
            return json.loads(value) if value else {}
        except:
            return {}

class DailyMetricSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DailyMetric
        include_fk = True
        load_instance = True

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
    
    reports = fields.List(fields.Nested(HealthReportSchema))
    metrics = fields.List(fields.Nested(DailyMetricSchema))

user_schema = UserSchema()
users_schema = UserSchema(many=True)
report_schema = HealthReportSchema()
reports_schema = HealthReportSchema(many=True)
metric_schema = DailyMetricSchema()
metrics_schema = DailyMetricSchema(many=True)
