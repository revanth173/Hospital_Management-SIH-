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
    <div className="relative flex flex-col items-center justify-center min-h-[75vh] max-w-4xl mx-auto px-4 py-8 text-center overflow-hidden">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-10 text-[160px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        00
      </div>

      {/* Top Monograph Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAE8E2] border border-[#1A1A1A]/10 text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
        <span>Ayushman Bharat Digital Mission • Triage Terminal</span>
      </div>

      {/* Main Center Obsidian Plate */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#F9F7F2] shadow-sm ring-4 ring-[#EAE8E2]">
          <HeartPulse className="w-9 h-9 text-[#D4A373] animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#D4A373] text-[#1A1A1A] p-1.5 rounded-full shadow-xs border border-[#F9F7F2]">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Serif Title */}
      <h1 className="text-4xl sm:text-5xl font-serif font-light text-[#1A1A1A] tracking-tight max-w-2xl leading-tight">
        {t.startGreeting}
      </h1>
      <p className="text-[#1A1A1A]/70 text-sm sm:text-base mt-3 max-w-xl font-serif italic leading-relaxed">
        {t.startSubtitle}
      </p>

      {/* Primary Touch Call to Action */}
      <div className="mt-8 w-full max-w-md">
        <button
          onClick={onStart}
          className="w-full py-4 px-8 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.2em] text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-3 border border-white/10 cursor-pointer"
        >
          <span>{t.tapToBegin}</span>
          <ArrowRight className="w-4 h-4 text-[#D4A373]" />
        </button>
      </div>

      {/* Quick Demo Patients Showcase */}
      <div className="mt-12 w-full max-w-3xl pt-8 border-t border-[#1A1A1A]/10">
        <div className="flex items-center justify-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/60 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Curated Clinical Personas (Instant Triage Load)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {SAMPLE_PATIENTS.map((p) => (
            <button
              key={p.id}
              onClick={() => onQuickLoadPatient(p)}
              className="p-4 rounded-xl border border-[#1A1A1A]/10 bg-white hover:border-[#1A1A1A]/30 hover:bg-[#EAE8E2]/40 text-left transition-all group cursor-pointer shadow-2xs relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full ${
                    p.tag === 'Emergency Cardiac'
                      ? 'bg-[#A84A38]/10 text-[#A84A38] border border-[#A84A38]/20'
                      : p.tag === 'Ayurvedic Chronic'
                      ? 'bg-[#5E7153]/10 text-[#5E7153] border border-[#5E7153]/20'
                      : 'bg-[#1A1A1A]/10 text-[#1A1A1A] border border-[#1A1A1A]/20'
                  }`}
                >
                  {p.tag}
                </span>
                <UserCheck className="w-3.5 h-3.5 text-[#1A1A1A]/40 group-hover:text-[#D4A373]" />
              </div>
              <div className="font-serif text-base font-medium text-[#1A1A1A]">{p.auth.patientName}</div>
              <div className="text-[11px] text-[#1A1A1A]/65 mt-1 line-clamp-2 leading-relaxed">
                {p.description}
              </div>
              <div className="text-[10px] text-[#D4A373] font-sans uppercase tracking-[0.15em] font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Examine Profile</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Footer Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[10px] font-sans uppercase tracking-[0.15em] text-[#1A1A1A]/50">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5E7153]" />
          <span>DPDP Act 2023 Sec 6(1)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-[#1A1A1A]" />
          <span>ABHA M1/M2/M3 Gateway</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>7 Multilingual Streams</span>
        </span>
      </div>
    </div>
  );
};
