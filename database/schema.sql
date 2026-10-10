-- ============================================================================
-- SMART CARE: A HEALTHY ARCHIVE
-- Developed by MedShield Developers
-- Relational Database Architecture: PostgreSQL Schema (DDL)
-- ============================================================================

-- Extensions for UUID generation and cryptographic security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM Types
CREATE TYPE user_role_enum AS ENUM ('patient', 'doctor', 'hospital_admin', 'lab_technician');
CREATE TYPE consent_status_enum AS ENUM ('pending', 'approved', 'rejected', 'revoked', 'expired');
CREATE TYPE record_type_enum AS ENUM ('consultation', 'prescription', 'lab_report', 'diagnosis', 'document', 'immunization');
CREATE TYPE allergy_severity_enum AS ENUM ('Mild', 'Moderate', 'Severe', 'Critical');

-- 1. Healthcare Organizations Table
CREATE TABLE IF NOT EXISTS healthcare_organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(100) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Base Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'patient',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patient Health IDs (Ensures strict non-sequential uniqueness)
CREATE TABLE IF NOT EXISTS patient_health_ids (
    health_id VARCHAR(50) PRIMARY KEY, -- Formatted: SC-XXXX-XXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checksum_verified BOOLEAN DEFAULT TRUE,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    qr_code_hash VARCHAR(255) NOT NULL UNIQUE
);

-- 4. Patient Profiles Table
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    health_id VARCHAR(50) NOT NULL UNIQUE REFERENCES patient_health_ids(health_id),
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    address TEXT,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_relation VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Doctor Profiles Table
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    organization_id UUID REFERENCES healthcare_organizations(id) ON DELETE SET NULL,
    department VARCHAR(150),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Consent Requests & Active Grants Table
CREATE TABLE IF NOT EXISTS consent_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES healthcare_organizations(id),
    purpose TEXT NOT NULL,
    requested_scope VARCHAR(100) NOT NULL, -- 'Full Medical Records', 'Diagnostic Only', etc.
    requested_duration_hours INT NOT NULL DEFAULT 24,
    status consent_status_enum NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- 7. Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
    organization_id UUID REFERENCES healthcare_organizations(id),
    consultation_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    clinical_notes TEXT,
    systolic_bp INT,
    diastolic_bp INT,
    heart_rate INT,
    spo2 INT,
    temperature_f NUMERIC(4, 1),
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Diagnoses Table (ICD-10 aligned)
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    icd10_code VARCHAR(20),
    diagnosis_name VARCHAR(255) NOT NULL,
    diagnosis_type VARCHAR(50) DEFAULT 'Primary', -- 'Primary', 'Secondary', 'Differential'
    diagnosed_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 9. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id),
    issued_date DATE NOT NULL,
    instructions TEXT,
    refills_remaining INT DEFAULT 0
);

-- 10. Medication Entries Table
CREATE TABLE IF NOT EXISTS medication_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    special_instructions TEXT,
    status VARCHAR(50) DEFAULT 'Active'
);

-- 11. Allergies Table
CREATE TABLE IF NOT EXISTS allergies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    substance VARCHAR(255) NOT NULL,
    severity allergy_severity_enum NOT NULL,
    reaction TEXT NOT NULL,
    diagnosed_date DATE,
    recorded_by UUID REFERENCES doctor_profiles(id)
);

-- 12. Laboratory Reports Table
CREATE TABLE IF NOT EXISTS laboratory_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctor_profiles(id),
    organization_id UUID REFERENCES healthcare_organizations(id),
    test_name VARCHAR(255) NOT NULL,
    test_category VARCHAR(150) NOT NULL,
    test_date DATE NOT NULL,
    result_status VARCHAR(50) DEFAULT 'Normal',
    clinical_summary TEXT,
    report_file_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Medical Documents Table (Cloud Storage metadata)
CREATE TABLE IF NOT EXISTS medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    document_title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    file_mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL,
    is_verified_by_hospital BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Immutable Access Audit Logs Table
CREATE TABLE IF NOT EXISTS access_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_role user_role_enum NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for Ultra-Fast Queries & Consent Lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patient_health_id ON patient_profiles(health_id);
CREATE INDEX IF NOT EXISTS idx_consent_active ON consent_requests(patient_id, doctor_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id, consultation_date DESC);
CREATE INDEX IF NOT EXISTS idx_lab_reports_patient ON laboratory_reports(patient_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_patient ON access_audit_logs(patient_id, logged_at DESC);
