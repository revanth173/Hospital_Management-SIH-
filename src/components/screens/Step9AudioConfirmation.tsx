import React, { useState, useEffect } from 'react';
import { Language, EHRSummary, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { speakText, stopSpeaking } from '../../utils/speechHelper';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  Edit3,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface Step9AudioConfirmProps {
  language: Language;
  ehrSummary: EHRSummary;
  patientAuth: PatientAuth;
  onConfirmed: () => void;
  onEditRequested: () => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const Step9AudioConfirmation: React.FC<Step9AudioConfirmProps> = ({
  language,
  ehrSummary,
  patientAuth,
  onConfirmed,
  onEditRequested,
  onBack,
  soundEnabled,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVoiceConfirmed, setIsVoiceConfirmed] = useState(false);

  const getAudioNarrationText = () => {
    return `Patient ${patientAuth.patientName}, age ${patientAuth.age}. Chief Complaint: ${ehrSummary.chiefComplaint}. History: ${ehrSummary.hpiNarrative}. Blood Pressure: ${ehrSummary.vitalSigns.bloodPressure}. Please verify if this information is correct.`;
  };

  useEffect(() => {
    if (soundEnabled) {
      handlePlayAudio();
    }
    return () => stopSpeaking();
  }, [language, soundEnabled]);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    speakText(
      getAudioNarrationText(),
      language,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        09
      </div>

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Volume2 className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 09 • Patient Audio Verification</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.audioConfirmTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-lg mx-auto font-serif italic">
          {t.audioConfirmSubtitle}
        </p>
      </div>

      {/* Main Review Player Card */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Audio Wave Player Box */}
        <div className="p-5 rounded-2xl bg-[#1A1A1A] text-[#F9F7F2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={isPlaying ? stopSpeaking : handlePlayAudio}
              className="w-12 h-12 rounded-full bg-[#F9F7F2] text-[#1A1A1A] flex items-center justify-center shadow-xs hover:scale-105 transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              {isPlaying ? <VolumeX className="w-6 h-6 animate-pulse text-[#843C2E]" /> : <Volume2 className="w-6 h-6 text-[#1A1A1A]" />}
            </button>
            <div>
              <div className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-[#D4A373]">
                Synthesized Voice Readback ({language.toUpperCase()})
              </div>
              <div className="text-sm font-serif italic mt-0.5">
                {isPlaying ? t.audioReadbackNotice : 'Press play to hear the clinical intake summary aloud'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F9F7F2] text-xs font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <RotateCcw className="w-3 h-3 text-[#D4A373]" /> Replay
            </button>
          </div>
        </div>

        {/* Verification Summary Display */}
        <div className="bg-[#F9F7F2] border border-[#1A1A1A]/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#1A1A1A]/10">
            <span>Summary of Logged Symptoms</span>
            <span className="font-serif italic text-[#1A1A1A]/70 lowercase">{patientAuth.patientName}</span>
          </div>

          <div className="text-xs text-[#1A1A1A] space-y-2 leading-relaxed font-serif">
            <div>
              <strong className="font-sans font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 block">Chief Complaint:</strong>
              <span className="italic">{ehrSummary.chiefComplaint}</span>
            </div>
            <div>
              <strong className="font-sans font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 block">Clinical Narrative:</strong>
              <span className="italic">{ehrSummary.hpiNarrative}</span>
            </div>
            <div>
              <strong className="font-sans font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]/70 block">Recorded Blood Pressure & Vitals:</strong>
              <span>{ehrSummary.vitalSigns.bloodPressure}, HR {ehrSummary.vitalSigns.heartRate}, SpO2 {ehrSummary.vitalSigns.spo2}</span>
            </div>
          </div>
        </div>

        {/* Action Dual Choice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={onEditRequested}
            className="p-4 rounded-full border border-[#1A1A1A]/20 hover:bg-[#EAE8E2]/50 text-[#1A1A1A] text-xs font-sans uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#1A1A1A]/60" />
            <span>Need to Change / Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsVoiceConfirmed(true);
              onConfirmed();
            }}
            className="p-4 rounded-full bg-[#5E7153] hover:bg-[#4d5e44] text-white text-xs font-sans uppercase tracking-[0.15em] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#F9F7F2]" />
            <span>Details Accurate • Confirm</span>
          </button>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-2 border-t border-[#1A1A1A]/10 flex justify-between items-center text-[11px] font-sans text-[#1A1A1A]/60">
          <button onClick={onBack} className="text-[#1A1A1A] hover:underline uppercase tracking-wider font-semibold cursor-pointer">
            ← {t.back}
          </button>
          <span className="font-serif italic">DPDP Act Section 6(3) Patient Verification Clause</span>
        </div>
      </div>
    </div>
  );
};
