import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Server, Database, Activity, Users, Map,
  ArrowRight, Bell, LogOut, TrendingUp, AlertTriangle,
  RefreshCw, FileSearch, Globe, Terminal, ChevronRight
} from 'lucide-react';

const METRICS = [
  { icon: Users,     value: '1.4M', label: 'Active Users',  trend: '+12k today', color: '#3b82f6', bg: '#dbeafe' },
  { icon: Database,  value: '842k', label: 'OSRM Nodes',    trend: '+1.2%',      color: '#8b5cf6', bg: '#ede9fe' },
  { icon: Activity,  value: '45ms', label: 'API Latency',   trend: '▼ 5ms',      color: '#10b981', bg: '#d1fae5' },
  { icon: Map,       value: 'Live', label: 'Map Sync',      trend: '0ms delay',  color: '#f59e0b', bg: '#fef3c7' },
];

const TOOLS = [
  { icon: RefreshCw,  title: 'Force Routing Cache Clear',   desc: 'Rebuilds local OSRM navigation grid for all users.',      danger: false },
  { icon: FileSearch, title: 'Review Audit Logs',           desc: 'Investigate accessibility score manipulation reports.',    danger: false },
  { icon: Globe,      title: 'Update Nominatim Sync',       desc: 'Manually trigger an OpenStreetMap POI re-index.',         danger: false },
  { icon: Terminal,   title: 'Run System Diagnostics',      desc: 'Check DB health, API uptime, and cache consistency.',     danger: false },
  { icon: AlertTriangle, title: 'Override Facility Alert',  desc: 'Broadcast an emergency accessibility closure globally.',  danger: true  },
];

const SYSTEM_HEALTH = [
  { name: 'MongoDB Atlas',      ok: true,  ms: '12ms'  },
  { name: 'Overpass API',       ok: true,  ms: '230ms' },
  { name: 'OSRM Router',        ok: true,  ms: '44ms'  },
  { name: 'Nominatim Geocoder', ok: true,  ms: '180ms' },
  { name: 'WebSocket HMR',      ok: false, ms: '—'     },
];

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState(null);
  const [running, setRunning] = useState(null);

  const runTool = (idx) => {
    setRunning(idx);
    setTimeout(() => setRunning(null), 2000);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#0f172a', paddingBottom: 80, color: '#f8fafc' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '28px 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
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
            <motion.button whileTap={{ scale: 0.9 }}
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#fbbf24" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => { logout(); navigate('/auth/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <LogOut size={15} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Live Platform Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {METRICS.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: '#1e293b', borderRadius: 20, padding: '18px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px -8px rgba(0,0,0,0.4)' }}>
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

      {/* ── System Health ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>System Health</h2>
        <div style={{ background: '#1e293b', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {SYSTEM_HEALTH.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: i < SYSTEM_HEALTH.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.ok ? '#22c55e' : '#ef4444', boxShadow: `0 0 8px ${s.ok ? '#22c55e' : '#ef4444'}` }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{s.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{s.ms}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: s.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.ok ? '#22c55e' : '#ef4444' }}>
                  {s.ok ? 'OK' : 'Down'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Admin Tools ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Admin Tools</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOOLS.map((tool, i) => (
            <motion.button key={i}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              onClick={() => runTool(i)}
              style={{
                width: '100%', textAlign: 'left', background: tool.danger ? 'rgba(239,68,68,0.06)' : '#1e293b',
                border: `1px solid ${tool.danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 18, padding: '14px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tool.danger ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.1)' }}>
                  {running === i
                    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><RefreshCw size={18} color={tool.danger ? '#ef4444' : '#fbbf24'} /></motion.div>
                    : <tool.icon size={18} color={tool.danger ? '#ef4444' : '#fbbf24'} />
                  }
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: tool.danger ? '#fca5a5' : '#e2e8f0', marginBottom: 2 }}>{tool.title}</p>
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
