import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Server, Database, Activity, Map,
  ArrowRight, Bell, LogOut, RefreshCw, FileSearch,
  Globe, Terminal, AlertTriangle, CheckCircle, X,
  Users, TrendingUp, Zap, ChevronRight
} from 'lucide-react';

const SYS_HEALTH = [
  { name: 'MongoDB Atlas',      ok: true,  ms: '12ms'  },
  { name: 'Overpass API',       ok: true,  ms: '230ms' },
  { name: 'OSRM Router',        ok: true,  ms: '44ms'  },
  { name: 'Nominatim Geocoder', ok: true,  ms: '180ms' },
  { name: 'WebSocket HMR',      ok: false, ms: '—'     },
];

const ADMIN_TOOLS = [
  { icon: RefreshCw,     title: 'Force Routing Cache Clear',  desc: 'Rebuilds OSRM navigation grid for all users.',           action: 'cache',  color: '#fbbf24' },
  { icon: FileSearch,    title: 'Review Audit Logs',          desc: 'Investigate accessibility score manipulation reports.',   action: 'audit',  color: '#fbbf24' },
  { icon: Globe,         title: 'Update Nominatim Sync',      desc: 'Trigger an OpenStreetMap POI re-index.',                 action: 'nominat',color: '#fbbf24' },
  { icon: Terminal,      title: 'Run System Diagnostics',     desc: 'Check DB health, API uptime, cache consistency.',        action: 'diag',   color: '#fbbf24' },
  { icon: AlertTriangle, title: 'Override Facility Alert',    desc: 'Broadcast emergency accessibility closure globally.',    action: 'alert',  color: '#ef4444' },
];

const AUDIT_LOGS = [
  { time: '06:01 AM', event: 'Login', user: 'admin@demo.com',    status: 'success' },
  { time: '05:47 AM', event: 'Score override', user: 'hosp_2',   status: 'warning' },
  { time: '05:31 AM', event: 'Cache clear',   user: 'system',     status: 'success' },
  { time: '04:59 AM', event: 'New user reg',  user: 'patient@x',  status: 'success' },
  { time: '04:12 AM', event: 'API rate limit exceeded', user: 'crawler_bot', status: 'error' },
];

function Toast({ msg, type = 'success', onClose }) {
  const bg = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#0f172a';
  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
      style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: bg, color: '#fff', padding: '12px 20px', borderRadius: 16, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: '85vw' }}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16} /></button>
    </motion.div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 5000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ background: '#1e293b', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, maxHeight: '80vh', overflow: 'auto', padding: '24px 20px 40px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#f8fafc' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} color="#94a3b8" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [running, setRunning] = useState(null);
  const [health, setHealth] = useState(SYS_HEALTH);
  const [metrics, setMetrics] = useState({ users: '1.4M', nodes: '842k', latency: '45ms' });

  const notify = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const runTool = (tool, idx) => {
    setRunning(idx);
    setTimeout(() => {
      setRunning(null);
      if (tool.action === 'cache') {
        notify('✅ Routing cache cleared. Grid rebuilt for all users.');
      } else if (tool.action === 'audit') {
        setModal({ type: 'audit' });
      } else if (tool.action === 'nominat') {
        notify('🔄 Nominatim re-index triggered. ETA ~2 min.', 'success');
      } else if (tool.action === 'diag') {
        setModal({ type: 'diag' });
      } else if (tool.action === 'alert') {
        setModal({ type: 'alert' });
      }
    }, 1500);
  };

  const fixService = (idx) => {
    setHealth(prev => prev.map((s, i) => i === idx ? { ...s, ok: true, ms: '82ms' } : s));
    notify(`✅ ${health[idx].name} service restored`);
  };

  const refreshMetrics = () => {
    setMetrics({ users: '1.41M', nodes: '843k', latency: '42ms' });
    notify('📊 Metrics refreshed');
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', paddingBottom: 80, color: '#f8fafc' }}>
      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      <AnimatePresence>
        {modal?.type === 'audit' && (
          <Modal title="Audit Logs" onClose={() => setModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {AUDIT_LOGS.map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < AUDIT_LOGS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{log.event}</p>
                    <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{log.user} · {log.time}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: log.status === 'error' ? 'rgba(239,68,68,0.15)' : log.status === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: log.status === 'error' ? '#ef4444' : log.status === 'warning' ? '#f59e0b' : '#22c55e' }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setModal(null); notify('📧 Audit report emailed to admin'); }}
              style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 14, background: '#fbbf24', color: '#0f172a', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Export Report
            </motion.button>
          </Modal>
        )}
        {modal?.type === 'diag' && (
          <Modal title="System Diagnostics" onClose={() => setModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {health.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.ok ? '#22c55e' : '#ef4444', boxShadow: `0 0 8px ${s.ok ? '#22c55e' : '#ef4444'}` }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{s.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{s.ms}</p>
                    </div>
                  </div>
                  {!s.ok ? (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => fixService(i)}
                      style={{ padding: '6px 12px', borderRadius: 10, background: '#ef444420', color: '#ef4444', fontWeight: 700, fontSize: 12, border: '1px solid #ef444440', cursor: 'pointer' }}>
                      Fix Now
                    </motion.button>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', padding: '4px 10px', borderRadius: 10, background: 'rgba(34,197,94,0.1)' }}>OK</span>
                  )}
                </div>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setHealth(SYS_HEALTH.map(s => ({ ...s, ok: true }))); notify('✅ All services restored'); setModal(null); }}
              style={{ width: '100%', marginTop: 16, padding: 14, borderRadius: 14, background: '#22c55e', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Fix All Issues
            </motion.button>
          </Modal>
        )}
        {modal?.type === 'alert' && (
          <Modal title="⚠ Broadcast Emergency Alert" onClose={() => setModal(null)}>
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: 12, borderRadius: 12, marginBottom: 16, fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>
              This will broadcast a global accessibility closure alert to ALL active users and routing engines.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Facility Name', 'e.g. City Medical Center'], ['Closure Reason', 'e.g. Emergency evacuation — North Wing'], ['Est. Duration', 'e.g. 2-4 hours']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#f8fafc', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setModal(null); notify('🚨 Emergency alert broadcast to all users', 'error'); }}
                style={{ width: '100%', padding: 14, borderRadius: 14, background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 6 }}>
                🚨 Broadcast Now
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', padding: '28px 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(251,191,36,0.04)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Shield size={13} color="#fbbf24" />
              <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>System Admin</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{user?.name || 'Admin'}</h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Platform operational control center</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => notify('🔔 System alerts: 1 service down', 'warning')}
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#fbbf24" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { logout(); navigate('/auth/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <LogOut size={15} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Live Metrics</h2>
          <motion.button whileTap={{ scale: 0.95 }} onClick={refreshMetrics}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            <RefreshCw size={12} /> Refresh
          </motion.button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { icon: Users,    value: metrics.users, label: 'Active Users',  trend: '+12k', color: '#3b82f6', bg: '#dbeafe' },
            { icon: Database, value: metrics.nodes, label: 'OSRM Nodes',    trend: '+1.2%',color: '#8b5cf6', bg: '#ede9fe' },
            { icon: Activity, value: metrics.latency,label:'API Latency',   trend: '▼ 3ms',color: '#10b981', bg: '#d1fae5' },
            { icon: Map,      value: 'Live',        label: 'Map Sync',      trend: '0ms',   color: '#f59e0b', bg: '#fef3c7' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#1e293b', borderRadius: 20, padding: 18, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: m.bg + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${m.bg}30` }}>
                  <m.icon size={20} color={m.color} />
                </div>
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, fontFamily: 'monospace', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: 8 }}>{m.trend}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc', lineHeight: 1, letterSpacing: '-0.04em' }}>{m.value}</p>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>System Health</h2>
        <div style={{ background: '#1e293b', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {health.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: i < health.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.ok ? '#22c55e' : '#ef4444', boxShadow: `0 0 8px ${s.ok ? '#22c55e' : '#ef4444'}` }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{s.ms}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: s.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.ok ? '#22c55e' : '#ef4444' }}>{s.ok ? 'OK' : 'Down'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Tools */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Admin Tools</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ADMIN_TOOLS.map((tool, i) => (
            <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              onClick={() => runTool(tool, i)}
              style={{ width: '100%', textAlign: 'left', background: tool.action === 'alert' ? 'rgba(239,68,68,0.06)' : '#1e293b', border: `1px solid ${tool.action === 'alert' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 18, padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tool.action === 'alert' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.1)' }}>
                  {running === i
                    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><RefreshCw size={18} color={tool.action === 'alert' ? '#ef4444' : '#fbbf24'} /></motion.div>
                    : <tool.icon size={18} color={tool.color} />
                  }
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: tool.action === 'alert' ? '#fca5a5' : '#e2e8f0', marginBottom: 2 }}>{tool.title}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{tool.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} color="#334155" style={{ flexShrink: 0 }} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
