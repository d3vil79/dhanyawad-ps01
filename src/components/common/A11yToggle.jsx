import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

export function A11yToggle({ label, description, checked, onChange, id }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--sp-4)',
        background: 'var(--clr-bg-card)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--clr-border)',
        gap: 'var(--sp-4)',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-primary)', marginBottom: 2 }}>{label}</p>
        {description && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        style={{
          position: 'relative',
          width: 52,
          height: 28,
          borderRadius: 'var(--r-full)',
          border: 'none',
          background: checked ? 'var(--clr-primary)' : 'var(--clr-border)',
          cursor: 'pointer',
          transition: 'background var(--transition-base)',
          flexShrink: 0,
        }}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 27 : 3,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
