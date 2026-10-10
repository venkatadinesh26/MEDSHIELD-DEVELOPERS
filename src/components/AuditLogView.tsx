import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Lock,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';
import type { AccessAuditLog } from '../types/healthcare';

interface AuditLogViewProps {
  logs: AccessAuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchIp = log.ipAddress.includes(q);
      if (!matchActor && !matchDetails && !matchIp) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
            SUCCESS
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/50">
            BLOCKED
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
            FLAGGED
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Immutable Security Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every record lookup, permission grant, consultation entry, and blocked access attempt is logged with IP and actor identity.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 tabular-nums">
            {logs.length} Total Audit Records
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, IP, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Events</option>
            <option value="RECORDS_VIEWED">Records Viewed</option>
            <option value="CONSENT_REQUESTED">Consent Requested</option>
            <option value="CONSENT_GRANTED">Consent Granted</option>
            <option value="CONSENT_REVOKED">Consent Revoked</option>
            <option value="UNAUTHORIZED_ACCESS_BLOCKED">Access Blocked</option>
            <option value="DUPLICATE_TEST_WARNING_TRIGGERED">Duplicate Test Advisory</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 whitespace-nowrap">Timestamp</th>
                <th className="p-3.5 whitespace-nowrap">Actor & Role</th>
                <th className="p-3.5 whitespace-nowrap">Action Event</th>
                <th className="p-3.5">Details & Context</th>
                <th className="p-3.5 whitespace-nowrap">IP Origin</th>
                <th className="p-3.5 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{log.actorName}</span>
                    <span className="text-[11px] text-slate-400 uppercase">{log.actorRole}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 max-w-md leading-relaxed">
                    {log.details}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {getStatusBadge(log.status)}
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
