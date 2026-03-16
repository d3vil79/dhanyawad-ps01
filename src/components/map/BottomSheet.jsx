import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';
import { ScoreBadge } from '../facility/ScoreBadge';
import { formatDistance } from '../../utils/formatters';

export function BottomSheet({ facility, onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {facility && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 90,
            }}
          />
          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Preview of ${facility.name}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'fixed',
              bottom: 80,
              left: 0,
              right: 0,
              zIndex: 100,
              background: 'var(--clr-bg-card)',
              borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
              boxShadow: 'var(--shadow-xl)',
              padding: 'var(--sp-6)',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: 'var(--clr-border)',
              margin: '0 auto var(--sp-4)',
            }} aria-hidden="true" />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close preview"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--clr-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              <X size={16} color="var(--clr-text-muted)" />
            </button>

            <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start' }}>
              <img
                src={facility.images[0]}
                alt={facility.name}
                style={{ width: 80, height: 80, borderRadius: 'var(--r-lg)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>{facility.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MapPin size={12} color="var(--clr-text-muted)" />
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>
                    {formatDistance(facility.distance)}
                  </span>
                </div>
                <ScoreBadge score={facility.score} />
              </div>
            </div>

            <button
              onClick={() => navigate(`/facility/${facility.id}`)}
              style={{
                marginTop: 'var(--sp-4)',
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--r-lg)',
                background: 'var(--clr-primary)',
                color: '#fff',
                fontWeight: 'var(--fw-semibold)',
                fontSize: 'var(--fs-base)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              View Full Details →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
