import React, { useState } from 'react';
import {
  QrCode,
  X,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Printer,
  Lock,
} from 'lucide-react';
import type { PatientProfile } from '../types/healthcare';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-sky-700 uppercase">
              National Health Identification
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Digital Health ID Card & QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 text-center text-xs">
          {/* Card Presentation Container */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md text-left space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-sky-700 flex items-center justify-center font-bold text-white text-xs">
                  SC
                </div>
                <span className="text-xs font-bold tracking-tight text-white">
                  Smart Care Archive
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                O+ Blood
              </span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Full Citizen Name
              </span>
              <span className="text-base font-bold text-white block mt-0.5">
                {profile.name}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Digital Health ID (Non-Sequential)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xl font-bold tracking-wider text-white tabular-nums">
                  {profile.healthId}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* High-Resolution SVG QR Code Simulation */}
            <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center text-slate-900 space-y-2">
              <div className="w-36 h-36 bg-slate-900 p-2 rounded-lg flex items-center justify-center">
                {/* Clean geometric QR representation */}
                <div className="w-full h-full bg-white p-2 rounded grid grid-cols-6 gap-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-[1px] ${
                        (i % 2 === 0 || i % 5 === 0 || i < 7 || i > 28) && i !== 14
                          ? 'bg-slate-900'
                          : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                HASH: 9A48-E7F2-C109
              </span>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-3 flex items-center justify-between">
              <span>DOB: {profile.dob}</span>
              <span>Emergency: {profile.emergencyContact.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-sky-700" />
              <span>Zero-Exposure QR Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Scanning this QR code identifies you at hospital reception. It <em>never</em> directly exposes medical records without two-factor authentication and your explicit consent.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => alert(`Printing health identification card for ${profile.name}...`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Health Card</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
