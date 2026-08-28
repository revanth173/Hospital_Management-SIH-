import React from 'react';
import { Language, MedicalSystem } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Stethoscope,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Layers,
} from 'lucide-react';

interface Step4MedicalSystemProps {
  language: Language;
  selectedSystem: MedicalSystem;
  onSelectSystem: (system: MedicalSystem) => void;
  onBack: () => void;
}

export const Step4MedicalSystem: React.FC<Step4MedicalSystemProps> = ({
  language,
  selectedSystem,
  onSelectSystem,
  onBack,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        04
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Layers className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 04 • Clinical Domain Routing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.selectMedicalSystem}</h2>
        <p className="text-[#1A1A1A]/70 text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Choose between Modern Evidence-based Medicine or India's traditional AYUSH clinical streams.
        </p>
      </div>

      {/* Two Big System Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Allopathic (SOCRATES) */}
        <div
          onClick={() => onSelectSystem('allopathic')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
            selectedSystem === 'allopathic'
              ? 'border-[#1A1A1A] bg-white shadow-md ring-1 ring-[#1A1A1A]'
              : 'border-[#1A1A1A]/10 bg-white/70 hover:border-[#1A1A1A]/30 hover:bg-white'
          }`}
        >
          {selectedSystem === 'allopathic' && (
            <div className="absolute top-4 right-4 bg-[#1A1A1A] text-[#F9F7F2] p-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#D4A373]" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center mb-4 shadow-xs">
              <Stethoscope className="w-6 h-6 text-[#D4A373]" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.allopathicTitle}</h3>
            </div>
            <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mt-2 font-serif italic">{t.allopathicDesc}</p>

            <div className="mt-5 p-3.5 rounded-2xl bg-[#EAE8E2]/60 border border-[#1A1A1A]/10 text-xs text-[#1A1A1A] space-y-1">
              <div className="font-sans font-bold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                <span>SOCRATES Protocol:</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 leading-normal font-sans">
                Site • Onset • Character • Radiation • Associations • Time Course • Exacerbating/Relieving • Severity
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Select Allopathic Route <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
            </span>
            <span className="text-[10px] font-serif italic text-[#1A1A1A]/50">Cardiology, General Med, ER</span>
          </div>
        </div>

        {/* AYUSH (Dashavidha Pariksha) */}
        <div
          onClick={() => onSelectSystem('ayush')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
            selectedSystem === 'ayush'
              ? 'border-[#5E7153] bg-white shadow-md ring-1 ring-[#5E7153]'
              : 'border-[#1A1A1A]/10 bg-white/70 hover:border-[#5E7153]/50 hover:bg-white'
          }`}
        >
          {selectedSystem === 'ayush' && (
            <div className="absolute top-4 right-4 bg-[#5E7153] text-white p-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#F9F7F2]" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-full bg-[#5E7153] text-white flex items-center justify-center mb-4 shadow-xs">
              <Leaf className="w-6 h-6 text-[#F9F7F2]" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.ayushTitle}</h3>
            </div>
            <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mt-2 font-serif italic">{t.ayushDesc}</p>

            <div className="mt-5 p-3.5 rounded-2xl bg-[#5E7153]/10 border border-[#5E7153]/20 text-xs text-[#1A1A1A] space-y-1">
              <div className="font-sans font-bold uppercase tracking-[0.15em] text-[10px] text-[#5E7153] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
                <span>Dashavidha Pariksha (10-Fold Assessment):</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 leading-normal font-sans">
                Prakriti • Vikriti • Sara • Samhanana • Pramana • Satmya • Satva • Ahara Shakti • Vyayama • Vaya
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#5E7153] group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Select AYUSH Route <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-serif italic text-[#1A1A1A]/50">Ayurveda, Siddha, Panchakarma</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]/10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-[#1A1A1A]/20 text-[#1A1A1A] text-xs font-sans uppercase tracking-[0.15em] hover:bg-[#EAE8E2]/50 cursor-pointer"
        >
          {t.back}
        </button>
        <button
          type="button"
          onClick={() => onSelectSystem(selectedSystem)}
          className={`px-7 py-3 rounded-full text-white font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
            selectedSystem === 'ayush' ? 'bg-[#5E7153] hover:bg-[#4d5e44]' : 'bg-[#1A1A1A] hover:bg-black'
          }`}
        >
          <span>Proceed to {selectedSystem === 'allopathic' ? 'SOCRATES Protocol' : 'Dashavidha Pariksha'}</span>
          <ArrowRight className="w-4 h-4 text-[#D4A373]" />
        </button>
      </div>
    </div>
  );
};
