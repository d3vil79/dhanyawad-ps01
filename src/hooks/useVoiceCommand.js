import { useState, useRef, useCallback } from 'react';

/**
 * useVoiceCommand
 * - Wraps the Web Speech API (SpeechRecognition)
 * - Auto-commits the final transcript via `onFinalResult` callback
 * - Keeps interim partial results in `transcript`
 */
export function useVoiceCommand({ onFinalResult } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    // cancel any existing session
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (e) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      // auto-commit final result immediately
      if (final && onFinalResult) {
        onFinalResult(final.trim());
      }
    };

    recognition.onerror = (e) => {
      const msg = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not found.',
        'not-allowed': 'Microphone access denied. Please allow microphone access.',
        'network': 'Network error during speech recognition.',
      }[e.error] || `Error: ${e.error}`;
      setError(msg);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onFinalResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { listening, transcript, error, startListening, stopListening, resetTranscript };
}
