import React, { useState, useEffect, useRef } from 'react';
import { Language, SocratesAssessment, InputMode } from '../../types/kiosk';
import { TRANSLATIONS } from '../../data/languages';
import { SOCRATES_QUESTIONS_FLOW, SocratesQuestionStep } from '../../data/socratesQuestions';
import { startLiveSpeechRecognition, speakText, stopSpeaking } from '../../utils/speechHelper';
import {
  Stethoscope,
  Volume2,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HeartCrack,
  HelpCircle,
  VolumeX,
  FastForward,
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSpokenText, setVoiceSpokenText] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const [recognizedFeedback, setRecognizedFeedback] = useState<string | null>(null);

  const currentQ: SocratesQuestionStep = SOCRATES_QUESTIONS_FLOW[currentQuestionIndex];
  const totalQuestions = SOCRATES_QUESTIONS_FLOW.length;
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Auto-Voice question prompt when switching questions or starting
  useEffect(() => {
    setVoiceSpokenText('');
    setRecognizedFeedback(null);
    setAutoAdvanceCountdown(null);

    const questionVoice = currentQ.voicePrompt[language] || currentQ.voicePrompt.en;
    
    // Announce the question audibly
    setIsAiSpeaking(true);
    const cancelSpeech = speakText(
      questionVoice,
      language,
      () => setIsAiSpeaking(true),
      () => {
        setIsAiSpeaking(false);
        // Automatically start listening after asking if in voice mode
        if (inputMode === 'voice') {
          setIsRecordingVoice(true);
        }
      }
    );

    return () => {
      cancelSpeech();
      stopSpeaking();
    };
  }, [currentQuestionIndex, language, inputMode]);

  // Speech Recognition Hook
  useEffect(() => {
    if (isRecordingVoice) {
      setMicError(null);
      recognitionRef.current = startLiveSpeechRecognition(
        language,
        (res) => {
          setVoiceSpokenText(res.transcript);
          const spoken = res.transcript.toLowerCase();

          // Intelligent Keyword Matcher for the Current Question
          if (currentQ.options) {
            for (const opt of currentQ.options) {
              const matches = opt.keywords.some((kw) => spoken.includes(kw.toLowerCase()));
              if (matches) {
                applyAnswer(currentQ, opt.id, opt.label[language] || opt.label.en);
                break;
              }
            }
          }
        },
        (err) => {
          setMicError(err);
          setIsRecordingVoice(false);
        },
        () => {
          setIsRecordingVoice(false);
        }
      );
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecordingVoice, currentQuestionIndex, language]);

  // Auto advance timer after voice detection
  useEffect(() => {
    let timer: any = null;
    if (autoAdvanceCountdown !== null && autoAdvanceCountdown > 0) {
      timer = setTimeout(() => {
        setAutoAdvanceCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (autoAdvanceCountdown === 0) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [autoAdvanceCountdown]);

  // Apply Answer & trigger affirmative feedback
  const applyAnswer = (question: SocratesQuestionStep, value: string, displayLabel?: string) => {
    setData((prev) => {
      const updated = { ...prev };
      switch (question.key) {
        case 'site':
          updated.siteLocationCategory = value as any;
          updated.site = displayLabel || value;
          break;
        case 'onset':
          updated.onset = value as any;
          break;
        case 'character':
          updated.character = value as any;
          break;
        case 'radiation':
          updated.radiation = value as any;
          break;
        case 'associations':
          if (!updated.associations.includes(value)) {
            updated.associations = [...updated.associations, value];
          }
          break;
        case 'timeCourse':
          updated.timeCourse = value as any;
          break;
        case 'exacerbating':
          if (!updated.exacerbatingFactors.includes(value)) {
            updated.exacerbatingFactors = [...updated.exacerbatingFactors, value];
          }
          break;
        case 'severity':
          updated.severityScore = Number(value);
          break;
      }
      return updated;
    });

    setRecognizedFeedback(displayLabel || value);
    setIsRecordingVoice(false);

    // Provide affirmative voice feedback in regional language and auto-advance
    const confirmPhrase = language === 'te' 
      ? `నమోదు చేసాను: ${displayLabel || value}. తర్వాతి ప్రశ్నకు వెళ్తున్నాం.`
      : language === 'hi'
      ? `दर्ज किया गया: ${displayLabel || value}. अगले प्रश्न पर जा रहे हैं।`
      : `Noted: ${displayLabel || value}. Moving to the next question.`;

    speakText(confirmPhrase, language);
    setAutoAdvanceCountdown(2);
  };

  const handleNextQuestion = () => {
    setAutoAdvanceCountdown(null);
    setRecognizedFeedback(null);
    stopSpeaking();

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all 8 questions -> Proceed to Step 6
      onSubmitSocrates(data);
    }
  };

  const handlePrevQuestion = () => {
    setAutoAdvanceCountdown(null);
    setRecognizedFeedback(null);
    stopSpeaking();

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleRepeatQuestion = () => {
    stopSpeaking();
    setIsAiSpeaking(true);
    const questionVoice = currentQ.voicePrompt[language] || currentQ.voicePrompt.en;
    speakText(
      questionVoice,
      language,
      () => setIsAiSpeaking(true),
      () => {
        setIsAiSpeaking(false);
        setIsRecordingVoice(true);
      }
    );
  };

  // High acuity warning check
  const isCardiacAlert =
    data.siteLocationCategory === 'chest' &&
    (data.character.includes('Crushing') || data.severityScore >= 8);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 relative">
      {/* Top Banner: Step Progress Indicator */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-5 mb-5 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-serif font-bold text-lg">
              {currentQ.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  SOCRATES • Step {currentQ.stepNumber} of {totalQuestions}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                  {currentQ.medicalClinicalRationale}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                AI Interactive Doctor Voice Consultation • ఒక్కో ప్రశ్నకు జవాబు చెప్పండి
              </p>
            </div>
          </div>

          {/* S-O-C-R-A-T-E-S Step Indicator Pills */}
          <div className="flex items-center gap-1.5">
            {SOCRATES_QUESTIONS_FLOW.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isPast = idx < currentQuestionIndex;
              return (
                <button
                  key={q.key}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-md scale-110'
                      : isPast
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                  title={q.title[language] || q.title.en}
                >
                  {isPast ? '✓' : q.letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* High-Risk Cardiac Warning Banner */}
      {isCardiacAlert && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3 animate-pulse">
          <HeartCrack className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs font-sans">
            <strong>Clinical Priority Alert:</strong> Severe chest discomfort with crushing sensation logged. Triaged for priority ECG correlation.
          </div>
        </div>
      )}

      {/* Main Active Question Card */}
      <div className="bg-[#FAF9F5] border border-white/60 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900 space-y-6 relative overflow-hidden">
        {/* Active Question Title & Voice Announce Banner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg">
              Medical Query {currentQ.stepNumber}/{totalQuestions} ({currentQ.letter})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRepeatQuestion}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {isAiSpeaking ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-emerald-700 font-bold">Asking Question...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span>Repeat Voice Question 🗣️</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {currentQ.title[language] || currentQ.title.en}
          </h3>
          <p className="text-sm text-slate-700 font-sans leading-relaxed">
            {currentQ.voicePrompt[language] || currentQ.voicePrompt.en}
          </p>
        </div>

        {/* Live Audio Listening Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95 ${
                  isRecordingVoice
                    ? 'bg-rose-600 text-white ring-4 ring-rose-400/30 animate-pulse'
                    : 'bg-[#0F172A] hover:bg-black text-white'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 text-emerald-400" />}
              </button>
              <div>
                <div className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span>{isRecordingVoice ? '🎙️ Listening to your Voice Live (మాట్లాడండి)...' : '🎙️ Tap to Speak (నోటితో చెప్పండి)'}</span>
                  {isRecordingVoice && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />}
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  {isRecordingVoice ? 'Say your answer naturally in Telugu, Hindi or English' : 'Mic is ready • Speak your answer or select an option below'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRecordingVoice(!isRecordingVoice)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isRecordingVoice
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isRecordingVoice ? 'Stop Mic ⏹️' : 'Start Speaking 🎙️'}
            </button>
          </div>

          {/* Live Spoken Word Box */}
          {voiceSpokenText && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans text-slate-900 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                  You Spoken:
                </span>
                <button
                  type="button"
                  onClick={() => setVoiceSpokenText('')}
                  className="text-[10px] text-rose-600 hover:underline font-bold"
                >
                  Clear ✕
                </button>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200 font-serif italic text-sm text-slate-900">
                "{voiceSpokenText}"
              </div>
            </div>
          )}

          {/* AI Recognition Feedback & Auto Next Countdown */}
          {recognizedFeedback && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs font-sans">
                  <strong>Noted Point:</strong> <span className="font-bold underline">{recognizedFeedback}</span>
                </div>
              </div>
              {autoAdvanceCountdown !== null && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-lg">
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Next in {autoAdvanceCountdown}s...</span>
                </div>
              )}
            </div>
          )}

          {micError && (
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-sans">
              ⚠️ {micError}
            </div>
          )}
        </div>

        {/* Direct Tap Options (Visual Fallback or Confirmation) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-3">
            Or Tap an Option to Record Instantly:
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options?.map((opt) => {
              // Check if currently selected
              let isSelected = false;
              if (currentQ.key === 'site') isSelected = data.siteLocationCategory === opt.id;
              if (currentQ.key === 'onset') isSelected = data.onset === opt.id;
              if (currentQ.key === 'character') isSelected = data.character === opt.id;
              if (currentQ.key === 'radiation') isSelected = data.radiation === opt.id;
              if (currentQ.key === 'associations') isSelected = data.associations.includes(opt.id);
              if (currentQ.key === 'timeCourse') isSelected = data.timeCourse === opt.id;
              if (currentQ.key === 'exacerbating') isSelected = data.exacerbatingFactors.includes(opt.id);
              if (currentQ.key === 'severity') isSelected = data.severityScore === Number(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => applyAnswer(currentQ, opt.id, opt.label[language] || opt.label.en)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]'
                      : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-3.5 right-3.5" />
                  )}
                  <div className="text-sm font-serif font-bold text-slate-900 pr-6">
                    {opt.label[language] || opt.label.en}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 mt-1 font-medium">
                    {opt.clinicalTag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Recorded Clinical Assessment Summary Chips */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
            Clinical Intake Live Summary (8 Factors):
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-lg border ${data.site ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <strong>Site:</strong> {data.site || 'Pending...'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border ${data.onset ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <strong>Onset:</strong> {data.onset || 'Pending...'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border ${data.character ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <strong>Character:</strong> {data.character || 'Pending...'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border ${data.radiation ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <strong>Radiation:</strong> {data.radiation || 'Pending...'}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border ${data.severityScore ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <strong>Severity:</strong> {data.severityScore}/10
            </span>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePrevQuestion}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentQuestionIndex === 0 ? '← Back to Menu' : 'Previous Question'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-sans uppercase tracking-[0.15em] font-bold shadow-lg hover:shadow-emerald-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentQuestionIndex === totalQuestions - 1
                ? 'Proceed to Red-Flag Screening →'
                : `Next Question (${currentQuestionIndex + 2}/${totalQuestions}) →`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
