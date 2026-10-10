import React, { useState } from 'react';
import {
  FilePlus,
  X,
  Upload,
  AlertTriangle,
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { DuplicateTestAlert } from '../types/healthcare';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (payload: {
    title: string;
    category: string;
    type: any;
    summary: string;
    fileName: string;
    fileSize: string;
    isVerifiedByHospital: boolean;
    organizationName: string;
    doctorName?: string;
  }) => void;
  onCheckDuplicate: (tests: string[]) => Promise<DuplicateTestAlert[]>;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onCheckDuplicate,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Laboratory & Scans');
  const [type, setType] = useState('lab_report');
  const [facility, setFacility] = useState('Apex Diagnostic Laboratories');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('2026-10-10');
  const [summary, setSummary] = useState('');
  const [fileName, setFileName] = useState('');
  const [isHospitalVerified, setIsHospitalVerified] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateTestAlert | null>(null);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (val.trim().length >= 3) {
      const alerts = await onCheckDuplicate([val.trim()]);
      if (alerts && alerts.length > 0) {
        setDuplicateWarning(alerts[0]);
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpload({
      title: title.trim(),
      category,
      type,
      summary: summary.trim() || 'Uploaded clinical report stored in private encrypted health archive.',
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.8 MB',
      isVerifiedByHospital: isHospitalVerified,
      organizationName: facility.trim() || 'Patient Self-Archive',
      doctorName: doctorName.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload Medical Document to Archive
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prescriptions, laboratory panels, radiology scans, or discharge summaries.
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

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* File Picker area */}
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-sky-400 transition-colors bg-slate-50/50">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <span className="font-semibold text-slate-800 block">
              {fileName ? fileName : 'Select or drag & drop medical document'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              PDF, DICOM (.dcm), JPG, PNG up to 25MB
            </span>
            <input
              type="file"
              onChange={handleSimulateFileSelect}
              className="mt-2 text-[11px] text-slate-600 cursor-pointer"
            />
          </div>

          {/* Title */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Document / Test Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Blood Count (CBC) or HbA1c Glycemic Panel"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>

          {/* Duplicate Test Warning Banner if detected */}
          {duplicateWarning && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Existing Test Found in Archive</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {duplicateWarning.advisory}
              </p>
              <span className="text-[11px] text-amber-700 block font-mono pt-0.5">
                Prior test date: {duplicateWarning.previousDate} ({duplicateWarning.daysAgo} days ago)
              </span>
            </div>
          )}

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="Laboratory & Scans">Laboratory & Diagnostic</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Radiology / Imaging">Radiology / Imaging</option>
                <option value="Immunization Record">Immunization / Vaccine</option>
                <option value="Prescription Archive">Prescription Archive</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Record Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
              >
                <option value="lab_report">Lab Report</option>
                <option value="prescription">Prescription</option>
                <option value="consultation">Consultation Summary</option>
                <option value="document">General Document</option>
              </select>
            </div>
          </div>

          {/* Facility & Doctor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Healthcare Organization</label>
              <input
                type="text"
                placeholder="e.g. Metro Health System"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Attending Doctor (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Dr. Aisha Rao, MD"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Clinical Summary */}
          <div>
            <label className="font-semibold text-slate-800 block mb-1">
              Summary / Notes from Report
            </label>
            <textarea
              rows={2}
              placeholder="Key test conclusions, normal reference ranges, or dosage guidelines..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg"
            />
          </div>

          {/* Source Attribution checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hospitalCheck"
              checked={isHospitalVerified}
              onChange={(e) => setIsHospitalVerified(e.target.checked)}
              className="rounded text-sky-600 cursor-pointer"
            />
            <label htmlFor="hospitalCheck" className="text-slate-700 cursor-pointer">
              Mark as Hospital-Verified Clinical Record (Official Institutional Origin)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Commit Document to Archive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
