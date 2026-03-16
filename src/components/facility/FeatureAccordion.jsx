import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function FeatureAccordion({ title, items = [], defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const available = items.filter(i => i.available).length;

  return (
    <div
      style={{
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          background: 'var(--clr-bg-card)',
          border: 'none',
          cursor: 'pointer',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-primary)', textAlign: 'left' }}>
            {title}
          </span>
          <span style={{
            fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-medium)',
            background: 'var(--clr-primary-light)',
            color: 'var(--clr-primary)',
            padding: '2px 8px',
            borderRadius: 'var(--r-full)',
          }}>
            {available}/{items.length}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} color="var(--clr-text-muted)" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: '8px 16px 14px',
              borderTop: '1px solid var(--clr-border)',
              background: 'var(--clr-bg-secondary)',
            }}>
              {items.map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: i < items.length - 1 ? '1px solid var(--clr-border)' : 'none',
                }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: item.available ? 'var(--clr-secondary-light)' : '#FEE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  >
                    {item.available ? '✓' : '✕'}
                  </span>
                  <span style={{
                    fontSize: 'var(--fs-sm)',
                    color: item.available ? 'var(--clr-text-secondary)' : 'var(--clr-text-muted)',
                    textDecoration: item.available ? 'none' : 'none',
                  }}>
                    {item.name}
                  </span>
                  <span className="sr-only">{item.available ? 'Available' : 'Not available'}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
