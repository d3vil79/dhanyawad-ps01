import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';

export function LiveUpdateModal({ isOpen, onClose, onSubmit }) {
  const { tap } = useHaptics();
  const [type, setType] = useState('amber'); // amber, red, green
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    tap();
    const alert = {
      type,
      message,
      updatedAt: new Date().toISOString(),
    };
    onSubmit(alert);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { tap(); onClose(); }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        />
        
        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          style={{
            position: 'relative', background: 'var(--clr-bg)', borderRadius: 'var(--r-xl)',
            width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>Push Live Update</h2>
            <button onClick={() => { tap(); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}>
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', marginBottom: 20 }}>
              As a facility admin, you can push real-time alerts about elevator maintenance, ramp closures, etc.
            </p>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 8 }}>Alert Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button type="button" onClick={() => { tap(); setType('amber'); }} style={{ padding: '10px 4px', borderRadius: 'var(--r-md)', border: `1.5px solid ${type === 'amber' ? '#D97706' : 'var(--clr-border)'}`, background: type === 'amber' ? '#FEF3C7' : 'transparent', color: type === 'amber' ? '#D97706' : 'var(--clr-text-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 'var(--fw-medium)' }}>
                  <AlertCircle size={18} /> Warning
                </button>
                <button type="button" onClick={() => { tap(); setType('red'); }} style={{ padding: '10px 4px', borderRadius: 'var(--r-md)', border: `1.5px solid ${type === 'red' ? '#DC2626' : 'var(--clr-border)'}`, background: type === 'red' ? '#FEF2F2' : 'transparent', color: type === 'red' ? '#DC2626' : 'var(--clr-text-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 'var(--fw-medium)' }}>
                  <X size={18} /> Critical
                </button>
                <button type="button" onClick={() => { tap(); setType('green'); }} style={{ padding: '10px 4px', borderRadius: 'var(--r-md)', border: `1.5px solid ${type === 'green' ? '#059669' : 'var(--clr-border)'}`, background: type === 'green' ? '#ECFDF5' : 'transparent', color: type === 'green' ? '#059669' : 'var(--clr-text-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 'var(--fw-medium)' }}>
                  <CheckCircle size={18} /> Resolved
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 8 }}>Update Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. West wing elevator is currently out of service. Please use East wing."
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--clr-border)', background: 'var(--clr-surface)', fontFamily: 'inherit', fontSize: 'var(--fs-sm)', resize: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--r-lg)',
                background: 'var(--clr-primary)', color: '#fff',
                fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-base)', border: 'none',
                cursor: message.trim() ? 'pointer' : 'not-allowed', opacity: message.trim() ? 1 : 0.6,
              }}
            >
              Broadcast Live Update
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
