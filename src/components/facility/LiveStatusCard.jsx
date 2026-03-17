import { motion } from 'framer-motion';
import { Clock, Users, Zap, AlertTriangle, Info } from 'lucide-react';

const SENSORY_CONFIG = {
  calm: { label: 'Calm Environment', color: '#10B981', bg: '#F0FDF4', icon: '🍃' },
  moderate: { label: 'Moderate Activity', color: '#F59E0B', bg: '#FFFBEB', icon: '⚖️' },
  crowded: { label: 'High Occupancy', color: '#EF4444', bg: '#FEF2F2', icon: '🔥' },
};

export function LiveStatusCard({ status }) {
  if (!status) return null;

  const sensory = SENSORY_CONFIG[status.sensoryLevel] || SENSORY_CONFIG.moderate;

  return (
    <div style={{
      background: 'var(--clr-bg-card)',
      borderRadius: 'var(--r-xl)',
      padding: 'var(--sp-4)',
      border: '1px solid var(--clr-border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--sp-4)' }}>
        <Zap size={16} color="var(--clr-primary)" fill="var(--clr-primary)" />
        <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Live Facility Status
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Wait Time */}
        <div style={{ padding: 12, borderRadius: 'var(--r-lg)', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Clock size={14} color="var(--clr-text-muted)" />
            <span style={{ fontSize: 10, fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-muted)', textTransform: 'uppercase' }}>A11y Wait</span>
          </div>
          <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)' }}>
            {status.waitTime}
          </div>
        </div>

        {/* Occupancy */}
        <div style={{ padding: 12, borderRadius: 'var(--r-lg)', background: sensory.bg, border: `1px solid ${sensory.color}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Users size={14} color={sensory.color} />
            <span style={{ fontSize: 10, fontWeight: 'var(--fw-bold)', color: sensory.color, textTransform: 'uppercase' }}>Occupancy</span>
          </div>
          <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-extrabold)', color: sensory.color }}>
            {status.occupancy}%
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: 12, padding: 10, borderRadius: 'var(--r-md)', 
        background: sensory.bg, display: 'flex', alignItems: 'center', gap: 8 
      }}>
        <span style={{ fontSize: 18 }}>{sensory.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 'var(--fw-bold)', color: sensory.color }}>{sensory.label}</div>
          <div style={{ fontSize: 10, color: 'var(--clr-text-muted)' }}>
            {status.sensoryLevel === 'calm' ? 'Perfect time for sensory-sensitive visits.' : 
             status.sensoryLevel === 'moderate' ? 'Expect typical activity levels.' : 
             'Busy environment. Sensory assistance available at help desk.'}
          </div>
        </div>
      </div>

      {status.alerts?.length > 0 && status.alerts.map((alert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            marginTop: 12, padding: '8px 12px', borderRadius: 'var(--r-md)',
            background: '#FFF1F2', border: '1px solid #FDA4AF',
            display: 'flex', alignItems: 'center', gap: 8, color: '#991B1B'
          }}
        >
          <AlertTriangle size={14} />
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)' }}>{alert.message}</span>
        </motion.div>
      ))}
    </div>
  );
}
