import React from 'react';
import {
  Shield,
  Activity,
  FileText,
  Lock,
  History,
  Building2,
  CheckCircle2,
  PlayCircle,
  UserCheck,
} from 'lucide-react';
import type { UserRole, User } from '../types/healthcare';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  onOpenDemoScript: () => void;
  onOpenTests: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchUser,
  onOpenDemoScript,
  onOpenTests,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <button
              onClick={() => setCurrentTab('overview')}
              className="text-left group cursor-pointer"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 block group-hover:text-sky-700 transition-colors">
                Smart Care
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                by MedShield Developers
              </span>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'overview'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('patient')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'patient'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => setCurrentTab('doctor')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'doctor'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Doctor Clinic
            </button>
            <button
              onClick={() => setCurrentTab('consents')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'consents'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Consent Control
            </button>
            <button
              onClick={() => setCurrentTab('audit')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'audit'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Audit Trail
            </button>
            <button
              onClick={() => setCurrentTab('hospital')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentTab === 'hospital'
                  ? 'text-sky-700 font-semibold border-b-2 border-sky-700'
                  : ''
              }`}
            >
              Hospital Network
            </button>
          </nav>

          {/* Zone 3: 1 primary action & interactive role switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Automated Tests trigger */}
            <button
              onClick={onOpenTests}
              title="Run 14 Automated Compliance Tests"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>14 Tests</span>
            </button>

            {/* Presentation Script trigger */}
            <button
              onClick={onOpenDemoScript}
              title="View Hackathon Presentation Script"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors whitespace-nowrap"
            >
              <PlayCircle className="w-3.5 h-3.5 text-sky-700" />
              <span className="hidden sm:inline">Pitch Script</span>
            </button>

            {/* Active User Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  onSwitchUser('patient');
                  setCurrentTab('patient');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentUser.role === 'patient'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => {
                  onSwitchUser('doctor');
                  setCurrentTab('doctor');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentUser.role === 'doctor'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => {
                  onSwitchUser('hospital_admin');
                  setCurrentTab('hospital');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  currentUser.role === 'hospital_admin'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
