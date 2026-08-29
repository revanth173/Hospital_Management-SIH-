import React from 'react';
import { Language } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { SAMPLE_PATIENTS, PatientPreset } from '../../data/mockPatients';
import {
  HeartPulse,
  QrCode,
  ShieldCheck,
  Languages,
  Sparkles,
  ArrowRight,
  UserCheck,
  Activity,
  Zap,
  Lock,
  Stethoscope,
} from 'lucide-react';

interface Step0StartProps {
  language: Language;
  onStart: () => void;
  onQuickLoadPatient: (preset: PatientPreset) => void;
}

export const Step0Start: React.FC<Step0StartProps> = ({
  language,
  onStart,
  onQuickLoadPatient,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[78vh] max-w-5xl mx-auto px-3 sm:px-6 py-6 text-center">
      {/* Background Watermark Numerals */}
      <div className="absolute top-2 right-6 text-[140px] sm:text-[180px] font-serif font-black text-white/5 select-none pointer-events-none leading-none tracking-tighter">
        ABDM
      </div>

      {/* Main Frosted Pearl-Ivory Centerpiece Card (Premium Hybrid Contrast) */}
      <div className="w-full max-w-3xl rounded-3xl bg-[#FAF9F5]/95 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
        {/* Subtle Ambient Top Glow inside card */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-teal-500/20 via-emerald-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Operational Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111827] text-emerald-400 text-[11px] font-mono tracking-wider border border-emerald-500/40 mb-6 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-medium">AYUSHMAN BHARAT DIGITAL MISSION</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-300">SMART TRIAGE KIOSK v2.4</span>
        </div>

        {/* Biometric Pulse Central Icon Hub */}
        <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
          <div className="absolute -inset-2 rounded-full border border-teal-600/30 animate-spin" style={{ animationDuration: '12s' }} />
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] flex items-center justify-center text-white shadow-xl border border-emerald-500/40 z-10 relative group">
            <HeartPulse className="w-10 h-10 text-emerald-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-lg shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Main Title & Subtitle in Deep High-Contrast Ink */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0F172A] tracking-tight max-w-2xl mx-auto leading-tight">
          {t.startGreeting}
        </h1>
        <p className="text-[#334155] text-sm sm:text-base mt-3 max-w-xl mx-auto font-sans leading-relaxed">
          {t.startSubtitle}
        </p>

        {/* Primary Interactive Touch CTA */}
        <div className="mt-8 w-full max-w-md mx-auto">
          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] hover:from-black hover:to-slate-900 text-white font-sans uppercase tracking-[0.2em] text-xs font-bold shadow-xl hover:shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-3 border border-emerald-500/40 cursor-pointer group"
          >
            <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span>{t.tapToBegin}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </button>
        </div>

        {/* Live Kiosk Telemetry Indicators with Warm Pearl Inset Panels */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Triage Engine</div>
              <div className="text-[11px] font-bold text-slate-900">AIIMS Multimodal</div>
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">ABHA Gateway</div>
              <div className="text-[11px] font-bold text-slate-900">M1 / M2 / M3 Ready</div>
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <Languages className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Bhashini Voice</div>
              <div className="text-[11px] font-bold text-slate-900">7 Indic Dialects</div>
            </div>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Data Privacy</div>
              <div className="text-[11px] font-bold text-slate-900">DPDP Act 2023</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Demo Personas Showcase (Pearl/Ivory Frosted Cards) */}
      <div className="mt-8 w-full max-w-4xl">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-white font-extrabold tracking-wide drop-shadow-md">
              Instant Demo Personas (Judges 1-Click Triage Test)
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-300 bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/40 shadow-xs">
            3 Live Clinical Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SAMPLE_PATIENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => onQuickLoadPatient(p)}
              className="p-4 rounded-2xl border border-white/40 bg-[#FAF9F5]/95 hover:bg-white text-left transition-all group cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  p.tag === 'Emergency Cardiac'
                    ? 'bg-rose-500'
                    : p.tag === 'Ayurvedic Chronic'
                    ? 'bg-emerald-600'
                    : 'bg-sky-600'
                }`}
              />

              <div className="flex items-center justify-between mb-2 mt-1">
                <span
                  className={`text-[9px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    p.tag === 'Emergency Cardiac'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : p.tag === 'Ayurvedic Chronic'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}
                >
                  {p.tag}
                </span>
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </div>

              <div className="font-serif text-base font-bold text-slate-900">
                {p.auth.patientName}
              </div>
              
              <div className="text-[11px] font-mono text-slate-500 font-medium mt-0.5">
                ABHA: {p.auth.abhaId} • {p.auth.age}Y/{p.auth.gender}
              </div>

              <div className="text-[11px] text-slate-700 mt-2 line-clamp-2 leading-relaxed font-sans">
                {p.description}
              </div>

              <div className="text-[10px] text-emerald-800 font-mono uppercase tracking-wider font-bold mt-3.5 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Simulate Patient Triage</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
