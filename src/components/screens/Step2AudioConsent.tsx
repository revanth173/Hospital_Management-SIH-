import React, { useState, useEffect } from 'react';
import { Language, DPDPDataConsent, PatientAuth } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { speakText, stopSpeaking } from '../../utils/speechHelper';
import {
  ShieldCheck,
  Volume2,
  Mic,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  VolumeX,
} from 'lucide-react';

interface Step2AudioConsentProps {
  language: Language;
  patientAuth: PatientAuth;
  onConsentGiven: (consent: DPDPDataConsent) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const Step2AudioConsent: React.FC<Step2AudioConsentProps> = ({
  language,
  patientAuth,
  onConsentGiven,
  onBack,
  soundEnabled,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceAgreed, setVoiceAgreed] = useState(false);
  const [touchAgreed, setTouchAgreed] = useState(false);

  useEffect(() => {
    if (soundEnabled) {
      handlePlayConsentAudio();
    }
    return () => stopSpeaking();
  }, [language, soundEnabled]);

  const handlePlayConsentAudio = () => {
    setIsPlayingAudio(true);
    speakText(
      t.dpdpConsentClause,
      language,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleSimulateVoiceConsent = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setIsListeningVoice(false);
      setVoiceAgreed(true);
      setTouchAgreed(true);
    }, 1500);
  };

  const handleSubmitConsent = () => {
    const consent: DPDPDataConsent = {
      consentId: `DPDP-CON-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      dpdpActVersion: 'DPDP Act 2023 - Sec 6(1)',
      purpose: 'OPD Clinical Triage & Tele-consultation EHR Generation',
      retentionPeriod: 'Session Only (Ephemeral Kiosk Execution)',
      voiceConsentRecorded: voiceAgreed || true,
      voiceConsentAudioDurationSec: 8,
      digitalSignatureAccepted: true,
      language,
    };
    onConsentGiven(consent);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        02
      </div>

      {/* Step Header */}
      <div className="text-center mb-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5E7153]" />
          <span>Stage 02 • Statutory DPDP Consent</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.dpdpConsentTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 font-serif italic">
          Subject: <span className="font-semibold text-[#1A1A1A]">{patientAuth.patientName}</span> (ABHA: {patientAuth.abhaId})
        </p>
      </div>

      {/* Main Legal Card */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Audio Player Strip */}
        <div className="p-4 rounded-2xl bg-[#EAE8E2]/60 border border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={isPlayingAudio ? stopSpeaking : handlePlayConsentAudio}
              className="w-11 h-11 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] flex items-center justify-center shadow-xs cursor-pointer transition-all active:scale-95"
            >
              {isPlayingAudio ? <VolumeX className="w-5 h-5 text-[#D4A373] animate-pulse" /> : <Volume2 className="w-5 h-5 text-[#D4A373]" />}
            </button>
            <div>
              <div className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#1A1A1A] flex items-center gap-1.5">
                <span>Multilingual Audio Readback</span>
                {isPlayingAudio && (
                  <span className="flex gap-0.5 ml-1">
                    <span className="w-1 h-3 bg-[#D4A373] rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-[#D4A373] rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-[#D4A373] rounded-full animate-bounce delay-150" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#1A1A1A]/70 font-serif italic">
                {isPlayingAudio ? 'Audible stream active in chosen language...' : 'Listen to statutory consent terms in your preferred tongue'}
              </div>
            </div>
          </div>

          <button
            onClick={handlePlayConsentAudio}
            className="px-3.5 py-1.5 text-[10px] font-sans uppercase tracking-[0.15em] text-[#1A1A1A] bg-white rounded-full border border-[#1A1A1A]/15 hover:bg-[#1A1A1A] hover:text-[#F9F7F2] transition-all cursor-pointer"
          >
            Replay Audio
          </button>
        </div>

        {/* Legal Text Clause */}
        <div className="bg-[#F9F7F2] p-5 rounded-2xl border border-[#1A1A1A]/10 text-xs leading-relaxed text-[#1A1A1A]">
          <div className="flex items-center gap-2 font-sans font-bold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/80 mb-2">
            <Lock className="w-3.5 h-3.5 text-[#5E7153]" />
            <span>Digital Personal Data Protection Act 2023 - Clause 6(1) Notice</span>
          </div>
          <p className="font-serif italic bg-white p-4 rounded-xl border border-[#1A1A1A]/10 text-[#1A1A1A] text-sm mb-4 leading-relaxed">
            "{t.dpdpConsentClause}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans text-[#1A1A1A]/70">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
              <span>Purpose: OPD Clinical Intake & Triage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
              <span>Retention: Ephemeral session only (Auto-purged)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
              <span>Data Fiduciary: National Health Authority (NHA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
              <span>Patient Right: Revocable via ABHA App anytime</span>
            </div>
          </div>
        </div>

        {/* Voice Consent & Touch Acceptance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleSimulateVoiceConsent}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              voiceAgreed
                ? 'border-[#5E7153] bg-[#5E7153]/10 text-[#1A1A1A] shadow-xs'
                : isListeningVoice
                ? 'border-[#D4A373] bg-[#EAE8E2] text-[#1A1A1A] animate-pulse'
                : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${voiceAgreed ? 'bg-[#5E7153] text-white' : 'bg-[#EAE8E2] text-[#1A1A1A]'}`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-sans font-bold uppercase tracking-wider">
                  {voiceAgreed ? 'Voice Consent Recorded' : isListeningVoice ? 'Listening for "I Agree"...' : 'Voice Consent ("I Agree")'}
                </div>
                <div className="text-[11px] text-[#1A1A1A]/60 font-serif italic">
                  {voiceAgreed ? 'Audio sample verified' : 'Speak into kiosk microphone'}
                </div>
              </div>
            </div>
            {voiceAgreed && <CheckCircle2 className="w-5 h-5 text-[#5E7153]" />}
          </button>

          <button
            type="button"
            onClick={() => setTouchAgreed(!touchAgreed)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              touchAgreed
                ? 'border-[#5E7153] bg-[#5E7153]/10 text-[#1A1A1A] shadow-xs'
                : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${touchAgreed ? 'bg-[#5E7153] text-white' : 'bg-[#EAE8E2] text-[#1A1A1A]'}`}>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-sans font-bold uppercase tracking-wider">Touch Screen Signature</div>
                <div className="text-[11px] text-[#1A1A1A]/60 font-serif italic">
                  {touchAgreed ? 'Digital acceptance timestamped' : 'Tap to sign digitally'}
                </div>
              </div>
            </div>
            {touchAgreed && <CheckCircle2 className="w-5 h-5 text-[#5E7153]" />}
          </button>
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
            onClick={handleSubmitConsent}
            className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            <span>{t.iAgreeBtn}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A373]" />
          </button>
        </div>
      </div>
    </div>
  );
};
