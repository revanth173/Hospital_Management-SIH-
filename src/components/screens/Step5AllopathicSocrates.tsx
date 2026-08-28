import React, { useState } from 'react';
import { Language, SocratesAssessment, InputMode } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Stethoscope,
  AlertCircle,
  Activity,
  ArrowRight,
  Flame,
  Zap,
  HeartCrack,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Step5SocratesProps {
  language: Language;
  inputMode: InputMode;
  initialData: SocratesAssessment;
  onSubmitSocrates: (data: SocratesAssessment) => void;
  onBack: () => void;
}

export const Step5AllopathicSocrates: React.FC<Step5SocratesProps> = ({
  language,
  inputMode,
  initialData,
  onSubmitSocrates,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [data, setData] = useState<SocratesAssessment>(initialData);

  const siteCategories: Array<{
    id: SocratesAssessment['siteLocationCategory'];
    label: string;
    description: string;
  }> = [
    { id: 'chest', label: 'Chest / Precordial', description: 'Retrosternal, Left/Right Hemithorax' },
    { id: 'head', label: 'Head & Neurological', description: 'Frontal, Occipital, Unilateral Temple' },
    { id: 'abdomen', label: 'Abdomen / GI', description: 'Epigastric, RUQ, RLQ, Periumbilical' },
    { id: 'throat', label: 'Throat & Upper Airway', description: 'Pharynx, Larynx, Tonsillar' },
    { id: 'limbs', label: 'Limbs & Joints', description: 'Knees, Shoulders, Calves, Wrists' },
    { id: 'back', label: 'Spine & Lumbar Back', description: 'Cervical, Thoracic, Lower Back' },
  ];

  const characterOptions: SocratesAssessment['character'][] = [
    'Crushing / Constricting',
    'Sharp / Stabbing',
    'Dull Aching',
    'Burning',
    'Throbbing',
    'Colicky',
  ];

  const onsetOptions: SocratesAssessment['onset'][] = [
    'Sudden (<15 mins)',
    'Rapid (1-2 hours)',
    'Gradual (days)',
    'Post-trauma',
    'During exertion',
  ];

  const radiationOptions: SocratesAssessment['radiation'][] = [
    'Left arm, shoulder & jaw',
    'Through to back',
    'Down right lower abdomen',
    'None',
  ];

  const commonAssociations = [
    'Diaphoresis (Profuse sweating)',
    'Dyspnea (Shortness of breath)',
    'Nausea/Vomiting',
    'Dizziness / Presyncope',
    'Palpitations',
    'High fever (>101°F)',
    'Cough with expectoration',
  ];

  const toggleAssociation = (assoc: string) => {
    setData((prev) => ({
      ...prev,
      associations: prev.associations.includes(assoc)
        ? prev.associations.filter((a) => a !== assoc)
        : [...prev.associations, assoc],
    }));
  };

  const isCardiacHighRisk =
    data.siteLocationCategory === 'chest' &&
    (data.character.includes('Crushing') || data.severityScore >= 8) &&
    (data.radiation.includes('arm') || data.associations.some((a) => a.includes('Diaphoresis')));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        05A
      </div>

      {/* Step Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Stethoscope className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 05A • Allopathic SOCRATES Protocol</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.socratesTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Systematic 8-factor clinical assessment for high-precision diagnostic triage.
        </p>
      </div>

      {/* High-Risk Pre-Alert Flag */}
      {isCardiacHighRisk && (
        <div className="mb-6 p-4 rounded-2xl bg-[#843C2E]/10 border border-[#843C2E]/30 text-[#843C2E] flex items-center gap-3 animate-pulse">
          <HeartCrack className="w-6 h-6 text-[#843C2E] shrink-0" />
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#843C2E]">
              High Acuity Flag Detected
            </div>
            <div className="text-xs font-serif italic mt-0.5">
              Chest discomfort with crushing character & radiation/sweating triggers urgent priority clinical triage.
            </div>
          </div>
        </div>
      )}

      {/* Main SOCRATES Form Grid */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* 1. Site (Anatomical Region) */}
        <div>
          <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
            1. Site (Anatomical Location)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {siteCategories.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    siteLocationCategory: sc.id,
                    site: sc.label,
                  })
                }
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  data.siteLocationCategory === sc.id
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2]'
                    : 'border-[#1A1A1A]/15 hover:border-[#1A1A1A]/30 text-[#1A1A1A] bg-white'
                }`}
              >
                <div className="text-xs font-sans font-bold tracking-tight">{sc.label}</div>
                <div className={`text-[10px] mt-0.5 font-serif italic ${data.siteLocationCategory === sc.id ? 'text-[#D4A373]' : 'text-[#1A1A1A]/60'}`}>
                  {sc.description}
                </div>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={data.site}
            onChange={(e) => setData({ ...data, site: e.target.value })}
            className="mt-2.5 w-full px-4 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-xs focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
            placeholder="Specific anatomical details (e.g. Substernal retrosternal mid-chest)"
          />
        </div>

        {/* 2. Onset & 3. Character */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A1A]/10">
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              2. Onset (Temporal Commencement)
            </label>
            <div className="space-y-1.5">
              {onsetOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setData({ ...data, onset: opt })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.onset === opt
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              3. Character (Pain Quality)
            </label>
            <div className="space-y-1.5">
              {characterOptions.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => setData({ ...data, character: char })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.character === char
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Radiation & 5. Associations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1A1A1A]/10">
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              4. Radiation (Anatomical Extension)
            </label>
            <div className="space-y-1.5">
              {radiationOptions.map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => setData({ ...data, radiation: rad })}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    data.radiation === rad
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] font-semibold'
                      : 'border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] bg-white'
                  }`}
                >
                  {rad}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              5. Associated Symptoms (Select all)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonAssociations.map((assoc) => (
                <button
                  key={assoc}
                  type="button"
                  onClick={() => toggleAssociation(assoc)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-sans transition-all cursor-pointer ${
                    data.associations.includes(assoc)
                      ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A] font-semibold shadow-xs'
                      : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/15 hover:bg-[#EAE8E2]/50'
                  }`}
                >
                  {assoc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Time Course & 7. Severity (1-10) */}
        <div className="pt-4 border-t border-[#1A1A1A]/10 space-y-4">
          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-2">
              6. Severity (Visual Analog Scale 1 to 10)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={data.severityScore}
                onChange={(e) => setData({ ...data, severityScore: Number(e.target.value) })}
                className="w-full h-2 bg-[#EAE8E2] rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
              />
              <div
                className={`w-14 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold shadow-xs shrink-0 ${
                  data.severityScore >= 8
                    ? 'bg-[#843C2E] text-white'
                    : data.severityScore >= 5
                    ? 'bg-[#D4A373] text-[#1A1A1A]'
                    : 'bg-[#5E7153] text-white'
                }`}
              >
                {data.severityScore}/10
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-sans uppercase tracking-wider text-[#1A1A1A]/60 mt-1">
              <span>1 - Mild</span>
              <span>5 - Moderate</span>
              <span className="text-[#843C2E] font-bold">10 - Worst Pain</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] mb-1.5">
              Functional Impact
            </label>
            <select
              value={data.functionalImpact}
              onChange={(e) => setData({ ...data, functionalImpact: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#1A1A1A]/20 bg-[#F9F7F2]/40 text-xs focus:ring-1 focus:ring-[#D4A373] focus:outline-none"
            >
              <option value="Mild discomfort">Mild discomfort (Normal daily activities)</option>
              <option value="Moderate discomfort">Moderate discomfort (Restricts standard activities)</option>
              <option value="Severely limited">Severely limited (Requires assistance to walk)</option>
              <option value="Unable to walk or speak in full sentences">
                Unable to walk or speak in full sentences (Critical emergency state)
              </option>
            </select>
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
            onClick={() => onSubmitSocrates(data)}
            className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Proceed to Red-Flag Screening</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
