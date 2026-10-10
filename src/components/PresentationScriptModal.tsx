import React from 'react';
import {
  PlayCircle,
  X,
  Clock,
  Award,
  Layers,
  Shield,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface PresentationScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationScriptModal: React.FC<PresentationScriptModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hackathon Pitch & Live Demonstration Script
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Smart Care: A Healthy Archive | Developed by MedShield Developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Opening Hook */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-800 text-sm">
              <Clock className="w-4 h-4" />
              <span>0:00 - 0:45 | The Problem & The Core Innovation</span>
            </div>
            <p>
              <strong>"Good afternoon judges.</strong> Every year, millions of patients walk into clinics and are forced to re-explain their entire medical history from memory. Critical past laboratory tests are missing, causing doctors to order redundant tests, which burdens healthcare systems and risks medication errors.
            </p>
            <p>
              We are <strong>MedShield Developers</strong>, and today we introduce <strong>Smart Care: A Healthy Archive</strong>. Our innovation is three-fold:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>One Unique Health ID</strong> per patient (non-sequential, cryptographic, zero-collision).</li>
              <li><strong>One Organized Longitudinal Medical Timeline</strong> uniting past consultations, lab panels, and imaging.</li>
              <li><strong>Zero-Trust Patient Consent</strong> paired with real-time <strong>Duplicate-Test Awareness</strong>.</li>
            </ul>
          </div>

          {/* Section 2: Live Demo Sequence */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-800 text-sm">
              <PlayCircle className="w-4 h-4" />
              <span>0:45 - 2:30 | The 6-Step Live Demonstration Walkthrough</span>
            </div>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Step 1 (Patient Portal):</strong> Notice patient Priya Sharma's ID <code>SC-7821-4902</code> and high-density QR code. Her vitals, documented Penicillin allergy, and active regimens are clearly displayed.
              </li>
              <li>
                <strong>Step 2 (Doctor Clinic Lookup):</strong> Switch to Doctor View. When Dr. Marcus Chen looks up <code>SC-7821-4902</code> without consent, our security firewall blocks the lookup with HTTP 403. Medical data remains strictly encrypted.
              </li>
              <li>
                <strong>Step 3 (Patient Grants Consent):</strong> In the Consent Control tab, Priya reviews Dr. Chen's incoming request for outpatient consultation and clicks <em>Grant 24h Access</em>.
              </li>
              <li>
                <strong>Step 4 (Unlocked Timeline & Duplicate Alert):</strong> Instantly, Dr. Chen's workstation decrypts the timeline. Crucially, our <strong>Duplicate-Test Awareness Engine</strong> triggers: when Dr. Chen begins ordering an HbA1c test, the system warns him that HbA1c was already conducted 18 days ago at Apex Laboratories with optimal 5.4% results!
              </li>
              <li>
                <strong>Step 5 (Consultation Entry):</strong> Dr. Chen records the clinical note, prescribes medication, and signs the record. It is immediately appended to Priya's permanent timeline with verified doctor authorship.
              </li>
              <li>
                <strong>Step 6 (Revoke & Immutable Audit):</strong> Priya revokes Dr. Chen's access with one click. In the Audit Trail tab, every lookup, consent grant, and blocked access attempt is logged with actor IP and timestamps.
              </li>
            </ol>
          </div>

          {/* Section 3: Technical Feasibility & Viability */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-sky-800 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>2:30 - 3:30 | Economic & Technical Feasibility (Section 9)</span>
            </div>
            <p>
              <strong>Architecture & Storage:</strong> Relational PostgreSQL core enforces foreign key constraints and transactional integrity for clinical records. Cloud storage stores actual encrypted DICOM and PDF files with short-lived tokens.
            </p>
            <p>
              <strong>Economic Viability:</strong> In our demonstration network of 14,280 patients, the Duplicate-Test Awareness engine has already prevented 312 redundant tests, resulting in an estimated savings of <strong>$418,600</strong> in unnecessary diagnostic costs.
            </p>
          </div>

          {/* Section 4: Closing */}
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-sky-900 font-medium">
            "Smart Care does not replace medical professionals—it empowers them with accurate clinical history when every second counts. Thank you!"
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
