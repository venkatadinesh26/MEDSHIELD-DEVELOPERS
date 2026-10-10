import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  FilePlus,
  Lock,
  History,
  AlertCircle,
  Pill,
  Heart,
  Droplet,
  Activity,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';
import type { PatientProfile, TimelineRecord } from '../types/healthcare';
import { MedicalTimeline } from './MedicalTimeline';

interface PatientDashboardProps {
  profile: PatientProfile;
  timeline: TimelineRecord[];
  onOpenUpload: () => void;
  onOpenQrModal: () => void;
  onOpenConsents: () => void;
  onOpenAudit: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  profile,
  timeline,
  onOpenUpload,
  onOpenQrModal,
  onOpenConsents,
  onOpenAudit,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Patient Header & Digital Health ID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Patient Identity & Health ID Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/patient_avatar_1791638897666.jpg"
                alt={profile.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified Citizen
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>DOB: {profile.dob}</span>
                  <span aria-hidden="true">·</span>
                  <span>{profile.gender}</span>
                  <span aria-hidden="true">·</span>
                  <span>Blood Type: {profile.bloodGroup}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Digital Health ID Section */}
          <div className="mt-6 bg-slate-900 text-white rounded-xl p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold tracking-wider uppercase text-sky-400">
                  National Digital Health ID · MedShield Archive
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="font-mono text-2xl font-bold tracking-wider text-white tabular-nums">
                    {profile.healthId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    title="Copy Health ID"
                    className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Non-sequential cryptographic identifier · Protected by consent firewall
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenQrModal}
                  className="flex flex-col items-center gap-1 p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                >
                  <QrCode className="w-10 h-10 text-slate-900" />
                  <span className="text-[10px] font-semibold uppercase">Scan QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">Emergency Contact</span>
              <span className="font-medium text-slate-900 mt-0.5 block truncate">
                {profile.emergencyContact.name} ({profile.emergencyContact.relationship})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Primary Phone</span>
              <span className="font-medium text-slate-900 mt-0.5 block font-mono">
                {profile.phone}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Insurance Provider</span>
              <span className="font-medium text-slate-900 mt-0.5 block truncate">
                {profile.insuranceProvider}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Policy Number</span>
              <span className="font-medium text-slate-900 mt-0.5 block font-mono">
                {profile.insurancePolicyNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Summary, Vitals & Allergies */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Vitals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-sky-700" />
              <span>Current Clinical Vitals</span>
              <span className="text-xs text-slate-400 font-normal ml-auto">
                Updated {profile.vitals.lastUpdated}
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Blood Pressure</span>
                <span className="text-sm font-semibold text-slate-900 font-mono mt-0.5 block tabular-nums">
                  {profile.vitals.bloodPressure}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Heart Rate</span>
                <span className="text-sm font-semibold text-slate-900 font-mono mt-0.5 block tabular-nums">
                  {profile.vitals.heartRate} bpm
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Oxygen (SpO2)</span>
                <span className="text-sm font-semibold text-slate-900 font-mono mt-0.5 block tabular-nums">
                  {profile.vitals.spo2}%
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Fasting Glucose</span>
                <span className="text-sm font-semibold text-slate-900 font-mono mt-0.5 block tabular-nums">
                  {profile.vitals.glucoseFast} mg/dL
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">BMI</span>
                <span className="text-sm font-semibold text-slate-900 font-mono mt-0.5 block tabular-nums">
                  {profile.vitals.bmi}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Blood Group</span>
                <span className="text-sm font-semibold text-rose-700 font-mono mt-0.5 block">
                  {profile.bloodGroup}
                </span>
              </div>
            </div>
          </div>

          {/* Allergies & Safety Warnings */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Documented Allergies & Adverse Reactions</span>
            </h3>

            <div className="space-y-2.5">
              {profile.allergies.map((alg) => (
                <div
                  key={alg.id}
                  className="p-2.5 bg-rose-50/70 rounded-lg border border-rose-100 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-900">{alg.substance}</span>
                    <span className="text-[11px] font-semibold text-rose-700 uppercase">
                      {alg.severity} Severity
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1">Reaction: {alg.reaction}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation to Consents & Audits */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenConsents}
              className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-sky-300 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Consent Access</span>
                <Lock className="w-4 h-4 text-sky-700" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Manage doctor permissions
              </span>
            </button>
            <button
              onClick={onOpenAudit}
              className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-sky-300 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Audit History</span>
                <History className="w-4 h-4 text-sky-700" />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Inspect access logs
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Medications Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">Active Prescriptions & Regimens</h3>
          </div>
          <span className="text-xs text-slate-500">
            {profile.activeMedications.length} Active Prescriptions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.activeMedications.map((med, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">{med.name}</span>
                <span className="text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {med.dosage}
                </span>
              </div>
              <div className="text-slate-600 flex items-center gap-3">
                <span>Frequency: {med.frequency}</span>
                <span>·</span>
                <span>Duration: {med.duration}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Instructions: {med.instructions}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Longitudinal Timeline Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Longitudinal Medical History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete chronological record from earliest clinical consultation to latest diagnostic report.
          </p>
        </div>

        <MedicalTimeline
          records={timeline}
          onOpenUpload={onOpenUpload}
        />
      </div>
    </div>
  );
};
