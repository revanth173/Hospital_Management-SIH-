import React, { useState } from 'react';
import { Language, InputMode } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import {
  Mic,
  Touchpad,
  Languages,
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
} from 'lucide-react';

interface Step3InputMethodProps {
  language: Language;
  selectedMode: InputMode;
  onSelectMode: (mode: InputMode) => void;
  onBack: () => void;
}

export const Step3InputMethod: React.FC<Step3InputMethodProps> = ({
  language,
  selectedMode,
  onSelectMode,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [activeChoice, setActiveChoice] = useState<InputMode>(selectedMode || 'touch');
  const [isSimulatingMic, setIsSimulatingMic] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const sampleVoicePhrases: Record<Language, string> = {
    en: 'I have severe retrosternal chest pain radiating to my left arm for the past 2 hours...',
    hi: 'मुझे पिछले 2 घंटे से सीने में तेज दर्द और बाएं हाथ में खिंचाव महसूस हो रहा है...',
    ta: 'கடந்த 2 மணி நேரமாக எனது நெஞ்சில் கடுமையான வலி மற்றும் இடது கையில் பரவுகிறது...',
    te: 'గత 2 గంటలుగా నా ఛాతీలో తీవ్రమైన నొప్పి మరియు ఎడమ చేతికి వ్యాపిస్తోంది...',
    bn: 'গত ২ ঘন্টা ধরে আমার বুকে তীব্র ব্যথা এবং বাম হাতে ছড়িয়ে পড়ছে...',
    mr: 'गेल्या २ तासांपासून माझ्या छातीत तीव्र वेदना होत असून डाव्या हाताकडे जात आहेत...',
    kn: 'ಕಳೆದ 2 ಗಂಟೆಗಳಿಂದ ಎದೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಮತ್ತು ಎಡಗೈಗೆ ಹರಡುತ್ತಿದೆ...',
  };

  const handleTestMic = () => {
    setIsSimulatingMic(true);
    setLiveTranscript('');
    let phrase = sampleVoicePhrases[language] || sampleVoicePhrases.en;
    let i = 0;
    const interval = setInterval(() => {
      if (i < phrase.length) {
        setLiveTranscript(phrase.slice(0, i + 5));
        i += 5;
      } else {
        clearInterval(interval);
        setIsSimulatingMic(false);
      }
    }, 80);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 relative">
      {/* Background Watermark Numerals */}
      <div className="absolute top-0 right-6 text-[140px] font-serif font-bold text-black/3 select-none pointer-events-none leading-none">
        03
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE8E2] text-[#1A1A1A] text-[10px] font-sans uppercase tracking-[0.2em] mb-2 border border-[#1A1A1A]/10">
          <Languages className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Stage 03 • Modality Preference</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A] tracking-tight">{t.inputMethodTitle}</h2>
        <p className="text-[#1A1A1A]/70 text-sm mt-1 max-w-lg mx-auto font-serif italic">
          Optimized for diverse literacy levels, senior citizens, and multilingual speech recognition.
        </p>
      </div>

      {/* Two Big Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Voice AI Option */}
        <div
          onClick={() => setActiveChoice('voice')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
            activeChoice === 'voice'
              ? 'border-[#1A1A1A] bg-white shadow-md ring-1 ring-[#1A1A1A]'
              : 'border-[#1A1A1A]/10 bg-white/70 hover:border-[#1A1A1A]/30 hover:bg-white'
          }`}
        >
          {activeChoice === 'voice' && (
            <div className="absolute top-4 right-4 bg-[#1A1A1A] text-[#F9F7F2] p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-[#D4A373]" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center mb-4 shadow-xs">
              <Mic className="w-6 h-6 text-[#D4A373] animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.voiceInput}</h3>
              <span className="text-[9px] uppercase font-sans font-bold tracking-[0.15em] px-2 py-0.5 rounded-full bg-[#EAE8E2] text-[#1A1A1A]">
                AI Engine
              </span>
            </div>
            <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mt-2 font-serif italic">{t.voiceDesc}</p>

            {/* Simulated Live Mic demo in card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#1A1A1A] text-[#F9F7F2] text-xs">
              <div className="flex items-center justify-between text-[#F9F7F2]/60 text-[10px] mb-1.5 font-sans uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5E7153] animate-ping" />
                  Indian ASR Stream
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestMic();
                  }}
                  className="px-2.5 py-0.5 bg-[#F9F7F2] hover:bg-white rounded-full text-[#1A1A1A] font-sans font-bold text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isSimulatingMic ? 'Listening...' : 'Test Mic'}
                </button>
              </div>
              <div className="font-serif italic text-[#D4A373] min-h-[36px]">
                {liveTranscript || `"${sampleVoicePhrases[language]}"`}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-sans text-[#1A1A1A]/80">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Hands-free voice triage in 7 Indian regional languages</span>
          </div>
        </div>

        {/* Touch Screen UI Option */}
        <div
          onClick={() => setActiveChoice('touch')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
            activeChoice === 'touch'
              ? 'border-[#1A1A1A] bg-white shadow-md ring-1 ring-[#1A1A1A]'
              : 'border-[#1A1A1A]/10 bg-white/70 hover:border-[#1A1A1A]/30 hover:bg-white'
          }`}
        >
          {activeChoice === 'touch' && (
            <div className="absolute top-4 right-4 bg-[#1A1A1A] text-[#F9F7F2] p-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-[#D4A373]" />
            </div>
          )}

          <div>
            <div className="w-12 h-12 rounded-full bg-[#EAE8E2] text-[#1A1A1A] flex items-center justify-center mb-4 border border-[#1A1A1A]/10">
              <Touchpad className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">{t.touchInput}</h3>
              <span className="text-[9px] uppercase font-sans font-bold tracking-[0.15em] px-2 py-0.5 rounded-full bg-[#EAE8E2] text-[#1A1A1A]">
                Tactile UI
              </span>
            </div>
            <p className="text-[#1A1A1A]/70 text-xs leading-relaxed mt-2 font-serif italic">{t.touchDesc}</p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#1A1A1A]/10 font-sans text-[11px] uppercase tracking-wider text-[#1A1A1A]">
                Visual Anatomy Map
              </div>
              <div className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#1A1A1A]/10 font-sans text-[11px] uppercase tracking-wider text-[#1A1A1A]">
                1–10 Severity Scale
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-sans text-[#1A1A1A]/80">
            <Touchpad className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>High-contrast large touch targets with anatomical selectors</span>
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
          onClick={() => onSelectMode(activeChoice)}
          className="px-7 py-3 rounded-full bg-[#1A1A1A] hover:bg-black text-[#F9F7F2] font-sans uppercase tracking-[0.15em] text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Continue with {activeChoice === 'voice' ? 'Voice AI' : 'Touch UI'}</span>
          <ArrowRight className="w-4 h-4 text-[#D4A373]" />
        </button>
      </div>
    </div>
  );
};
