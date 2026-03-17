import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';

export function AccessibilityScorecard({ scores, isPredicted = false, confidence = 0 }) {
  if (!scores) return null;

  const categories = [
    { key: 'infrastructure', label: 'Infrastructure', icon: '🏗', color: '#3B82F6' },
    { key: 'services', label: 'Services', icon: '🏥', color: '#8B5CF6' },
    { key: 'staffTraining', label: 'Staff Training', icon: '👨‍⚕️', color: '#F59E0B' },
    { key: 'emergencyReadiness', label: 'Emergency Readiness', icon: '🚨', color: '#10B981' },
  ];

  return (
    <div style={{
      background: 'var(--clr-bg-card)',
      borderRadius: 'var(--r-xl)',
      padding: 'var(--sp-4)',
      border: isPredicted ? '1px dashed var(--clr-primary)' : '1px solid var(--clr-border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {isPredicted && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
          padding: '6px 12px', borderRadius: 'var(--r-md)',
          marginBottom: 'var(--sp-4)', border: '1px solid #DBEAFE'
        }}>
          <Sparkles size={14} color="var(--clr-primary)" />
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)' }}>
            Smart Prediction ({confidence}% Confidence)
          </span>
          <div style={{ marginLeft: 'auto', cursor: 'help' }} title="This score is estimated using AI based on facility type and metadata since community data is incomplete.">
            <Info size={12} color="var(--clr-text-muted)" />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {categories.map((cat, i) => {
          const score = scores[cat.key] || 0;
          return (
            <div key={cat.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-primary)' }}>
                  <span style={{ marginRight: 6 }}>{cat.icon}</span>
                  {cat.label}
                </span>
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: isPredicted ? 'var(--clr-text-muted)' : cat.color }}>
                  {score}% {isPredicted && <span style={{ fontSize: 10, fontWeight: 'normal', opacity: 0.7 }}>(Est.)</span>}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--clr-bg-secondary)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  style={{ 
                    height: '100%', 
                    background: isPredicted ? `repeating-linear-gradient(45deg, ${cat.color}, ${cat.color} 10px, ${cat.color}dd 10px, ${cat.color}dd 20px)` : cat.color,
                    borderRadius: 4 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
