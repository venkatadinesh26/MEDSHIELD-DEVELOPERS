import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoGuideBanner } from './components/DemoGuideBanner';
import { OverviewHub } from './components/OverviewHub';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { ConsentManager } from './components/ConsentManager';
import { AuditLogView } from './components/AuditLogView';
import { HospitalAdminView } from './components/HospitalAdminView';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { QrCodeModal } from './components/QrCodeModal';
import { AutomatedTestsView } from './components/AutomatedTestsView';
import { PresentationScriptModal } from './components/PresentationScriptModal';
import type {
  User,
  UserRole,
  PatientProfile,
  DoctorProfile,
  HealthcareOrganization,
  TimelineRecord,
  ConsentRequest,
  AccessAuditLog,
  DuplicateTestAlert,
} from './types/healthcare';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [demoStep, setDemoStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_pat_1',
    email: 'priya.sharma@example.com',
    name: 'Priya Sharma',
    role: 'patient',
    phone: '+1 (555) 382-9014',
    avatar: '/src/assets/images/patient_avatar_1791638897666.jpg',
    isVerified: true,
  });

  // Doctor Profiles
  const allDoctors: DoctorProfile[] = [
    {
      id: 'doc_1',
      userId: 'usr_doc_1',
      name: 'Dr. Aisha Rao, MD',
      licenseNumber: 'MED-CA-904128',
      specialization: 'Cardiology & Vascular Medicine',
      organizationName: 'Metro Heart Institute',
      department: 'Cardiovascular Care',
      isVerified: true,
      avatar: '/src/assets/images/doctor_avatar_female_1791638869662.jpg',
      contactEmail: 'aisha.rao@metrohealth.org',
    },
    {
      id: 'doc_2',
      userId: 'usr_doc_2',
      name: 'Dr. Marcus Chen, MD',
      licenseNumber: 'MED-CA-518339',
      specialization: 'Internal Medicine & Preventative Health',
      organizationName: 'City Care Clinic',
      department: 'Primary Care',
      isVerified: true,
      avatar: '/src/assets/images/doctor_avatar_male_1791638884755.jpg',
      contactEmail: 'marcus.chen@citycare.org',
    },
  ];

  const [activeDoctorId, setActiveDoctorId] = useState<string>('usr_doc_1');
  const currentDoctorProfile =
    allDoctors.find((d) => d.userId === activeDoctorId) || allDoctors[0];

  // Patient Profile state
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    id: 'pat_1',
    userId: 'usr_pat_1',
    healthId: 'SC-7821-4902',
    name: 'Priya Sharma',
    dob: '1994-05-18',
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+1 (555) 382-9014',
    email: 'priya.sharma@example.com',
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Spouse',
      phone: '+1 (555) 382-9019',
    },
    address: '448 Pine Ridge Avenue, Suite 4B, San Francisco, CA',
    insuranceProvider: 'BlueShield Comprehensive Care',
    insurancePolicyNumber: 'BSC-882941-X7',
    allergies: [
      {
        id: 'alg_1',
        substance: 'Penicillin',
        severity: 'Severe',
        reaction: 'Generalized urticaria, bronchospasm',
        diagnosedDate: '2021-03-12',
      },
      {
        id: 'alg_2',
        substance: 'Sulfa Drugs',
        severity: 'Moderate',
        reaction: 'Cutaneous maculopapular rash',
        diagnosedDate: '2023-08-04',
      },
    ],
    chronicConditions: ['Dyslipidemia (Mild)', 'Seasonal Allergic Rhinitis'],
    activeMedications: [
      {
        name: 'Atorvastatin Calcium',
        dosage: '10 mg',
        frequency: 'Once daily at bedtime',
        duration: 'Ongoing (3 months refill)',
        instructions: 'Take after dinner. Monitor liver panel.',
        status: 'Active',
      },
      {
        name: 'Cetirizine Hydrochloride',
        dosage: '10 mg',
        frequency: 'As needed for flare-ups',
        duration: 'PRN',
        instructions: 'Non-sedating antihistamine.',
        status: 'Active',
      },
    ],
    vitals: {
      bloodPressure: '118/76 mmHg',
      heartRate: 72,
      spo2: 99,
      glucoseFast: 94,
      bmi: 22.4,
      lastUpdated: '2026-09-22',
    },
  });

  // Longitudinal Timeline Records
  const [timeline, setTimeline] = useState<TimelineRecord[]>([]);

  // Consents
  const [consents, setConsents] = useState<ConsentRequest[]>([]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AccessAuditLog[]>([]);

  // Organizations
  const [organizations, setOrganizations] = useState<HealthcareOrganization[]>([
    {
      id: 'org_metro',
      name: 'Metro Health System & Heart Institute',
      type: 'Multi-Specialty Hospital',
      licenseNumber: 'HOSP-CA-10492',
      address: '1200 Health Sciences Way, San Francisco, CA',
      contactEmail: 'contact@metrohealth.org',
      accreditedSince: '2012',
      activeDoctorsCount: 148,
    },
    {
      id: 'org_city',
      name: 'City Care Outpatient Clinic',
      type: 'Primary Care Clinic',
      licenseNumber: 'CLIN-CA-77821',
      address: '88 Market Promenade, Suite 300, San Francisco, CA',
      contactEmail: 'care@citycare.org',
      accreditedSince: '2018',
      activeDoctorsCount: 24,
    },
    {
      id: 'org_apex_lab',
      name: 'Apex Diagnostic & Molecular Laboratories',
      type: 'Clinical Laboratory',
      licenseNumber: 'LAB-CLIA-9921',
      address: '500 BioPark Blvd, South San Francisco, CA',
      contactEmail: 'results@apexlabs.com',
      accreditedSince: '2015',
      activeDoctorsCount: 12,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch initial data from Express backend
  const loadInitialData = async () => {
    try {
      // 1. Timeline
      const tRes = await fetch(`/api/patient/${patientProfile.healthId}/timeline`);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTimeline(tData.records || []);
      }

      // 2. Consents
      const cRes = await fetch(`/api/consent/patient/${patientProfile.healthId}`);
      if (cRes.ok) {
        const cData = await cRes.json();
        setConsents(cData.consents || []);
      }

      // 3. Audit Logs
      const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setAuditLogs(aData.logs || []);
      }
    } catch (e) {
      console.warn('Backend loading defaulted to in-memory store:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [patientProfile.healthId]);

  // Role Switcher Handler
  const handleSwitchUser = (role: UserRole) => {
    if (role === 'patient') {
      setCurrentUser({
        id: 'usr_pat_1',
        email: 'priya.sharma@example.com',
        name: 'Priya Sharma',
        role: 'patient',
        phone: '+1 (555) 382-9014',
        avatar: '/src/assets/images/patient_avatar_1791638897666.jpg',
        isVerified: true,
      });
      showToast('Switched to Patient view (Priya Sharma, Health ID: SC-7821-4902)');
    } else if (role === 'doctor') {
      const activeDoc = allDoctors.find((d) => d.userId === activeDoctorId) || allDoctors[0];
      setCurrentUser({
        id: activeDoc.userId,
        email: activeDoc.contactEmail,
        name: activeDoc.name,
        role: 'doctor',
        phone: '+1 (555) 721-4820',
        avatar: activeDoc.avatar,
        isVerified: true,
      });
      showToast(`Switched to Doctor Clinic view (${activeDoc.name})`);
    } else {
      setCurrentUser({
        id: 'usr_admin_1',
        email: 'admin@metrohealth.org',
        name: 'Metro Health Admin Office',
        role: 'hospital_admin',
        phone: '+1 (555) 900-4400',
        isVerified: true,
      });
      showToast('Switched to Hospital Network Administration view');
    }
  };

  // Duplicate Check Engine Caller
  const handleCheckDuplicateTests = async (tests: string[]): Promise<DuplicateTestAlert[]> => {
    try {
      const res = await fetch('/api/doctor/check-duplicate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientHealthId: patientProfile.healthId,
          testNames: tests,
        }),
      });
      const data = await res.json();
      return data.alerts || [];
    } catch (e) {
      return [];
    }
  };

  // Upload Document Handler
  const handleUploadDocument = async (payload: any) => {
    try {
      const res = await fetch(`/api/patient/${patientProfile.healthId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setTimeline((prev) => [data.record, ...prev]);
        showToast(`Document "${payload.title}" securely archived and indexed.`);
        // Reload audit
        const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (e) {
      showToast('Document uploaded locally.');
    }
  };

  // Consent Handlers
  const handleRequestConsent = async (payload: any) => {
    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setConsents((prev) => [data.consent, ...prev]);
        showToast('Access request submitted to patient portal.');
        // Refresh audit
        const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveConsent = async (consentId: string, durationHours: number) => {
    try {
      const res = await fetch('/api/consent/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentId, decision: 'approve', durationHours }),
      });
      const data = await res.json();
      if (res.ok) {
        setConsents((prev) =>
          prev.map((c) => (c.id === consentId ? data.consent : c))
        );
        showToast(`Granted 24-hour access to ${data.consent.doctorName}.`);
        // Refresh audit
        const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectConsent = async (consentId: string) => {
    try {
      const res = await fetch('/api/consent/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentId, decision: 'reject' }),
      });
      const data = await res.json();
      if (res.ok) {
        setConsents((prev) =>
          prev.map((c) => (c.id === consentId ? data.consent : c))
        );
        showToast('Declined healthcare access request.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    try {
      const res = await fetch('/api/consent/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setConsents((prev) =>
          prev.map((c) => (c.id === consentId ? data.consent : c))
        );
        showToast('Access immediately revoked. Doctor access is now blocked.');
        // Refresh audit
        const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Consultation Recording Handler
  const handleRecordConsultation = async (consultationData: any) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationData),
      });
      const data = await res.json();
      if (res.ok) {
        setTimeline((prev) => [data.record, ...prev]);
        showToast('Consultation and prescriptions committed to archive.');
        // Update medications on patient profile
        if (consultationData.medications && consultationData.medications.length > 0) {
          setPatientProfile((prev) => ({
            ...prev,
            activeMedications: [...consultationData.medications, ...prev.activeMedications],
          }));
        }
        // Refresh audit
        const aRes = await fetch(`/api/audit-logs/${patientProfile.healthId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAuditLogs(aData.logs || []);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Assisted Patient Registration Handler
  const handleRegisterAssistedPatient = async (patientData: any) => {
    try {
      const res = await fetch('/api/auth/register-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Created new patient profile! Health ID: ${data.healthId}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Interactive Demo Step Sequencer
  const handleSelectDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    switch (stepNumber) {
      case 1:
        // Step 1: Patient Health ID & QR
        handleSwitchUser('patient');
        setCurrentTab('patient');
        setIsQrModalOpen(true);
        showToast('Step 1: Patient Digital Health ID & Zero-Exposure QR code');
        break;
      case 2:
        // Step 2: Doctor Lookup (Dr. Marcus Chen, without consent)
        setActiveDoctorId('usr_doc_2');
        handleSwitchUser('doctor');
        setCurrentTab('doctor');
        showToast('Step 2: Dr. Marcus Chen looks up patient without consent -> BLOCKED gate');
        break;
      case 3:
        // Step 3: Grant Consent
        handleSwitchUser('patient');
        setCurrentTab('consents');
        showToast('Step 3: Patient reviews pending request and grants 24h access');
        break;
      case 4:
        // Step 4: Doctor View with Unlocked Timeline & Duplicate-Test Alert
        setActiveDoctorId('usr_doc_1'); // Dr. Aisha Rao who has active consent
        handleSwitchUser('doctor');
        setCurrentTab('doctor');
        showToast('Step 4: Unlocked longitudinal timeline & duplicate-test awareness alert');
        break;
      case 5:
        // Step 5: Doctor Consultation & E-Prescription Entry
        setActiveDoctorId('usr_doc_1');
        handleSwitchUser('doctor');
        setCurrentTab('doctor');
        showToast('Step 5: Record clinical consultation, ICD-10 diagnoses & prescriptions');
        break;
      case 6:
        // Step 6: Revoke & Block + Audit
        handleSwitchUser('patient');
        setCurrentTab('consents');
        showToast('Step 6: Patient revokes access -> immediate block logged in Audit Trail');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Demo Guide Banner for Hackathon Presentation */}
      <DemoGuideBanner
        currentStep={demoStep}
        onSelectStep={handleSelectDemoStep}
        onOpenTests={() => setIsTestsOpen(true)}
        onOpenPitch={() => setIsPitchOpen(true)}
      />

      {/* Primary Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenDemoScript={() => setIsPitchOpen(true)}
        onOpenTests={() => setIsTestsOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'overview' && (
          <OverviewHub
            onGoToPatient={() => {
              handleSwitchUser('patient');
              setCurrentTab('patient');
            }}
            onGoToDoctor={() => {
              handleSwitchUser('doctor');
              setCurrentTab('doctor');
            }}
            onOpenPitch={() => setIsPitchOpen(true)}
            onOpenTests={() => setIsTestsOpen(true)}
          />
        )}

        {currentTab === 'patient' && (
          <PatientDashboard
            profile={patientProfile}
            timeline={timeline}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onOpenConsents={() => setCurrentTab('consents')}
            onOpenAudit={() => setCurrentTab('audit')}
          />
        )}

        {currentTab === 'doctor' && (
          <DoctorDashboard
            doctorProfile={currentDoctorProfile}
            allDoctors={allDoctors}
            onSelectDoctor={(docId) => setActiveDoctorId(docId)}
            patientProfile={patientProfile}
            timeline={timeline}
            activeConsents={consents}
            onRequestConsent={handleRequestConsent}
            onRecordConsultation={handleRecordConsultation}
            onCheckDuplicateTests={handleCheckDuplicateTests}
          />
        )}

        {currentTab === 'consents' && (
          <ConsentManager
            consents={consents}
            onApproveConsent={handleApproveConsent}
            onRejectConsent={handleRejectConsent}
            onRevokeConsent={handleRevokeConsent}
          />
        )}

        {currentTab === 'audit' && (
          <AuditLogView logs={auditLogs} />
        )}

        {currentTab === 'hospital' && (
          <HospitalAdminView
            organizations={organizations}
            doctors={allDoctors}
            onRegisterPatientAssisted={handleRegisterAssistedPatient}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadDocument}
        onCheckDuplicate={handleCheckDuplicateTests}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        profile={patientProfile}
      />

      <AutomatedTestsView
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
      />

      <PresentationScriptModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2 max-w-md animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-800">
              Smart Care: A Healthy Archive
            </span>{' '}
            · Developed by{' '}
            <strong className="text-slate-900 font-semibold">
              MedShield Developers
            </strong>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPitchOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Demonstration Script
            </button>
            <span>·</span>
            <button
              onClick={() => setIsTestsOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Automated Tests Matrix
            </button>
            <span>·</span>
            <span>PostgreSQL & FastAPI Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
