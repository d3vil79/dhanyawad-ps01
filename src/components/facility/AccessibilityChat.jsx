import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, User, Bot, Loader } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';

const PRESETS = [
  "Is the ramp at the main entrance clear?",
  "Are there any available wheelchair assistants?",
  "Is the accessible restroom on Level 1 open?",
  "Can I request a sensory-friendly waiting room?"
];

const MOCK_ANSWERS = {
  "ramp": "Yes, the main ramp is clear and salt-treated for safety.",
  "wheelchair": "We have 3 assistants available right now. We can have one meet you at the entrance!",
  "restroom": "The Level 1 restroom is currently open and recently cleaned.",
  "sensory": "Absolutely. Level 2 has a quiet zone. I can reserve a spot for you.",
  "default": "Thank you for your message! Our coordinator is checking that for you right now."
};

export function AccessibilityChat({ isOpen, onClose, facility }) {
  const { tap, success } = useHaptics();
  const { speak } = useAccessibilityStore();
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello! I'm the accessibility coordinator for ${facility?.name}. How can I help you prepare for your visit?`, sender: 'staff' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (text) => {
    if (!text.trim()) return;
    tap();
    const newMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Staff Response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = MOCK_ANSWERS.default;
      if (lowerText.includes('ramp')) response = MOCK_ANSWERS.ramp;
      else if (lowerText.includes('wheelchair') || lowerText.includes('assistant')) response = MOCK_ANSWERS.wheelchair;
      else if (lowerText.includes('restroom') || lowerText.includes('toilet')) response = MOCK_ANSWERS.restroom;
      else if (lowerText.includes('sensory') || lowerText.includes('quiet')) response = MOCK_ANSWERS.sensory;

      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'staff' }]);
      success();
      speak(`New message from coordinator: ${response}`);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 90, right: 16, left: 16, top: 100,
        background: '#fff', borderRadius: 'var(--r-xl)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1.5px solid var(--clr-border)',
        zIndex: 1001, display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--clr-primary)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', border: '2px solid #fff' }} />
          <div>
            <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)' }}>A11y Coordinator</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Online • Usually replies in 2m</div>
          </div>
        </div>
        <button onClick={() => { tap(); onClose(); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: '#F8FAFC' }}>
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%', padding: '10px 14px', borderRadius: '18px',
            background: m.sender === 'user' ? 'var(--clr-primary)' : '#fff',
            color: m.sender === 'user' ? '#fff' : 'var(--clr-text-primary)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: 'var(--fs-sm)',
            border: m.sender === 'user' ? 'none' : '1px solid var(--clr-border)',
            borderBottomRightRadius: m.sender === 'user' ? 4 : 18,
            borderBottomLeftRadius: m.sender === 'staff' ? 4 : 18,
          }}>
            {m.text}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '8px 12px', borderRadius: 18, border: '1px solid var(--clr-border)' }}>
            <Loader size={14} className="spin" color="var(--clr-text-muted)" />
          </div>
        )}
      </div>

      {/* Footer / Input */}
      <div style={{ padding: 16, background: '#fff', borderTop: '1px solid var(--clr-border)' }}>
        {messages.length < 3 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--r-full)', 
                  background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                  fontSize: 10, whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--clr-text-secondary)'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Type your question..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 'var(--r-full)',
              border: '1.5px solid var(--clr-border)', outline: 'none',
              fontSize: 'var(--fs-sm)'
            }}
          />
          <button
            onClick={() => handleSend(input)}
            style={{
              width: 44, height: 44, borderRadius: '50%', background: 'var(--clr-primary)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
