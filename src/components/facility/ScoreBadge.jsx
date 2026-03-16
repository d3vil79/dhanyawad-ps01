import { scoreColor, scoreLabel } from '../../utils/scoreCalculator';

export function ScoreBadge({ score, large = false }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);

  return (
    <div
      aria-label={`Accessibility score: ${score} out of 10, rated ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: large ? 6 : 4,
        padding: large ? '6px 14px' : '4px 10px',
        borderRadius: 'var(--r-full)',
        background: `${color}18`,
        border: `1.5px solid ${color}40`,
      }}
    >
      <span
        style={{
          width: large ? 10 : 8,
          height: large ? 10 : 8,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontWeight: 'var(--fw-bold)',
          fontSize: large ? 'var(--fs-lg)' : 'var(--fs-sm)',
          color,
          lineHeight: 1,
        }}
      >
        {score}
      </span>
      {large && (
        <span style={{ fontSize: 'var(--fs-sm)', color, fontWeight: 'var(--fw-medium)' }}>
          / 10 · {label}
        </span>
      )}
    </div>
  );
}
