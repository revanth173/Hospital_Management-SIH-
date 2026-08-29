import React from 'react';
import { Language, PatientAuth, EmergencyRedFlag } from '../types/kiosk';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/languages';
import {
  Globe,
  AlertOctagon,
  Volume2,
  VolumeX,
  ShieldCheck,
  Stethoscope,
  Workflow,
  Monitor,
  HeartPulse,
  Lock,
  BadgeCheck,
} from 'lucide-react';
import { DoctorSession } from './DoctorAuthModal';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeView: 'kiosk' | 'flowchart' | 'doctor_portal';
  onViewChange: (view: 'kiosk' | 'flowchart' | 'doctor_portal') => void;
  onEmergencyTrigger: () => void;
  patientAuth?: PatientAuth;
  redFlag?: EmergencyRedFlag;
  doctorSession?: DoctorSession | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  activeView,
  onViewChange,
  onEmergencyTrigger,
  patientAuth,
  redFlag,
  doctorSession,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl text-slate-100 border-b border-emerald-500/20 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Hospital & ABDM Identity */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg">
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white">
                Swasthya<span className="italic font-light text-emerald-400">Kiosk</span>
              </span>
              <span className="text-[9px] uppercase font-mono tracking-[0.2em] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ABDM M3
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] uppercase font-sans tracking-[0.15em] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> DPDP Act 2023
              </span>
            </div>
            <p className="text-[11px] text-[#EAE8E2]/60 font-sans tracking-wide">
              AIIMS Delhi • Outpatient Triage Bay-04
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10">
          <button
            onClick={() => onViewChange('kiosk')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.15em] transition-all cursor-pointer ${
              activeView === 'kiosk'
                ? 'bg-[#F9F7F2] text-[#1A1A1A] font-semibold shadow-xs'
                : 'text-[#EAE8E2]/70 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Kiosk</span>
          </button>

          <button
            onClick={() => onViewChange('flowchart')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.15em] transition-all cursor-pointer ${
              activeView === 'flowchart'
                ? 'bg-[#F9F7F2] text-[#1A1A1A] font-semibold shadow-xs'
                : 'text-[#EAE8E2]/70 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => onViewChange('doctor_portal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-sans uppercase tracking-[0.15em] transition-all cursor-pointer ${
              activeView === 'doctor_portal'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : doctorSession
                ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30'
                : 'text-[#EAE8E2]/70 hover:text-white'
            }`}
            title={doctorSession ? `Logged in as ${doctorSession.doctorName}` : 'Restricted to Registered Medical Practitioners'}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor EMR</span>
            {!doctorSession ? (
              <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                <span>PIN</span>
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
            )}
            {redFlag?.isRedFlag && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Controls: Audio, Language, SOS */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
            className={`p-2 rounded-full text-xs border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-white/10 border-white/15 text-[#D4A373] hover:bg-white/20'
                : 'bg-black/30 border-white/5 text-white/40 hover:text-white/70'
            }`}
            title={soundEnabled ? 'Audio Prompts Enabled' : 'Audio Prompts Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4A373]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 absolute left-2.5 text-[#EAE8E2]/60 pointer-events-none" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="pl-7 pr-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-sans font-medium text-[#F9F7F2] focus:outline-none focus:ring-1 focus:ring-[#D4A373] cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#1A1A1A] text-[#F9F7F2]">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onEmergencyTrigger}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A84A38] hover:bg-[#8B2635] text-white text-xs font-sans uppercase tracking-[0.15em] border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">{t.emergencyDial}</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
