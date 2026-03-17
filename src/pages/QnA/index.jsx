import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';
import { ArrowLeft, PlayCircle, Square } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

const FAQS = [
  {
    id: 1,
    q: "How do I use turn-by-turn navigation?",
    a: "Select any hospital from the map or home page. Open the profile window. Tap the bold blue Navigate button at the bottom of the screen. A blue dotted line will instantly reveal the safest route from your current location directly to the facility."
  },
  {
    id: 2,
    q: "What does the Ping Facility button do?",
    a: "The ping button securely sends an anonymous alert to the hospital reception desk. It informs them that a patient with your specific accessibility profile will arrive in roughly twenty minutes. This gives them time to prepare ramps, clear quiet rooms, or ready signing staff."
  },
  {
    id: 3,
    q: "How accurate are the community reviews?",
    a: "Extremely accurate. Only authenticated users who have physically scanned a QR code at the facility can leave a verified review. The accessibility score dynamically changes based on these live community inputs."
  }
];

export default function QnA() {
  const navigate = useNavigate();
  const { tap } = useHaptics();
  const [readingId, setReadingId] = useState(null);
  
  // Store refs to the text containers to animate them
  const textRefs = useRef({});

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleReadAloud = (faq) => {
    tap();
    if (readingId === faq.id) {
      window.speechSynthesis.cancel();
      setReadingId(null);
      // Reset color
      if (textRefs.current[faq.id]) {
        animate({ targets: textRefs.current[faq.id], color: 'var(--clr-text-secondary)', duration: 200, easing: 'linear' });
      }
      return;
    }

    window.speechSynthesis.cancel();
    setReadingId(faq.id);

    const ut = new SpeechSynthesisUtterance(faq.a);
    ut.rate = 0.9; // Slightly slower for comprehension
    
    const targetEl = textRefs.current[faq.id];

    // Reset whole paragraph to default before starting
    if (targetEl) {
       targetEl.style.color = "var(--clr-text-secondary)";
    }

    ut.onboundary = (event) => {
      if (event.name === 'word' && targetEl) {
        // AnimeJS Companion Reader effect: Pulse the container when a word is spoken
        // For a more advanced version, we would wrap every word in a span and animate the specific span.
        // For performance and simplicity, we'll pulse the whole paragraph block's color slightly.
        animate({
          targets: targetEl,
          color: [
            { value: 'var(--clr-primary)', duration: 100 },
            { value: 'var(--clr-text-secondary)', duration: 400 }
          ],
          easing: 'easeOutSine'
        });
      }
    };

    ut.onend = () => {
      setReadingId(null);
    };

    window.speechSynthesis.speak(ut);
  };

  return (
    <div style={{ padding: 'var(--sp-5) var(--sp-4)', paddingBottom: 100, minHeight: '100dvh', background: 'var(--clr-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--sp-6)', gap: 16 }}>
        <button
          onClick={() => { tap(); navigate(-1); }}
          aria-label="Go back"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)', flexShrink: 0
          }}
        >
          <ArrowLeft size={20} color="var(--clr-text-primary)" />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)' }}>
            Help & Q&A
          </h1>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-sm)' }}>
            Companion reading enabled
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {FAQS.map(faq => {
          const isReading = readingId === faq.id;
          return (
            <div key={faq.id} style={{
              background: 'var(--clr-surface)', borderRadius: 'var(--r-xl)',
              padding: 'var(--sp-5)', border: `2px solid ${isReading ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
              boxShadow: isReading ? '0 8px 24px rgba(37,99,235,0.15)' : 'var(--shadow-sm)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 8 }}>
                  {faq.q}
                </h2>
                  <button
                  onClick={() => handleReadAloud(faq)}
                  aria-label={isReading ? "Stop reading" : "Read answer aloud with companion highlighting"}
                  style={{
                    background: isReading ? 'var(--clr-primary-light)' : 'var(--clr-bg)',
                    border: `1px solid ${isReading ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    borderRadius: '50%', width: 40, height: 40, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--clr-primary)'
                  }}
                >
                  {isReading ? <Square size={18} fill="currentColor" /> : <PlayCircle size={20} />}
                </button>
              </div>
              <p
                ref={el => textRefs.current[faq.id] = el}
                style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 'var(--lh-relaxed)' }}
              >
                {faq.a}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
