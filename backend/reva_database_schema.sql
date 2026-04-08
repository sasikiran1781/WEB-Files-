-- REVA Advanced Medical Database Schema (Auto-generated)


CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	full_name VARCHAR(100) NOT NULL, 
	email VARCHAR(100) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	phone VARCHAR(20), 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (email)
)

;


CREATE TABLE patients (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	user_id INTEGER NOT NULL, 
	patient_name VARCHAR(100), 
	patient_id VARCHAR(100), 
	age VARCHAR(20), 
	gender VARCHAR(20), 
	hospital VARCHAR(200), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
)

;


CREATE TABLE health_reports (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	patient_id INTEGER NOT NULL, 
	report_type VARCHAR(100) NOT NULL, 
	report_file VARCHAR(255), 
	medical_metrics_json JSON, 
	patient_identity_json JSON, 
	recovery_score INTEGER, 
	risk_level VARCHAR(50), 
	primary_risk VARCHAR(255), 
	diagnosis TEXT, 
	recommendations_json JSON, 
	medications_json JSON, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(patient_id) REFERENCES patients (id)
)

;


CREATE TABLE followup_comparisons (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	patient_id INTEGER NOT NULL, 
	previous_report_id INTEGER, 
	current_report_id INTEGER NOT NULL, 
	improvement_percentage FLOAT, 
	decline_percentage FLOAT, 
	health_trend VARCHAR(50), 
	comparison_summary TEXT, 
	comparisons_json JSON, 
	PRIMARY KEY (id), 
	FOREIGN KEY(patient_id) REFERENCES patients (id), 
	FOREIGN KEY(previous_report_id) REFERENCES health_reports (id), 
	FOREIGN KEY(current_report_id) REFERENCES health_reports (id)
)

;


CREATE TABLE medical_metrics_data (
	id INTEGER NOT NULL AUTO_INCREMENT, 
	report_id INTEGER NOT NULL, 
	metric_name VARCHAR(100) NOT NULL, 
	value VARCHAR(50), 
	unit VARCHAR(50), 
	confidence FLOAT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(report_id) REFERENCES health_reports (id)
)

;

