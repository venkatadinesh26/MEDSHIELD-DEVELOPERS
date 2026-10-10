export type UserRole = 'patient' | 'doctor' | 'hospital_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  isVerified: boolean;
}

export interface Allergy {
  id: string;
  substance: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  reaction: string;
  diagnosedDate: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'Active' | 'Completed' | 'Discontinued';
}

export interface PatientProfile {
  id: string;
  userId: string;
  healthId: string; // e.g. "SC-7821-4902"
  name: string;
  dob: string;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: Allergy[];
  chronicConditions: string[];
  activeMedications: MedicationItem[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spo2: number;
    glucoseFast: number;
    bmi: number;
    lastUpdated: string;
  };
}

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  licenseNumber: string;
  specialization: string;
  organizationName: string;
  department: string;
  isVerified: boolean;
  avatar?: string;
  contactEmail: string;
}

export interface HealthcareOrganization {
  id: string;
  name: string;
  type: string;
  licenseNumber: string;
  address: string;
  contactEmail: string;
  accreditedSince: string;
  activeDoctorsCount: number;
}

export type TimelineRecordType =
  | 'consultation'
  | 'prescription'
  | 'lab_report'
  | 'diagnosis'
  | 'document'
  | 'immunization';

export interface LabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
}

export interface TimelineRecord {
  id: string;
  patientId: string;
  type: TimelineRecordType;
  title: string;
  category: string;
  date: string; // ISO or YYYY-MM-DD
  doctorName?: string;
  doctorSpecialty?: string;
  organizationName: string;
  isVerifiedByHospital: boolean;
  summary: string;
  details?: {
    chiefComplaint?: string;
    diagnoses?: string[];
    medications?: MedicationItem[];
    labParameters?: LabParameter[];
    clinicalNotes?: string;
    vitalsRecorded?: {
      bp?: string;
      pulse?: number;
      temp?: string;
    };
    fileName?: string;
    fileSize?: string;
    fileUrl?: string;
    testStatus?: 'Normal' | 'Abnormal' | 'Critical' | 'Borderline';
  };
}

export type ConsentStatus = 'pending' | 'approved' | 'rejected' | 'revoked' | 'expired';

export interface ConsentRequest {
  id: string;
  patientId: string;
  patientHealthId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  organizationName: string;
  purpose: string;
  requestedScope: 'Full Medical Records' | 'Diagnostic & Lab Reports' | 'Prescription History Only';
  requestedDurationHours: number;
  status: ConsentStatus;
  requestedAt: string;
  grantedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface AccessAuditLog {
  id: string;
  patientId: string;
  targetHealthId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action:
    | 'CONSENT_REQUESTED'
    | 'CONSENT_GRANTED'
    | 'CONSENT_REJECTED'
    | 'CONSENT_REVOKED'
    | 'RECORDS_VIEWED'
    | 'CONSULTATION_RECORDED'
    | 'DOCUMENT_UPLOADED'
    | 'UNAUTHORIZED_ACCESS_BLOCKED'
    | 'HEALTH_ID_GENERATED'
    | 'DUPLICATE_TEST_WARNING_TRIGGERED';
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FLAGGED';
}

export interface DuplicateTestAlert {
  testName: string;
  isPotentialDuplicate: boolean;
  previousDate: string;
  previousDoctor: string;
  previousFacility: string;
  previousResult: string;
  daysAgo: number;
  advisory: string;
}
