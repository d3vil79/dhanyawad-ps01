import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, AlertTriangle, Activity, Bell, LogOut,
  CheckCircle, Wifi, TrendingUp, X, Plus, Edit3, Send, MapPin, Save
} from 'lucide-react';

const INIT_ALERTS = [
  { id: 1, type: 'red',   title: 'North Wing Ramp Closed',      body: 'Construction active. Patients redirected to South entrance.',          time: '3 min ago'  },
  { id: 2, type: 'amber', title: 'Patient Arrival Ping',         body: 'Patient with Severe Visual Impairment routing here. ETA 14 min.',       time: '11 min ago' },
  { id: 3, type: 'blue',  title: 'ASL Interpreter Requested',    body: 'Appointment at 10:30 AM requires ASL interpreter.',                     time: '22 min ago' },
];

const INIT_STATUS = [
  { name: 'Wheelchair Ramps',    ok: false, note: 'North wing closed' },
  { name: 'ASL Interpreter',     ok: true,  note: 'On duty' },
  { name: 'Hearing Loop System', ok: true,  note: 'Active' },
  { name: 'Braille Signage',     ok: true,  note: 'Verified' },
  { name: 'Elevator A',          ok: true,  note: 'Operational' },
  { name: 'Elevator B (East)',   ok: false, note: 'Maintenance' },
];

const COLORS = { red: { border: '#ef4444', bg: '#fef2f2', dot: '#ef4444' }, amber: { border: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b' }, blue: { border: '#3b82f6', bg: '#eff6ff', dot: '#3b82f6' } };

function Toast({ msg, onClose }) {
  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
      style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: '#0f172a', color: '#fff', padding: '12px 20px', borderRadius: 16, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10, maxWidth: '85vw' }}>
      <span>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={16} /></button>
    </motion.div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, maxHeight: '80vh', overflow: 'auto', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function HospitalDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [status, setStatus] = useState(INIT_STATUS);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [responseText, setResponseText] = useState('');

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const dismissAlert = (id) => setAlerts(a => a.filter(x => x.id !== id));

  const respondAlert = (alert) => {
    setModal({ type: 'respond', alert });
    setResponseText('');
  };

  const sendResponse = () => {
    dismissAlert(modal.alert.id);
    setModal(null);
    notify(`✅ Response sent for: ${modal.alert.title}`);
  };

  const toggleStatus = (idx) => {
    setStatus(prev => prev.map((s, i) => i === idx ? { ...s, ok: !s.ok, note: s.ok ? 'Under repair' : 'Restored' } : s));
    const item = status[idx];
    notify(`${item.ok ? '🔴' : '🟢'} ${item.name} marked as ${item.ok ? 'offline' : 'online'}`);
  };

  const addAlert = (newAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
    setModal(null);
    notify('✅ Alert broadcast to all routing users');
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f7fb', paddingBottom: 80 }}>
      <AnimatePresence>{toast && <Toast msg={toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <AnimatePresence>
        {modal?.type === 'respond' && (
          <Modal title={`Respond: ${modal.alert.title}`} onClose={() => setModal(null)}>
            <div style={{ background: COLORS[modal.alert.type]?.bg, border: `1.5px solid ${COLORS[modal.alert.type]?.border}30`, padding: 14, borderRadius: 12, marginBottom: 16, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
              {modal.alert.body}
            </div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Your Response</label>
            <textarea value={responseText} onChange={e => setResponseText(e.target.value)}
              placeholder="Describe your action taken or current status update…"
              style={{ width: '100%', minHeight: 90, padding: 12, borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={sendResponse}
                style={{ flex: 2, padding: 14, borderRadius: 14, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Send size={16} /> Send Response
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { dismissAlert(modal.alert.id); setModal(null); notify('Alert dismissed'); }}
                style={{ flex: 1, padding: 14, borderRadius: 14, background: '#f1f5f9', color: '#64748b', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                Dismiss
              </motion.button>
            </div>
          </Modal>
        )}
        {modal?.type === 'newAlert' && (
          <Modal title="Broadcast New Alert" onClose={() => setModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Alert Title', 'e.g. Elevator Outage'], ['Message', 'e.g. Elevator A is temporarily out of service'], ['Affected Area', 'e.g. North Wing, Floor 3']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input placeholder={ph} id={`new-alert-${label}`} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => addAlert({ id: Date.now(), type: 'red', title: document.getElementById('new-alert-Alert Title')?.value || 'New Alert', body: document.getElementById('new-alert-Message')?.value || 'Alert details.', time: 'Just now' })}
                style={{ width: '100%', padding: 14, borderRadius: 14, background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                📢 Broadcast Alert
              </motion.button>
            </div>
          </Modal>
        )}
        {modal?.type === 'editStatus' && (
          <Modal title={`Update: ${modal.item.name}`} onClose={() => setModal(null)}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: modal.item.ok ? '#d1fae5' : '#fee2e2', padding: 14, borderRadius: 12, textAlign: 'center' }}>
                <p style={{ fontWeight: 800, color: modal.item.ok ? '#065f46' : '#991b1b', fontSize: 16 }}>{modal.item.ok ? '🟢 Online' : '🔴 Offline'}</p>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{modal.item.note}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => { toggleStatus(modal.idx); setModal(null); }}
                style={{ flex: 1, padding: 14, borderRadius: 14, background: modal.item.ok ? '#ef4444' : '#10b981', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                Mark as {modal.item.ok ? 'Offline' : 'Online'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { notify(`🛠 Maintenance ticket created for ${modal.item.name}`); setModal(null); }}
                style={{ flex: 1, padding: 14, borderRadius: 14, background: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                File Repair Ticket
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)', padding: '28px 20px 52px', borderBottomLeftRadius: 36, borderBottomRightRadius: 36, boxShadow: '0 12px 40px -8px rgba(79,70,229,0.5)', position: 'relative', overflow: 'hidden' }}>
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
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => notify(`🔔 ${alerts.length} active alert${alerts.length !== 1 ? 's' : ''}`)}
              style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#fff" />
              {alerts.length > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #7c3aed' }} />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { logout(); navigate('/auth/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              <LogOut size={15} color="#fff" /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '0 16px', marginTop: -32, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: Users,         value: '142', label: "Today's Patients", color: '#3b82f6', bg: '#dbeafe' },
            { icon: Activity,      value: '9.2', label: 'A11y Score',        color: '#10b981', bg: '#d1fae5' },
            { icon: AlertTriangle, value: alerts.length, label: 'Active Alerts',  color: '#f59e0b', bg: '#fef3c7' },
            { icon: TrendingUp,    value: '+8%', label: 'Week Change',      color: '#8b5cf6', bg: '#ede9fe' },
          ].map((s, i) => (
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
        {/* Facility Status */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Facility Status</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wifi size={12} color="#10b981" />
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>Live</span>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {status.map((item, i) => (
              <div key={i} onClick={() => setModal({ type: 'editStatus', item, idx: i })}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 18px', borderBottom: i < status.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.ok ? '#10b981' : '#ef4444', flexShrink: 0, boxShadow: `0 0 6px ${item.ok ? '#10b981' : '#ef4444'}` }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: item.ok ? '#d1fae5' : '#fed7aa', color: item.ok ? '#065f46' : '#9a3412' }}>{item.note}</span>
                  <Edit3 size={14} color="#94a3b8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
              Active Alerts
              {alerts.length > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>{alerts.length}</span>}
            </h2>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setModal({ type: 'newAlert' })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 12, background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              <Plus size={14} /> New Alert
            </motion.button>
          </div>
          <AnimatePresence>
            {alerts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#fff', borderRadius: 20, padding: 24, textAlign: 'center', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
                <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 700, color: '#0f172a' }}>All clear!</p>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>No active alerts.</p>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alerts.map((alert) => {
                  const c = COLORS[alert.type];
                  return (
                    <motion.div key={alert.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60, height: 0 }}
                      style={{ background: c.bg, borderRadius: 18, padding: 16, border: `1.5px solid ${c.border}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                          <p style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{alert.title}</p>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, flexShrink: 0 }}>{alert.time}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>{alert.body}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => respondAlert(alert)}
                          style={{ flex: 1, padding: 8, borderRadius: 10, background: c.border, color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Send size={13} /> Respond
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => notify(`📍 Routing patients around: ${alert.title}`)}
                          style={{ flex: 1, padding: 8, borderRadius: 10, background: 'rgba(0,0,0,0.06)', color: '#475569', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <MapPin size={13} /> Reroute
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.97 }} onClick={() => dismissAlert(alert.id)}
                          style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.06)', color: '#64748b', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}>
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
