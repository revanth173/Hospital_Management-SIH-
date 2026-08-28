import React, { useState } from 'react';
import { Language, DashavidhaPariksha, InputMode } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Leaf,
  Activity,
  Flame,
  Brain,
  Dumbbell,
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface Step5AyushProps {
  language: Language;
  inputMode: InputMode;
  initialData: DashavidhaPariksha;
  onSubmitAyush: (data: DashavidhaPariksha) => void;
  onBack: () => void;
}

export const Step5AyushDashavidha: React.FC<Step5AyushProps> = ({
  language,
  inputMode,
  initialData,
  onSubmitAyush,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [data, setData] = useState<DashavidhaPariksha>(initialData);

  const prakritiOptions: DashavidhaPariksha['prakriti'][] = [
    'Vata',
    'Pitta',
    'Kapha',
    'Vata-Pitta',
    'Pitta-Kapha',
    'Vata-Kapha',
    'Tridoshaja',
  ];

  const vikritiOptions: DashavidhaPariksha['vikriti'][] = [
    'Vata Vriddhi',
    'Pitta Prakopa',
    'Kapha Avarana',
    'Sannipataja',
  ];

  const aharaOptions: DashavidhaPariksha['aharaShakti'][] = [
    'Samagni (Balanced)',
    'Mandagni (Sluggish digestion)',
    'Teekshnagni (Very high metabolic fire)',
    'Vishamagni (Irregular)',
  ];

  const satvaOptions: DashavidhaPariksha['satva'][] = [
    'Pravara Satva (High mental fortitude & calm)',
    'Madhyama Satva (Moderate)',
    'Avara Satva (Low resilience / high anxiety)',
  ];

  const commonAyushLakshanas = [
    'Sandhi Shoola (Joint Pain)',
    'Sandhi Graha (Morning Stiffness)',
    'Aruchi (Loss of Appetite)',
    'Vibandha (Constipation)',
    'Shwasa (Breathlessness)',
    'Daha (Burning Sensation)',
    'Gaurava (Heaviness in Body)',
    'Nidranasha (Insomnia)',
  ];

  const toggleLakshana = (lakshana: string) => {
    setData((prev) => ({
      ...prev,
      associatedLakshanas: prev.associatedLakshanas.includes(lakshana)
        ? prev.associatedLakshanas.filter((l) => l !== lakshana)
        : [...prev.associatedLakshanas, lakshana],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        05B
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Leaf className="w-3.5 h-3.5 text-[#5E7153]" />
          <span>Stage 05B • Dashavidha Pariksha (Classical 10-Fold Assessment)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.dashavidhaTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Comprehensive diagnostic profiling based on Charaka Samhita Vimansthana Chapter 8.
        </p>
      </div>

      {/* Main Dashavidha Form */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Chief Ayurvedic Complaint */}
        <div>
          <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
            Primary Rogi Complaint (Pradhana Vedana)
          </label>
          <input
            type="text"
            value={data.chiefAyushComplaint}
            onChange={(e) => setData({ ...data, chiefAyushComplaint: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-xs sm:text-sm focus:ring-1 focus:ring-[#5E7153] focus:outline-none"
            placeholder="e.g. Janu Sandhigata Vata (Knee Joint stiffness and pain with crepitus)"
          />
        </div>

        {/* 1. Prakriti & 2. Vikriti */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A1A]/10">
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              1. Prakriti (Baseline Dosha Constitution)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {prakritiOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setData({ ...data, prakriti: p })}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.prakriti === p
                      ? 'border-[#5E7153] bg-[#5E7153] text-white font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              2. Vikriti (Current Pathological Dosha Imbalance)
            </label>
            <div className="space-y-1.5">
              {vikritiOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setData({ ...data, vikriti: v })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.vikriti === v
                      ? 'border-[#5E7153] bg-[#5E7153] text-white font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Ahara Shakti (Agni) & 4. Satva (Mental resilience) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A1A]/10">
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>3. Ahara Shakti & Agni (Digestive Capacity)</span>
            </label>
            <div className="space-y-1.5">
              {aharaOptions.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setData({ ...data, aharaShakti: a })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.aharaShakti === a
                      ? 'border-[#5E7153] bg-[#5E7153] text-white font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>4. Satva Bala (Mental Fortitude & Stress Tolerance)</span>
            </label>
            <div className="space-y-1.5">
              {satvaOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setData({ ...data, satva: s })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.satva === s
                      ? 'border-[#5E7153] bg-[#5E7153] text-white font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Associated Lakshanas Chips */}
        <div className="pt-4 border-t border-[#1A1A1A]/10">
          <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
            Associated Ayurvedic Lakshanas (Symptoms)
          </label>
          <div className="flex flex-wrap gap-2">
            {commonAyushLakshanas.map((lakshana) => (
              <button
                key={lakshana}
                type="button"
                onClick={() => toggleLakshana(lakshana)}
                className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all cursor-pointer ${
                  data.associatedLakshanas.includes(lakshana)
                    ? 'bg-[#5E7153] text-white border-[#5E7153] font-semibold shadow-xs'
                    : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50'
                }`}
              >
                {lakshana}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
            onClick={() => onSubmitAyush(data)}
            className="px-7 py-3 rounded-full bg-[#5E7153] hover:bg-[#4d5e44] text-white font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Proceed to Red-Flag Screening</span>
            <ArrowRight className="w-4 h-4 text-[#F9F7F2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
