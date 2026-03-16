import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export function AlertBanner({ alert }) {
  if (!alert) return null;

  const isRed = alert.type === 'red';
  const bg = isRed ? 'var(--clr-alert-red)' : 'var(--clr-alert-amber)';
  const bgLight = isRed ? '#FEF2F2' : '#FFFBEB';
  const textColor = isRed ? 'var(--clr-alert-red)' : 'var(--clr-alert-amber)';
  const Icon = isRed ? AlertCircle : AlertTriangle;

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live="assertive"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          background: bgLight,
          borderLeft: `4px solid ${bg}`,
          borderRadius: 'var(--r-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <Icon size={18} color={textColor} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
        <div>
          <p style={{ fontWeight: 'var(--fw-bold)', color: textColor, fontSize: 'var(--fs-sm)', marginBottom: 2 }}>
            {isRed ? 'EMERGENCY ALERT' : 'LIVE NOTICE'}
          </p>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
            {alert.message}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
