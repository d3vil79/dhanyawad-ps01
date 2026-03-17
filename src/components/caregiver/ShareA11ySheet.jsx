import { motion } from 'framer-motion';
import { Share2, X, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function ShareA11ySheet({ facility, onClose }) {
  const [copied, setCopied] = useState(false);

  const generateSummary = () => {
    const lines = [
      `📍 Accessibility Cheat Sheet: ${facility.name}`,
      `Address: ${facility.address || 'In app'}`,
      `---`,
    ];

    if (facility.scorecard) {
      lines.push(`🏗️ Infrastructure: ${facility.scorecard.infrastructure}%`);
      lines.push(`🏥 Services: ${facility.scorecard.services}%`);
    }

    if (facility.features?.length > 0) {
      lines.push(`✅ Key Features: ${facility.features.join(', ')}`);
    }

    if (facility.liveStatus?.waitTime) {
      lines.push(`⏳ Current Wait: ${facility.liveStatus.waitTime}m`);
    }

    lines.push(`---`);
    lines.push(`Sent via Dhanyawad App - Barrier-Free Healthcare`);

    return lines.join('\n');
  };

  const shareText = generateSummary();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A11y Summary: ${facility.name}`,
          text: shareText,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 3000,
        background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '24px 20px 40px', boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        maxHeight: '80vh', overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>
          Accessibility Cheat Sheet
        </h2>
        <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer' }}>
          <X size={20} color="#6B7280" />
        </button>
      </div>

      <div style={{ background: '#F9FAFB', border: '1.5px dashed #D1D5DB', borderRadius: 16, padding: 16, marginBottom: 24, whiteSpace: 'pre-wrap', fontSize: 13, color: '#374151', fontFamily: 'monospace' }}>
        {shareText}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCopy}
          style={{ flex: 1, height: 50, borderRadius: 14, background: '#fff', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 'var(--fw-bold)', fontSize: 14, cursor: 'pointer' }}
        >
          {copied ? <CheckCircle2 size={18} color="#10B981" /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy Text'}
        </button>
        <button
          onClick={handleShare}
          style={{ flex: 2, height: 50, borderRadius: 14, background: 'var(--clr-primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 'var(--fw-bold)', fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
        >
          <Share2 size={18} />
          {navigator.share ? 'Share Summary' : 'Copy & Share'}
          <ChevronRight size={16} style={{ marginLeft: 4 }} />
        </button>
      </div>

      <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#6B7280' }}>
        Perfect for sending via WhatsApp or SMS to companions.
      </p>
    </motion.div>
  );
}
