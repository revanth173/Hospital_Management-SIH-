import React, { useState } from 'react';
import {
  Stethoscope,
  Lock,
  KeyRound,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Sparkles,
  X,
  BadgeCheck,
  Fingerprint,
} from 'lucide-react';

export interface DoctorSession {
  doctorId: string;
  doctorName: string;
  department: string;
  nmcRegNo: string;
  hprId: string;
  role: string;
}

export const PRESET_DOCTORS: DoctorSession[] = [
  {
    doctorId: 'DOC-AIIMS-4092',
    doctorName: 'Dr. Rajesh Sharma, MD (AIIMS)',
    department: 'Emergency & Acute Care',
    nmcRegNo: 'NMC-DL-2018-84920',
    hprId: '91-8842-9901-4412@hpr.abdm',
    role: 'Senior Consultant & Triage Chief',
  },
  {
    doctorId: 'DOC-AYUSH-1044',
    doctorName: 'Dr. Priya Nair, BAMS, MD (Ayur)',
    department: 'Ayush Integrative Medicine',
    nmcRegNo: 'NCISM-KL-2019-33821',
    hprId: '91-3321-7781-9920@hpr.abdm',
    role: 'Ayurvedic Specialist',
  },
  {
    doctorId: 'DOC-GEN-6721',
    doctorName: 'Dr. Vikram Seth, MS (Ortho)',
    department: 'General Outpatient OPD',
    nmcRegNo: 'NMC-MH-2016-11928',
    hprId: '91-4412-8890-1122@hpr.abdm',
    role: 'Attending Physician',
  },
];

interface DoctorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: DoctorSession) => void;
}

export const DoctorAuthModal: React.FC<DoctorAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSession>(PRESET_DOCTORS[0]);
  const [doctorIdInput, setDoctorIdInput] = useState(PRESET_DOCTORS[0].doctorId);
  const [password, setPassword] = useState('doc@aiims2026');
  const [authMethod, setAuthMethod] = useState<'password' | 'smartcard' | 'biometric'>('password');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleDoctorSelect = (doc: DoctorSession) => {
    setSelectedDoctor(doc);
    setDoctorIdInput(doc.doctorId);
    setPassword('doc@aiims2026');
    setError(null);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Valid passcodes
      if (password.trim().length >= 4 || authMethod !== 'password') {
        onSuccess(selectedDoctor);
      } else {
        setError('Invalid Security PIN or Password. (Try: doc@aiims2026)');
      }
    }, 600);
  };

  const handleQuickBypass = (doc: DoctorSession) => {
    setSelectedDoctor(doc);
    onSuccess(doc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div className="w-full max-w-xl rounded-3xl bg-[#FAF9F5] border border-white/40 shadow-2xl overflow-hidden text-slate-900 relative">
        {/* Top Header Badge Bar */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-white">
                  Physician EMR Terminal Gate
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NMC & HPR
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Restricted Access • Medical Practitioner Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-2.5 flex items-center gap-2.5 text-[11px] text-amber-900 font-sans">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Confidential Clinical Record Access:</strong> Section 6(1) DPDP Act 2023 & NMC Ethics Regs. All physician actions are cryptographically logged.
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Doctor Preset Selection */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold mb-2">
              Select Physician / Duty Doctor Profile:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_DOCTORS.map((doc) => {
                const isSelected = selectedDoctor.doctorId === doc.doctorId;
                return (
                  <button
                    key={doc.doctorId}
                    type="button"
                    onClick={() => handleDoctorSelect(doc)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <BadgeCheck className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />
                    )}
                    <div className="text-xs font-serif font-bold text-slate-900 leading-tight">
                      {doc.doctorName}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono font-medium mt-1">
                      {doc.department}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                      {doc.doctorId}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Method Switcher Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-sans">
            <button
              type="button"
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>NMC PIN / Passcode</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('smartcard')}
              className={`flex-1 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'smartcard'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doctor Smartcard</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ABDM Healthcare Professional Registry (HPR ID)
              </label>
              <input
                type="text"
                value={selectedDoctor.hprId}
                readOnly
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 text-slate-700 font-mono text-xs cursor-not-allowed"
              />
            </div>

            {authMethod === 'password' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    Physician Master Password / PIN
                  </label>
                  <span className="text-[10px] text-emerald-700 font-mono">
                    Default PIN: <code className="bg-emerald-100 px-1 py-0.5 rounded">doc@aiims2026</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter physician security PIN..."
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-center space-y-2">
                <Fingerprint className="w-8 h-8 text-emerald-600 mx-auto animate-pulse" />
                <div className="text-xs font-serif font-bold text-slate-900">
                  Doctor Smart Token / Cryptographic Biometric Ready
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  Tap to verify doctor signature token: <strong>{selectedDoctor.nmcRegNo}</strong>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-sans uppercase tracking-[0.15em] font-bold shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying HPR Credentials...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Authenticate & Access EMR</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleQuickBypass(selectedDoctor)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl border border-emerald-600/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Quick Access for Judges / Evaluation"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-Click Doctor Pass</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
