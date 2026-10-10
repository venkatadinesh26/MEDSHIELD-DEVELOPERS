import React, { useState, useMemo } from 'react';
import {
  FileText,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  Building2,
  User,
  ArrowUpDown,
  FilePlus,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { TimelineRecord, TimelineRecordType } from '../types/healthcare';

interface MedicalTimelineProps {
  records: TimelineRecord[];
  onOpenUpload?: () => void;
  filterDoctor?: string;
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  records,
  onOpenUpload,
  filterDoctor,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(filterDoctor || 'all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Newest or Earliest first
  const [activeRecordModal, setActiveRecordModal] = useState<TimelineRecord | null>(null);

  // Extract unique doctors
  const doctorsList = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.doctorName) set.add(r.doctorName);
    });
    return Array.from(set);
  }, [records]);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        if (selectedType !== 'all' && rec.type !== selectedType) return false;
        if (selectedDoctor !== 'all' && rec.doctorName !== selectedDoctor) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.title.toLowerCase().includes(q);
          const matchSummary = rec.summary.toLowerCase().includes(q);
          const matchCategory = rec.category.toLowerCase().includes(q);
          const matchDoctor = rec.doctorName?.toLowerCase().includes(q) ?? false;
          const matchClinic = rec.organizationName.toLowerCase().includes(q);
          const matchDiagnoses =
            rec.details?.diagnoses?.some((d) => d.toLowerCase().includes(q)) ?? false;
          if (!matchTitle && !matchSummary && !matchCategory && !matchDoctor && !matchClinic && !matchDiagnoses) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [records, selectedType, selectedDoctor, searchQuery, sortOrder]);

  const getTypeIcon = (type: TimelineRecordType) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4 text-sky-700" />;
      case 'lab_report':
        return <FlaskConical className="w-4 h-4 text-teal-700" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-indigo-700" />;
      case 'document':
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Controls Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search diagnoses, doctor, tests, medications or clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
            />
          </div>

          {/* Doctor-Wise filter & Sort direction */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="text-xs text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none"
            >
              <option value="all">All Healthcare Providers</option>
              {doctorsList.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              title="Toggle Chronological Direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Earliest First'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'consultation', label: 'Consultations' },
            { id: 'lab_report', label: 'Laboratory & Scans' },
            { id: 'prescription', label: 'Prescriptions' },
            { id: 'document', label: 'Uploaded Documents' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === cat.id
                  ? 'bg-sky-700 text-white font-medium shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 tabular-nums">
            {filteredRecords.length} entries found
          </span>
        </div>
      </div>

      {/* Chronological Timeline Stream */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-900">No medical records match your criteria</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms or filter selections.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="relative bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Dot indicator on timeline spine */}
              <div className="absolute -left-[21px] top-5 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-600 shadow-xs" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-md">
                    {getTypeIcon(rec.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-700">{rec.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{rec.date}</span>
                      {rec.doctorName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Attending: {rec.doctorName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rec.isVerifiedByHospital ? (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200/50">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Hospital Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                      Patient Self-Archive
                    </span>
                  )}

                  <button
                    onClick={() => setActiveRecordModal(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>
                </div>
              </div>

              {/* Summary and facility */}
              <div className="pt-3 text-xs text-slate-600 leading-relaxed">
                <p>{rec.summary}</p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>Facility: {rec.organizationName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Details Modal */}
      {activeRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold uppercase text-sky-700">
                  {activeRecordModal.category} · {activeRecordModal.date}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeRecordModal.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Organization: {activeRecordModal.organizationName}
                  {activeRecordModal.doctorName && ` · Attending: ${activeRecordModal.doctorName}`}
                </div>
              </div>
              <button
                onClick={() => setActiveRecordModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              {/* Summary */}
              <div>
                <span className="font-semibold text-slate-900 block mb-1">Clinical Summary</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                  {activeRecordModal.summary}
                </p>
              </div>

              {/* Diagnoses if available */}
              {activeRecordModal.details?.diagnoses && activeRecordModal.details.diagnoses.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Diagnoses (ICD-10)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRecordModal.details.diagnoses.map((d, i) => (
                      <span
                        key={i}
                        className="bg-sky-50 text-sky-800 px-2 py-1 rounded border border-sky-100 font-mono"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Parameters Table if available */}
              {activeRecordModal.details?.labParameters && activeRecordModal.details.labParameters.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Laboratory Parameters</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Parameter</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                        {activeRecordModal.details.labParameters.map((param, idx) => (
                          <tr key={idx} className={param.isAbnormal ? 'bg-amber-50/50' : ''}>
                            <td className="p-2.5 font-sans font-medium text-slate-900">
                              {param.name}
                            </td>
                            <td className="p-2.5 font-bold">
                              {param.value} {param.unit}
                            </td>
                            <td className="p-2.5 text-slate-500">{param.referenceRange}</td>
                            <td className="p-2.5">
                              {param.isAbnormal ? (
                                <span className="text-amber-700 font-semibold font-sans">
                                  Flagged Abnormal
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-sans">Normal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Medications if prescribed */}
              {activeRecordModal.details?.medications && activeRecordModal.details.medications.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Prescribed Regimens</span>
                  <div className="space-y-2">
                    {activeRecordModal.details.medications.map((m, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>{m.name}</span>
                          <span>{m.dosage}</span>
                        </div>
                        <div className="text-slate-500 mt-1">
                          {m.frequency} · Duration: {m.duration}
                        </div>
                        <div className="text-slate-500 italic mt-0.5">
                          {m.instructions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Notes & Vitals */}
              {activeRecordModal.details?.clinicalNotes && (
                <div>
                  <span className="font-semibold text-slate-900 block mb-1">Physician Clinical Notes</span>
                  <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-sans">
                    {activeRecordModal.details.clinicalNotes}
                  </p>
                </div>
              )}

              {/* File Attachment details */}
              {activeRecordModal.details?.fileName && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <div>
                      <span className="font-medium text-slate-900 block">
                        {activeRecordModal.details.fileName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Size: {activeRecordModal.details.fileSize || '1.2 MB'} · Encrypted Private Storage
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert(`Downloading securely indexed document: ${activeRecordModal.details?.fileName}`);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveRecordModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
