import { motion } from 'framer-motion';

export function PillTag({ label, icon, active, onClick, color }) {
  const bg = active
    ? (color || 'var(--clr-primary)')
    : 'var(--clr-surface)';
  const text = active ? '#fff' : 'var(--clr-text-secondary)';

  return (
    <motion.button
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 'var(--r-full)',
        border: `2px solid ${active ? (color || 'var(--clr-primary)') : 'transparent'}`,
        background: bg,
        color: text,
        fontWeight: 'var(--fw-medium)',
        fontSize: 'var(--fs-sm)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all var(--transition-base)',
      }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </motion.button>
  );
}
