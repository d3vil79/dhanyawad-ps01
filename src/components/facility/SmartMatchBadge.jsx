import { computeMatchScore, matchLabel } from '../../utils/profileMatcher';

/**
 * SmartMatchBadge
 *
 * Shows a colour-coded profile-match percentage on a facility card.
 * Only rendered when the user has ≥1 need selected.
 */
export function SmartMatchBadge({ facility, userNeeds, large = false }) {
  if (!userNeeds || userNeeds.length === 0) return null;

  const score = computeMatchScore(facility, userNeeds);
  const { label, color, bg } = matchLabel(score);

  return (
    <div
      aria-label={`Profile match: ${score}%. ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: large ? 6 : 4,
        padding: large ? '5px 12px' : '3px 9px',
        borderRadius: 'var(--r-full)',
        background: bg,
        border: `1.5px solid ${color}40`,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: large ? 14 : 12 }}>🎯</span>
      <span
        style={{
          fontWeight: 'var(--fw-bold)',
          fontSize: large ? 'var(--fs-sm)' : 'var(--fs-xs)',
          color,
          whiteSpace: 'nowrap',
        }}
      >
        {score}% {large ? label : 'Match'}
      </span>
    </div>
  );
}
