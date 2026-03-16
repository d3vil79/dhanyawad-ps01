import { create } from 'zustand';

export const useAccessibilityStore = create((set, get) => ({
  highContrast: false,
  dyslexiaFont: false,
  ttsEnabled: false,
  fontSize: 'base', // 'base' | 'lg' | 'xl'

  toggleHighContrast: () => {
    const next = !get().highContrast;
    set({ highContrast: next });
    document.body.classList.toggle('high-contrast', next);
    // Speak confirmation without checking ttsEnabled so user knows it worked
    if ('speechSynthesis' in window && get().ttsEnabled) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(
        next ? 'High contrast mode enabled.' : 'High contrast mode disabled.'
      );
      window.speechSynthesis.speak(utt);
    }
  },

  toggleDyslexiaFont: () => {
    const next = !get().dyslexiaFont;
    set({ dyslexiaFont: next });
    document.body.classList.toggle('dyslexia', next);
    if ('speechSynthesis' in window && get().ttsEnabled) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(
        next ? 'Dyslexia friendly font enabled.' : 'Default font restored.'
      );
      window.speechSynthesis.speak(utt);
    }
  },

  toggleTts: () => {
    const next = !get().ttsEnabled;
    set({ ttsEnabled: next });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (next) {
        const utt = new SpeechSynthesisUtterance('Text to speech is now enabled.');
        window.speechSynthesis.speak(utt);
      }
    }
  },

  setFontSize: (size) => {
    set({ fontSize: size });
    document.body.classList.remove('font-lg', 'font-xl');
    if (size !== 'base') document.body.classList.add(`font-${size}`);
    const labels = { base: 'Normal', lg: 'Large', xl: 'Extra large' };
    if (get().ttsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(`Text size set to ${labels[size]}.`)
      );
    }
  },

  /**
   * Speak text aloud — only if TTS is enabled.
   * @param {string} text
   * @param {Object} opts
   * @param {boolean} opts.force — speak even if TTS is off (e.g. toggle confirmation)
   * @param {number}  opts.rate  — speech rate (default 0.95)
   */
  speak: (text, { force = false, rate = 0.95 } = {}) => {
    if (!force && !get().ttsEnabled) return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate;
    utt.pitch = 1.05;
    window.speechSynthesis.speak(utt);
  },

  /**
   * Stop any ongoing speech.
   */
  stopSpeaking: () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  },
}));
