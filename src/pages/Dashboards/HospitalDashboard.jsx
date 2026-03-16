import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, AlertTriangle, Activity, Bell, LogOut,
  CheckCircle, ChevronRight, Wifi, TrendingUp, Shield, ClipboardList
} from 'lucide-react';

const ALERTS = [
  { id: 1, type: 'red',   title: 'North Wing Ramp Closed',     body: 'Construction crews active. Patients redirected to South entrance. Update navigation ping.',   time: '3 min ago'  },
  { id: 2, type: 'amber', title: 'Patient Arrival Ping',       body: 'Patient with Severe Visual Impairment routing here. ETA 14 min. Confirm braille signage clear.',  time: '11 min ago' },
  { id: 3, type: 'blue',  title: 'ASL Interpreter Requested',  body: 'Appointment at 10:30 AM requires ASL interpreter. Staff member Clara has been notified.',       time: '22 min ago' },
];

const STATS = [
  { icon: Users,       value: '142', label: "Today's Patients",  color: '#3b82f6', bg: '#dbeafe' },
  { icon: Activity,    value: '9.2', label: 'A11y Score',         color: '#10b981', bg: '#d1fae5' },
  { icon: AlertTriangle,value: '2',  label: 'Active Alerts',     color: '#f59e0b', bg: '#fef3c7' },
  { icon: TrendingUp,  value: '+8%', label: 'Week Change',        color: '#8b5cf6', bg: '#ede9fe' },
];

const FACILITY_STATUS = [
  { name: 'Wheelchair Ramps',    status: 'Warning', ok: false },
  { name: 'ASL Interpreter',     status: 'On Duty',  ok: true  },
  { name: 'Hearing Loop System', status: 'Active',   ok: true  },
  { name: 'Braille Signage',     status: 'Verified', ok: true  },
  { name: 'Elevator A',          status: 'Operational', ok: true  },
  { name: 'Elevator B (East)',    status: 'Maintenance', ok: false },
];

const alertColors = {
  red:   { border: '#ef4444', bg: '#fef2f2', icon: '#ef4444', dot: '#ef4444' },
  amber: { border: '#f59e0b', bg: '#fffbeb', icon: '#f59e0b', dot: '#f59e0b' },
  blue:  { border: '#3b82f6', bg: '#eff6ff', icon: '#3b82f6', dot: '#3b82f6' },
};

export default function HospitalDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState([]);

  const activeAlerts = ALERTS.filter(a => !dismissed.includes(a.id));

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f7fb', paddingBottom: 80 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)',
        padding: '28px 20px 52px',
        borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
        boxShadow: '0 12px 40px -8px rgba(79,70,229,0.5)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Building2 size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>Facility Administrator</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{user?.name || 'Hospital'}</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 }}>Accessibility management portal</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button whileTap={{ scale: 0.9 }}
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color="#fff" />
              {activeAlerts.length > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #7c3aed' }} />
              )}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => { logout(); navigate('/auth/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <LogOut size={15} color="#fff" /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '0 16px', marginTop: -32, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: 20, padding: '14px 12px', textAlign: 'center', boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        {/* ── Facility Status ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Facility Status</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wifi size={12} color="#10b981" />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>Live</span>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {FACILITY_STATUS.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: i < FACILITY_STATUS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.ok ? '#10b981' : '#ef4444', flexShrink: 0, boxShadow: `0 0 6px ${item.ok ? '#10b981' : '#ef4444'}` }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: item.ok ? '#d1fae5' : '#fed7aa', color: item.ok ? '#065f46' : '#9a3412' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Alerts ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Active Alerts
              {activeAlerts.length > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>{activeAlerts.length}</span>}
            </h2>
          </div>
          <AnimatePresence>
            {activeAlerts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: '#fff', borderRadius: 20, padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 700, color: '#0f172a' }}>All clear!</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>No active alerts at this time.</p>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeAlerts.map((alert, i) => {
                  const c = alertColors[alert.type];
                  return (
                    <motion.div key={alert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ background: c.bg, borderRadius: 18, padding: '16px', border: `1.5px solid ${c.border}30`, boxShadow: `0 4px 20px -6px ${c.border}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{alert.title}</p>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{alert.time}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>{alert.body}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <motion.button whileTap={{ scale: 0.97 }}
                          style={{ flex: 1, padding: '8px', borderRadius: 10, background: c.border, color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>
                          Respond
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }}
                          onClick={() => setDismissed(d => [...d, alert.id])}
                          style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(0,0,0,0.06)', color: '#64748b', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>
                          Dismiss
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
