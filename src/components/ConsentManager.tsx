import React from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Stethoscope,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import type { ConsentRequest } from '../types/healthcare';

interface ConsentManagerProps {
  consents: ConsentRequest[];
  onApproveConsent: (consentId: string, durationHours: number) => void;
  onRejectConsent: (consentId: string) => void;
  onRevokeConsent: (consentId: string) => void;
}

export const ConsentManager: React.FC<ConsentManagerProps> = ({
  consents,
  onApproveConsent,
  onRejectConsent,
  onRevokeConsent,
}) => {
  const pendingRequests = consents.filter((c) => c.status === 'pending');
  const activeGrants = consents.filter((c) => c.status === 'approved');
  const pastConsents = consents.filter(
    (c) => c.status === 'revoked' || c.status === 'rejected' || c.status === 'expired'
  );

  return (
    <div className="space-y-8 py-4">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Patient Consent & Access Control
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Zero-trust record protection. You authorize who sees your records, for what purpose, and for how long.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            {activeGrants.length} Active Grants · {pendingRequests.length} Pending
          </div>
        </div>
      </div>

      {/* PENDING REQUESTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">Pending Access Requests</h3>
          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
            Requires Your Decision
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No incoming access requests awaiting approval.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-6 rounded-xl border border-amber-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{req.doctorName}</h4>
                      <div className="text-xs text-slate-500">
                        {req.doctorSpecialization} · {req.organizationName}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    Requested: {new Date(req.requestedAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Stated Clinical Purpose</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {req.purpose}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Requested Scope & Window</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">
                      {req.requestedScope} ({req.requestedDurationHours} hours)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => onRejectConsent(req.id)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Decline Request
                  </button>
                  <button
                    onClick={() => onApproveConsent(req.id, 24)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Grant 24h Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE AUTHORIZATIONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Active Healthcare Grants</h3>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
            Currently Authorized
          </span>
        </div>

        {activeGrants.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No active permissions granted. Your records are completely restricted.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeGrants.map((grant) => (
              <div
                key={grant.id}
                className="bg-white p-6 rounded-xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{grant.doctorName}</h4>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                      Active Access
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {grant.doctorSpecialization} · {grant.organizationName}
                  </div>
                  <div className="text-xs text-slate-600 pt-1">
                    Scope: <strong className="font-semibold text-slate-900">{grant.requestedScope}</strong> · Purpose: {grant.purpose}
                  </div>
                  {grant.expiresAt && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      Expires: {new Date(grant.expiresAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onRevokeConsent(grant.id)}
                    className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Revoke Access Immediately
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST / REVOKED / EXPIRED HISTORY */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Consent Lifecycle Archive</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Healthcare Professional</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Scope</th>
                <th className="p-3">Final Status</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastConsents.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-medium text-slate-900">{item.doctorName}</td>
                  <td className="p-3 text-slate-600">{item.organizationName}</td>
                  <td className="p-3 text-slate-600">{item.requestedScope}</td>
                  <td className="p-3">
                    <span
                      className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                        item.status === 'revoked'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500 tabular-nums">
                    {item.revokedAt
                      ? new Date(item.revokedAt).toLocaleString()
                      : new Date(item.requestedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
