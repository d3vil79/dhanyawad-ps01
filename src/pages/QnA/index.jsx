import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animate } from 'animejs';
import { ArrowLeft, PlayCircle, Square, Mic, Send, Bot, CheckCircle } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';

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
  
  // Custom Chatbot State
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 'msg1', type: 'bot', text: 'Hello! I am your AccessCare Assistant. Ask me any question via text or voice.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const { listening, transcript, startListening, stopListening } = useVoiceCommand({
    onFinalResult: (text) => setInputText(prev => (prev ? prev + ' ' : '') + text),
  });

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

  const readMessageAloud = (msgId, text) => {
    window.speechSynthesis.cancel();
    setReadingId(msgId);
    const ut = new SpeechSynthesisUtterance(text);
    ut.rate = 0.95;
    ut.onend = () => setReadingId(null);
    window.speechSynthesis.speak(ut);
  };

  const handleAsk = () => {
    if (!inputText.trim()) return;
    tap();
    const userMsg = { id: Date.now().toString(), type: 'user', text: inputText };
    setChatHistory(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      setIsTyping(false);
      const ansText = "Our facilities prioritize accessibility. I recommend checking the Facility Details page to view specific features like ramps, sign language availability, or sensory-friendly areas. You can also use the Companion Connect feature to request a verified volunteer for assistance.";
      const botMsg = { id: (Date.now() + 1).toString(), type: 'bot', text: ansText };
      setChatHistory(prev => [...prev, botMsg]);
      readMessageAloud(botMsg.id, ansText);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    tap();
    if (listening) {
      stopListening();
    } else {
      window.speechSynthesis.cancel();
      startListening();
    }
  };

  return (
    <div style={{ padding: 'var(--sp-5) var(--sp-4)', paddingBottom: 100, minHeight: '100dvh', background: 'var(--clr-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--sp-6)', gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
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
        
        {/* Chatbot Interface */}
        <section style={{ background: 'var(--clr-surface)', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-4)', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--sp-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bot size={20} color="var(--clr-primary)" /> AI Assistant
          </h2>
          
          <div style={{ height: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {chatHistory.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: 'var(--r-xl)',
                  background: msg.type === 'user' ? 'var(--clr-primary)' : 'var(--clr-bg-card)',
                  color: msg.type === 'user' ? '#fff' : 'var(--clr-text-primary)',
                  boxShadow: 'var(--shadow-sm)', border: msg.type === 'user' ? 'none' : '1px solid var(--clr-border)',
                  borderBottomRightRadius: msg.type === 'user' ? 4 : 'var(--r-xl)',
                  borderBottomLeftRadius: msg.type === 'bot' ? 4 : 'var(--r-xl)',
                  fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)'
                }}>
                  {msg.text}
                </div>
                {msg.type === 'bot' && (
                  <button onClick={() => { tap(); readMessageAloud(msg.id, msg.text); }} style={{ background: 'none', border: 'none', color: readingId === msg.id ? 'var(--clr-primary)' : 'var(--clr-text-muted)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    {readingId === msg.id ? <Square size={10} fill="currentColor"/> : <PlayCircle size={12}/>} {readingId === msg.id ? 'Stop' : 'Read aloud'}
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--clr-bg-card)', padding: '12px 16px', borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)', display: 'flex', gap: 4 }}>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-text-muted)' }} />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-text-muted)' }} />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-text-muted)' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder={listening ? "Listening..." : "Ask a question..."}
                style={{
                  width: '100%', padding: '14px 16px', paddingRight: 48,
                  borderRadius: 'var(--r-full)', border: `2px solid ${listening ? 'var(--clr-alert-red)' : 'var(--clr-border)'}`,
                  background: listening ? '#FEF2F2' : 'var(--clr-bg-card)', color: 'var(--clr-text-primary)',
                  fontSize: 'var(--fs-base)', outline: 'none'
                }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }} onClick={handleVoiceToggle}
                style={{ position: 'absolute', right: 6, top: 6, width: 36, height: 36, borderRadius: '50%', background: listening ? 'var(--clr-alert-red)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {listening ? <Square size={16} color="#fff" /> : <Mic size={20} color="var(--clr-text-secondary)" />}
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }} onClick={handleAsk}
              disabled={!inputText.trim() && !listening}
              style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--clr-primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!inputText.trim() && !listening) ? 0.5 : 1 }}
            >
              <Send size={20} style={{ marginLeft: -2 }} />
            </motion.button>
          </div>
        </section>

        <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-muted)', paddingLeft: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Common Questions</h3>
        
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
                <motion.button
                  whileTap={{ scale: 0.9 }}
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
                </motion.button>
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
