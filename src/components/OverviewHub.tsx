import React from 'react';
import {
  Shield,
  FileCheck2,
  Clock,
  AlertTriangle,
  FolderLock,
  Stethoscope,
  Database,
  Layers,
  ArrowRight,
  QrCode,
  Calendar,
  CheckCircle2,
  Play,
} from 'lucide-react';

interface OverviewHubProps {
  onGoToPatient: () => void;
  onGoToDoctor: () => void;
  onOpenPitch: () => void;
  onOpenTests: () => void;
}

export const OverviewHub: React.FC<OverviewHubProps> = ({
  onGoToPatient,
  onGoToDoctor,
  onOpenPitch,
  onOpenTests,
}) => {
  const problems = [
    {
      title: 'Scattered Records Across Clinics',
      desc: 'Patients accumulate fragmented paper and digital records in isolated hospital silos with zero interoperability.',
    },
    {
      title: 'Exhausting Repeated Case-Taking',
      desc: 'Every new consultation forces patients to re-narrate their entire chronic history, allergies, and prior interventions from memory.',
    },
    {
      title: 'Missing Historical Reports',
      desc: 'Critical past diagnostic tests and discharge summaries are lost or left at home during acute clinical visits.',
    },
    {
      title: 'Costly Duplicate Lab Tests',
      desc: 'Unaware of tests performed days earlier, doctors frequently re-order redundant blood panels and expensive radiological scans.',
    },
    {
      title: 'Hazardous Treatment Gaps',
      desc: 'Previous adverse drug reactions and ongoing medications remain invisible, increasing risk of harmful drug interactions.',
    },
    {
      title: 'Wasted Time & Bloated Expenses',
      desc: 'Patients and healthcare organizations spend billions manually retrieving records and dealing with redundant administration.',
    },
  ];

  const innovations = [
    {
      title: 'Non-Sequential Unique Health ID',
      desc: 'Every citizen receives a cryptographic Health ID (e.g. SC-7821-4902) with high-density QR code for instant lookup.',
      badge: 'Zero Identity Collisions',
    },
    {
      title: 'Longitudinal Medical Timeline',
      desc: 'A unified chronological stream organizing consultations, e-prescriptions, lab tests, and imaging from earliest to latest.',
      badge: 'Complete Patient Story',
    },
    {
      title: 'Duplicate-Test Awareness Engine',
      desc: 'Flags overlapping diagnostic tests performed within 90 days, presenting prior dates, doctor authorship, and exact lab values.',
      badge: 'Cost & Time Reduction',
    },
    {
      title: 'Granular Consent Management',
      desc: 'Patients approve or reject access requests with customized scopes (Full, Labs, Prescriptions) and duration (1h, 24h, 7d).',
      badge: 'Patient-Controlled Sovereignty',
    },
    {
      title: 'Doctor-Wise Treatment History',
      desc: 'Isolates and traces clinical consultations by physician, department, and licensed healthcare organization.',
      badge: 'Verified Clinical Authorship',
    },
    {
      title: 'Immutable Security Audit Trail',
      desc: 'Tamper-evident access logging tracks every view, consent grant, and blocked access attempt with actor IP and timestamp.',
      badge: 'HIPAA & GDPR Aligned',
    },
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase mb-4">
              <span>MedShield Developers Presents</span>
              <span>·</span>
              <span>Hackathon Edition 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
              Smart Care: A Healthy Archive
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              A centralized, patient-controlled digital healthcare platform. One
              unique health ID, an organized longitudinal medical history, and
              strict consent-based doctor access that stops duplicate tests and
              treatment gaps forever.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onGoToPatient}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
              >
                <span>Launch Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onGoToDoctor}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-colors cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-sky-400" />
                <span>Doctor Consultation Hub</span>
              </button>
              <button
                onClick={onOpenPitch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                <Play className="w-4 h-4 text-sky-400" />
                <span>Presentation Pitch Script</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_medical_archive_1791638855767.jpg"
              alt="Digital Health Archive Workstation"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-slate-300">
              <div className="font-semibold text-white mb-1">
                Active Architecture Node: SC-7821-4902
              </div>
              <div>Longitudinal Records Indexed · 100% Consent Compliance</div>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Core Healthcare Problems Solved */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            The Healthcare Record Crisis
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Six systematic failures in modern healthcare administration that Smart Care eliminates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="text-xs font-mono font-semibold text-sky-700 mb-2">
                Challenge {idx + 1}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Innovations */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Core Platform Innovations
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Built to assist clinical decision-making without replacing medical professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {innovations.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-sky-300 transition-colors"
            >
              <div className="text-xs font-medium text-slate-500 mb-2">
                {item.badge}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Stack & Database Overview Card */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Full-Stack Architecture & Governance
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              PostgreSQL Relational Core + Python FastAPI & Express Engine
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed with strict relational integrity. Foreign key constraints bind
              consultations, prescriptions, and lab documents to unique patient IDs.
              Doctor queries are intercepted by the server-side consent authorization
              middleware before database execution.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Database</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  PostgreSQL
                </div>
                <div className="text-[11px] text-slate-500">14 DDL Tables</div>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Backend APIs</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  FastAPI & Express
                </div>
                <div className="text-[11px] text-slate-500">REST + Auth JWT</div>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Access Control</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  Patient Consent
                </div>
                <div className="text-[11px] text-slate-500">Timed Expirations</div>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-500">Duplicate Check</div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  Diagnostic Alert
                </div>
                <div className="text-[11px] text-slate-500">90-Day Lookback</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={onOpenTests}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all text-left"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Run 14 Automated Tests
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Verify duplicate checks, RBAC & consent blocking
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </button>

            <button
              onClick={onOpenPitch}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xs transition-all text-left"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Hackathon Pitch Script
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Judge demonstration walkthrough and slides
                </div>
              </div>
              <Play className="w-5 h-5 text-sky-600 shrink-0" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
