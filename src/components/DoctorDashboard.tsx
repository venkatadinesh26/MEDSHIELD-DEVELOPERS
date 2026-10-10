import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileText,
  Plus,
  Send,
  Calendar,
  CheckCircle2,
  Building2,
  User,
  Clock,
  Sparkles,
  Pill,
} from 'lucide-react';
import type {
  DoctorProfile,
  PatientProfile,
  TimelineRecord,
  ConsentRequest,
  DuplicateTestAlert,
} from '../types/healthcare';
import { MedicalTimeline } from './MedicalTimeline';

interface DoctorDashboardProps {
  doctorProfile: DoctorProfile;
  allDoctors: DoctorProfile[];
  onSelectDoctor: (doctorId: string) => void;
  patientProfile: PatientProfile;
  timeline: TimelineRecord[];
  activeConsents: ConsentRequest[];
  onRequestConsent: (payload: {
    patientHealthId: string;
    doctorId: string;
    purpose: string;
    requestedScope: any;
    requestedDurationHours: number;
  }) => void;
  onRecordConsultation: (consultationData: any) => void;
  onCheckDuplicateTests: (tests: string[]) => Promise<DuplicateTestAlert[]>;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctorProfile,
  allDoctors,
  onSelectDoctor,
  patientProfile,
  timeline,
  activeConsents,
  onRequestConsent,
  onRecordConsultation,
  onCheckDuplicateTests,
}) => {
  const [lookupHealthId, setLookupHealthId] = useState(patientProfile.healthId);
  const [isSearched, setIsSearched] = useState(true);

  // Consent request form state
  const [requestPurpose, setRequestPurpose] = useState('Cardiovascular Consultation & Longitudinal Medication Review');
  const [requestScope, setRequestScope] = useState<'Full Medical Records' | 'Diagnostic & Lab Reports' | 'Prescription History Only'>('Full Medical Records');
  const [requestDuration, setRequestDuration] = useState(24);
  const [requestSentNotice, setRequestSentNotice] = useState(false);

  // Consultation Entry Station State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [diagnosesList, setDiagnosesList] = useState<string[]>(['I10 - Essential (primary) hypertension']);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [bpInput, setBpInput] = useState('122/80');
  const [pulseInput, setPulseInput] = useState('74');
  const [followUpDate, setFollowUpDate] = useState('2026-11-10');

  // Prescriptions builder
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [medNotes, setMedNotes] = useState('');
  const [prescriptionsList, setPrescriptionsList] = useState<any[]>([]);

  // Duplicate test order test simulation
  const [testOrderInput, setTestOrderInput] = useState('');
  const [duplicateAlerts, setDuplicateAlerts] = useState<DuplicateTestAlert[]>([]);
  const [isConsultationSaved, setIsConsultationSaved] = useState(false);

  // Check if current doctor has active approved consent for current patient
  const hasApprovedConsent = activeConsents.some(
    (c) =>
      c.patientHealthId === lookupHealthId &&
      c.doctorId === doctorProfile.userId &&
      c.status === 'approved' &&
      (!c.expiresAt || new Date(c.expiresAt) > new Date())
  );

  const handleTestOrderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTestOrderInput(val);
    if (val.trim().length >= 3) {
      const tests = val.split(',').map((t) => t.trim()).filter(Boolean);
      const alerts = await onCheckDuplicateTests(tests);
      setDuplicateAlerts(alerts);
    } else {
      setDuplicateAlerts([]);
    }
  };

  const handleAddDiagnosis = () => {
    if (diagnosisInput.trim()) {
      setDiagnosesList([...diagnosesList, diagnosisInput.trim()]);
      setDiagnosisInput('');
    }
  };

  const handleAddMedication = () => {
    if (medName.trim()) {
      setPrescriptionsList([
        ...prescriptionsList,
        {
          name: medName.trim(),
          dosage: medDosage.trim() || 'Standard',
          frequency: medFreq.trim() || 'Once daily',
          duration: medDuration.trim() || '30 days',
          instructions: medNotes.trim() || 'Take as advised with meals',
          status: 'Active',
        },
      ]);
      setMedName('');
      setMedDosage('');
      setMedFreq('');
      setMedDuration('');
      setMedNotes('');
    }
  };

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordConsultation({
      patientHealthId: lookupHealthId,
      doctorId: doctorProfile.userId,
      chiefComplaint: chiefComplaint || 'Routine outpatient clinical evaluation',
      diagnoses: diagnosesList,
      medications: prescriptionsList,
      clinicalNotes: clinicalNotes || 'Patient evaluated and vitals documented.',
      vitalsRecorded: { bp: bpInput, pulse: Number(pulseInput) },
      followUpDate,
    });
    setIsConsultationSaved(true);
    setTimeout(() => setIsConsultationSaved(false), 4000);
  };

  const handleSendConsentRequest = () => {
    onRequestConsent({
      patientHealthId: lookupHealthId,
      doctorId: doctorProfile.userId,
      purpose: requestPurpose,
      requestedScope: requestScope,
      requestedDurationHours: requestDuration,
    });
    setRequestSentNotice(true);
    setTimeout(() => setRequestSentNotice(false), 5000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Doctor Profile Banner & Physician Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={doctorProfile.avatar}
            alt={doctorProfile.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{doctorProfile.name}</h2>
              <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                Verified Physician
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{doctorProfile.specialization}</span>
              <span aria-hidden="true">·</span>
              <span>{doctorProfile.organizationName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">License: {doctorProfile.licenseNumber}</span>
            </div>
          </div>
        </div>

        {/* Doctor Switcher for Demo testing */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">Switch Active Doctor:</span>
          <select
            value={doctorProfile.userId}
            onChange={(e) => onSelectDoctor(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            {allDoctors.map((doc) => (
              <option key={doc.userId} value={doc.userId}>
                {doc.name} ({doc.specialization.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Health ID Lookup Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
              Clinical Registry Lookup
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Search Patient by Digital Health ID or QR Code
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={lookupHealthId}
                onChange={(e) => setLookupHealthId(e.target.value)}
                placeholder="Enter ID (e.g. SC-7821-4902)"
                className="pl-9 pr-3 py-2 text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase tabular-nums"
              />
            </div>
            <button
              onClick={() => setIsSearched(true)}
              className="px-4 py-2 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              Verify Access
            </button>
          </div>
        </div>
      </div>

      {/* CONDITIONAL BRANCH: Authorized vs Blocked Gate */}
      {!hasApprovedConsent ? (
        /* ACCESS RESTRICTED / CONSENT GATE */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Protected Medical Records: Consent Required
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Patient <strong className="text-slate-900 font-semibold">{patientProfile.name}</strong> ({lookupHealthId}) has strict consent-based protection enabled. You must submit an explicit access request before clinical history can be decrypted and unlocked.
            </p>
          </div>

          {requestSentNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              Access request transmitted to {patientProfile.name}. Patient can approve from the Patient Portal.
            </div>
          )}

          {/* Consent Request Form */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Submit Access Request to Patient
            </h4>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Clinical Purpose of Access
              </label>
              <input
                type="text"
                value={requestPurpose}
                onChange={(e) => setRequestPurpose(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Requested Scope
                </label>
                <select
                  value={requestScope}
                  onChange={(e) => setRequestScope(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Full Medical Records">Full Medical Records</option>
                  <option value="Diagnostic & Lab Reports">Diagnostic & Lab Reports Only</option>
                  <option value="Prescription History Only">Prescription History Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Requested Duration
                </label>
                <select
                  value={requestDuration}
                  onChange={(e) => setRequestDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value={1}>1 Hour (Emergency Consultation)</option>
                  <option value={24}>24 Hours (Standard Outpatient)</option>
                  <option value={48}>48 Hours (Extended Evaluation)</option>
                  <option value={168}>7 Days (Inpatient Treatment)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSendConsentRequest}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Access Request to Patient</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACCESS GRANTED: CLINICAL WORKSTATION */
        <div className="space-y-8">
          {/* Patient Overview Header & Active Consent Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Authorized Clinical Access Active
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {patientProfile.name} · <span className="font-mono tabular-nums">{patientProfile.healthId}</span>
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Blood Group: {patientProfile.bloodGroup} · Age: 32 · Allergies: {patientProfile.allergies.map(a => a.substance).join(', ')}
                  </div>
                </div>
              </div>

              <div className="text-xs text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200/80 font-medium">
                Consent valid until tomorrow (24h)
              </div>
            </div>
          </div>

          {/* DUPLICATE-TEST AWARENESS SYSTEM (Core Innovation 3.D) */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Duplicate-Test Awareness Engine
              </h3>
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                Live Clinical Advisory
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Before ordering new diagnostic panels or radiological scans, review recent records available in the archive to prevent avoidable duplicate testing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>HbA1c & Glycemic Panel</span>
                  <span className="text-[11px] font-mono">Sep 22, 2026 (18 days ago)</span>
                </div>
                <div className="text-slate-700">
                  Facility: Apex Diagnostic Laboratories · Ordered by: Dr. Aisha Rao
                </div>
                <div className="text-slate-900 font-medium font-mono">
                  Result: HbA1c 5.4% (Optimal) · Glucose 94 mg/dL
                </div>
                <div className="text-amber-800 text-[11px] font-medium pt-1">
                  Advisory: Routine 3-month glycemic interval has not elapsed.
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>Advanced Lipid Profile</span>
                  <span className="text-[11px] font-mono">Sep 14, 2026 (26 days ago)</span>
                </div>
                <div className="text-slate-700">
                  Facility: Apex Diagnostic Laboratories · Ordered by: Dr. Marcus Chen
                </div>
                <div className="text-slate-900 font-medium font-mono">
                  Result: Total Chol 182 · LDL 104 · HDL 58 · Triglycerides 110
                </div>
                <div className="text-amber-800 text-[11px] font-medium pt-1">
                  Advisory: Stable on Atorvastatin 10mg. Retesting within 30 days is clinically redundant.
                </div>
              </div>
            </div>
          </div>

          {/* CONSULTATION ENTRY STATION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Clinical Consultation & E-Prescription Entry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Records are permanently committed to the patient's longitudinal ledger with verified physician signature.
                </p>
              </div>

              {isConsultationSaved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Consultation committed to archive!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitConsultation} className="space-y-6">
              {/* Vitals Recording */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={bpInput}
                    onChange={(e) => setBpInput(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full bg-white p-2 border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={pulseInput}
                    onChange={(e) => setPulseInput(e.target.value)}
                    className="w-full bg-white p-2 border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-white p-2 border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Physician Signature</label>
                  <div className="text-xs font-semibold text-slate-900 p-2 bg-slate-100 rounded truncate">
                    {doctorProfile.name}
                  </div>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">
                  Chief Complaint & History of Present Illness
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Patient reports mild palpitations following caffeine intake; blood pressure stable on current statin regimen..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>

              {/* Diagnoses (ICD-10) */}
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">
                  Clinical Diagnoses (ICD-10)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={diagnosisInput}
                    onChange={(e) => setDiagnosisInput(e.target.value)}
                    placeholder="e.g. R00.2 - Palpitations, unspecified"
                    className="flex-1 text-xs p-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDiagnosis}
                    className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Add Diagnosis
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosesList.map((d, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md border border-slate-200 font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real-Time Duplicate Test Order Checker */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Order Laboratory / Diagnostic Tests (Awareness Check)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Type 'HbA1c' or 'Lipid' to test duplicate engine
                  </span>
                </div>
                <input
                  type="text"
                  value={testOrderInput}
                  onChange={handleTestOrderChange}
                  placeholder="Type diagnostic tests (e.g. HbA1c, Complete Blood Count, Lipid Profile)..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                />

                {duplicateAlerts.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {duplicateAlerts.map((al, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1"
                      >
                        <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Potential Duplicate Diagnostic Detected: "{al.testName}"</span>
                        </div>
                        <div className="text-amber-800">
                          {al.advisory}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* E-Prescription Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Electronic Prescriptions (e-Rx)
                  </span>
                  <span className="text-xs text-slate-400">
                    {prescriptionsList.length} items queued
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="Drug Name (e.g. Metoprolol)"
                    className="p-2 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="Dosage (e.g. 25 mg)"
                    className="p-2 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={medFreq}
                    onChange={(e) => setMedFreq(e.target.value)}
                    placeholder="Frequency (e.g. BID)"
                    className="p-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    + Add Medication
                  </button>
                </div>

                {prescriptionsList.length > 0 && (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {prescriptionsList.map((p, idx) => (
                      <div key={idx} className="p-2.5 bg-white text-xs flex justify-between items-center">
                        <span className="font-medium text-slate-900">
                          {p.name} - {p.dosage} ({p.frequency})
                        </span>
                        <span className="text-slate-500">{p.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-800 block mb-1">
                  Physician Progress & Follow-Up Notes
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Patient counseled on lifestyle modifications and medication adherence. Review in 4 weeks."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Record Consultation & Sign to Archive
                </button>
              </div>
            </form>
          </div>

          {/* Full Longitudinal Medical Timeline */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Patient Longitudinal History (Doctor View)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review past consultations, prescriptions, and lab findings ordered by other clinics.
              </p>
            </div>

            <MedicalTimeline
              records={timeline}
            />
          </div>
        </div>
      )}
    </div>
  );
};
