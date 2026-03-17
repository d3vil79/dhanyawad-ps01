import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { ScoreBadge } from './ScoreBadge';
import { SmartMatchBadge } from './SmartMatchBadge';
import { formatDistance } from '../../utils/formatters';
import { MapPin, Clock } from 'lucide-react';
import { useUserStore } from '../../contexts/useUserStore';

export function FacilityCard({ facility, index = 0 }) {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const userNeeds = profile?.needs ?? [];

  return (
    <motion.article
      role="article"
      aria-label={`${facility.name}, score ${facility.score}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24, delay: index * 0.07 }}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
      onClick={() => navigate(`/facility/${facility.id}`)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
      }}
      className="spotlight-wrapper"
      style={{
        background: 'var(--clr-bg-card)',
        border: '1px solid var(--clr-border)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'box-shadow var(--transition-base)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'var(--clr-surface)', zIndex: 1 }}>
        <img
          src={facility.images[0]}
          alt={`${facility.name} entrance`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute', top: 12, right: 12,
        }}>
          <ScoreBadge score={facility.score} />
        </div>
        {facility.alert && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: facility.alert.type === 'red' ? 'var(--clr-alert-red)' : 'var(--clr-alert-amber)',
            color: '#fff',
            fontSize: 'var(--fs-xs)',
            fontWeight: 'var(--fw-semibold)',
            padding: '4px 12px',
          }}>
            ⚠ {facility.alert.message.slice(0, 60)}…
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: 'var(--sp-4)' }}>
        <h3 style={{
          fontSize: 'var(--fs-base)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--clr-text-primary)',
          marginBottom: 4,
          lineHeight: 'var(--lh-tight)',
        }}>
          {facility.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <MapPin size={13} color="var(--clr-text-muted)" />
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>
            {formatDistance(facility.distance)}
          </span>
          <span style={{ color: 'var(--clr-border)' }}>·</span>
          <Clock size={13} color="var(--clr-text-muted)" />
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>
            {facility.hours}
          </span>
        </div>

        {/* Smart Match Badge */}
        {userNeeds.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <SmartMatchBadge facility={facility} userNeeds={userNeeds} />
          </div>
        )}

        {/* Category tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {facility.categories.map(cat => (
            <span
              key={cat}
              style={{
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-medium)',
                padding: '3px 10px',
                borderRadius: 'var(--r-full)',
                background: 'var(--clr-primary-light)',
                color: 'var(--clr-primary-dark)',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          ))}
          {facility.verified && (
            <span style={{
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-medium)',
              padding: '3px 10px',
              borderRadius: 'var(--r-full)',
              background: 'var(--clr-secondary-light)',
              color: 'var(--clr-secondary-dark)',
            }}>
              ✓ Verified
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
