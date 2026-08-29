import { Language } from '../types/kiosk';

const LANG_VOICE_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  kn: 'kn-IN',
};

// Text-to-Speech (Voice Output)
export function speakText(
  text: string,
  lang: Language = 'en',
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    if (onStart) onStart();
    const timer = setTimeout(() => {
      if (onEnd) onEnd();
    }, 3000);
    return () => clearTimeout(timer);
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_VOICE_MAP[lang] || 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(LANG_VOICE_MAP[lang].slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = () => onStart();
  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Live Microphone Speech Recognition (Voice-to-Text)
export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export function startLiveSpeechRecognition(
  lang: Language = 'te',
  onResult: (result: SpeechRecognitionResultState) => void,
  onError: (error: string) => void,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined') {
    onError('Browser environment not available');
    return { stop: () => {} };
  }

  // @ts-ignore - Support standard and WebKit prefix
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    onError('Speech recognition not supported in this browser. Please use Google Chrome or Edge.');
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.lang = LANG_VOICE_MAP[lang] || 'te-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isManuallyStopped = false;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: !!finalTranscript,
      });
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech Recognition Event:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone access was denied. Please allow microphone permission in browser settings.');
      } else if (event.error === 'no-speech') {
        // Just silent retry
      } else {
        onError(`Voice recognition status: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (!isManuallyStopped && onEnd) {
        onEnd();
      }
    };

    recognition.start();

    return {
      stop: () => {
        isManuallyStopped = true;
        try {
          recognition.stop();
        } catch {
          // Ignore
        }
      },
    };
  } catch (err: any) {
    onError(err?.message || 'Failed to start microphone');
    return { stop: () => {} };
  }
}
