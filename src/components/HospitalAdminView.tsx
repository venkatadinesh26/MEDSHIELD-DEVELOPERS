import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  FileCheck2,
  DollarSign,
  AlertCircle,
  UserPlus,
  Stethoscope,
  Lock,
} from 'lucide-react';
import type { HealthcareOrganization, DoctorProfile } from '../types/healthcare';

interface HospitalAdminViewProps {
  organizations: HealthcareOrganization[];
  doctors: DoctorProfile[];
  onRegisterPatientAssisted: (patientData: any) => void;
}

export const HospitalAdminView: React.FC<HospitalAdminViewProps> = ({
  organizations,
  doctors,
  onRegisterPatientAssisted,
}) => {
  const [assistedName, setAssistedName] = useState('');
  const [assistedEmail, setAssistedEmail] = useState('');
  const [assistedPhone, setAssistedPhone] = useState('');
  const [assistedDob, setAssistedDob] = useState('1990-04-12');
  const [assistedBlood, setAssistedBlood] = useState('B+');
  const [assistedSuccess, setAssistedSuccess] = useState<string | null>(null);

  const handleRegisterAssisted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistedName || !assistedEmail) return;

    onRegisterPatientAssisted({
      name: assistedName,
      email: assistedEmail,
      phone: assistedPhone || '+1 (555) 789-0123',
      dob: assistedDob,
      gender: 'Male',
      bloodGroup: assistedBlood,
      address: 'San Francisco, CA',
    });

    setAssistedSuccess(`Registered patient ${assistedName}. Unique non-sequential Health ID generated.`);
    setAssistedName('');
    setAssistedEmail('');
    setAssistedPhone('');
    setTimeout(() => setAssistedSuccess(null), 6000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Hospital Network Administration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-facility healthcare provider directory, physician credentialing, and assisted patient onboarding.
              </p>
            </div>
          </div>

          <div className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-sky-700" />
            <span>Least-Privilege Security Mode Active</span>
          </div>
        </div>
      </div>

      {/* Security Notice on Administrative Access */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-white">
            Administrative Zero-Knowledge Protocol (Section 4 Compliance)
          </div>
          <div className="text-slate-300 leading-relaxed">
            Hospital administrators and clerical staff do not possess default read access to private clinical medical records. Clinical history is only accessible to licensed attending physicians who have been granted explicit, time-bounded consent by the patient.
          </div>
        </div>
      </div>

      {/* Network Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Patients Registered</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block tabular-nums">
            14,280
          </span>
          <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
            100% Unique Non-Sequential Health IDs
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Credentialed Physicians</span>
          <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block tabular-nums">
            184
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Across 3 accredited facilities
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Duplicate Tests Prevented</span>
          <span className="text-2xl font-bold text-amber-700 font-mono mt-1 block tabular-nums">
            312
          </span>
          <span className="text-[11px] text-amber-800 block mt-1 font-medium">
            Through 90-day test awareness engine
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">Estimated System Savings</span>
          <span className="text-2xl font-bold text-emerald-700 font-mono mt-1 block tabular-nums">
            $418,600
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Avoided redundant diagnostics & labs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Healthcare Organizations List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Accredited Hospital Network Nodes
          </h3>

          <div className="space-y-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{org.name}</h4>
                    <span className="text-xs text-slate-500">{org.type}</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    License: {org.licenseNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-600 pt-1">
                  Location: {org.address} · Email: {org.contactEmail}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1 border-t border-slate-100">
                  <span>Accredited since {org.accreditedSince}</span>
                  <span>·</span>
                  <span>{org.activeDoctorsCount} affiliated clinicians</span>
                </div>
              </div>
            ))}
          </div>

          {/* Clinicians Roster */}
          <div className="pt-4 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Verified Medical Staff Roster
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3">Facility</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((doc) => (
                    <tr key={doc.userId}>
                      <td className="p-3 font-semibold text-slate-900">{doc.name}</td>
                      <td className="p-3 text-slate-600">{doc.specialization}</td>
                      <td className="p-3 text-slate-600">{doc.organizationName}</td>
                      <td className="p-3">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Verified Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assisted Patient Onboarding Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-sky-700" />
            <h3 className="text-base font-bold text-slate-900">
              Assisted Patient Registration
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Staff assistance for elderly or new patients. Issues a new non-sequential National Health ID with zero identity collision guarantee.
          </p>

          {assistedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              {assistedSuccess}
            </div>
          )}

          <form onSubmit={handleRegisterAssisted} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-medium block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Anderson"
                value={assistedName}
                onChange={(e) => setAssistedName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. liam.anderson@example.com"
                value={assistedEmail}
                onChange={(e) => setAssistedEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={assistedPhone}
                  onChange={(e) => setAssistedPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Blood Group</label>
                <select
                  value={assistedBlood}
                  onChange={(e) => setAssistedBlood(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">Date of Birth</label>
              <input
                type="date"
                value={assistedDob}
                onChange={(e) => setAssistedDob(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
            >
              Generate Health ID & Create Archive
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
