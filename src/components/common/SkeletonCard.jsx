export function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 'var(--r-xl)',
        background: 'var(--clr-bg-card)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        border: '1px solid var(--clr-border)',
      }}
    >
      {/* Image placeholder */}
      <div className="skeleton" style={{ height: 180, borderRadius: 0 }} />
      <div style={{ padding: 'var(--sp-4)' }}>
        <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '45%', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 28, width: 80 }} />
          <div className="skeleton" style={{ height: 28, width: 60 }} />
        </div>
      </div>
    </div>
  );
}
