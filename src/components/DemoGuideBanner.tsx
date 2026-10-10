import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert, FileClock, XCircle } from 'lucide-react';

interface DemoGuideBannerProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  onOpenTests: () => void;
  onOpenPitch: () => void;
}

export const DemoGuideBanner: React.FC<DemoGuideBannerProps> = ({
  currentStep,
  onSelectStep,
  onOpenTests,
  onOpenPitch,
}) => {
  const steps = [
    { num: 1, label: '1. Health ID & QR' },
    { num: 2, label: '2. Doctor Lookup (Blocked)' },
    { num: 3, label: '3. Grant Consent' },
    { num: 4, label: '4. Timeline & Duplicate Alert' },
    { num: 5, label: '5. Doctor Consultation' },
    { num: 6, label: '6. Revoke & Block' },
  ];

  return (
    <div className="bg-slate-900 text-white py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold tracking-wide text-sky-400 uppercase">
            Hackathon Demo Guide:
          </span>
          <span className="text-xs text-slate-300 hidden md:inline">
            Follow the 6-step core workflow:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => onSelectStep(s.num)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentStep === s.num
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={onOpenTests}
            className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors whitespace-nowrap border border-emerald-700/50"
          >
            Verify 14 Tests
          </button>
        </div>
      </div>
    </div>
  );
};
