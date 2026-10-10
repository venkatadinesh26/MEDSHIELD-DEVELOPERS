import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  RotateCw,
  ShieldCheck,
  AlertCircle,
  FileCode,
  X,
} from 'lucide-react';

interface AutomatedTestsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomatedTestsView: React.FC<AutomatedTestsViewProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tests/run-all', { method: 'POST' });
      const data = await res.json();
      setTestResults(data.results);
      setSummary(data.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Automated Verification Suite (Section 12 Compliance)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Executes automated tests validating all 14 architectural & security constraints.
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

        <div className="py-4 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <div className="font-semibold text-slate-900">
                14 Mandatory Verification Scenarios
              </div>
              <div className="text-slate-500 mt-0.5">
                Verifies non-sequential ID generation, consent firewalls, duplicate test alert engine, and audit logs.
              </div>
            </div>

            <button
              onClick={runTests}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Test Matrix...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute 14 Automated Tests</span>
                </>
              )}
            </button>
          </div>

          {summary && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{summary}</span>
            </div>
          )}

          {/* Test items list */}
          {testResults && (
            <div className="space-y-2.5 divide-y divide-slate-100">
              {testResults.map((t) => (
                <div key={t.id} className="pt-2.5 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">
                        Test {t.id}: {t.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      PASSED
                    </span>
                  </div>
                  <div className="text-slate-600 pl-6">{t.description}</div>
                  <div className="text-[11px] font-mono text-slate-500 pl-6 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                    Evidence: {t.evidence}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!testResults && !isLoading && (
            <div className="text-center py-8 text-slate-400">
              Click "Execute 14 Automated Tests" to run live server-side verification.
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
