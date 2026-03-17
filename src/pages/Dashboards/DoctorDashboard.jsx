import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Clock, FileText, CheckCircle, Calendar,
  Stethoscope, ChevronRight, Bell, LogOut, Pill, Heart,
  TrendingUp, AlertCircle, Users, Star, X, Plus, Phone,
  MessageSquare, Save
} from 'lucide-react';

const INIT_APPOINTMENTS = [
  { id: 1, time: '09:00 AM', name: 'Sarah Jenkins',  initials: 'SJ', age: 34, a11y: 'Requires ASL Interpreter', status: 'Checked In', color: '#10b981', bp: '118/76', hr: 72,  notes: 'Follow-up for hypertension management.' },
  { id: 2, time: '10:15 AM', name: 'Marcus Tullius', initials: 'MT', age: 67, a11y: 'Cognitive Overload Risk',   status: 'En Route',   color: '#f59e0b', bp: '140/90', hr: 88,  notes: 'Diabetes check-in. Review metformin dosage.' },
  { id: 3, time: '11:30 AM', name: 'Elena Vasquez',  initials: 'EV', age: 45, a11y: 'Mobility Impairment',       status: 'Scheduled',  color: '#6366f1', bp: '122/78', hr: 68,  notes: 'Post-op mobility assessment.' },
  { id: 4, time: '02:00 PM', name: 'John Patterson', initials: 'JP', age: 52, a11y: 'Low Vision Support',        status: 'Scheduled',  color: '#3b82f6', bp: '130/82', hr: 74,  notes: 'Annual wellness exam.' },
  { id: 5, time: '03:30 PM', name: 'Amara Osei',     initials: 'AO', age: 28, a11y: 'Standard Needs',            status: 'Scheduled',  color: '#ec4899', bp: '110/70', hr: 62,  notes: 'New patient intake.' },
];

const INIT_RX = [
  { id: 1, patient: 'Sarah Jenkins',  drug: 'Amoxicillin 500mg', dosage: '3× daily', expires: '24 Mar', urgent: false, refills: 2 },
  { id: 2, patient: 'Marcus Tullius', drug: 'Metformin 1000mg',  dosage: '2× daily', expires: '18 Mar', urgent: true,  refills: 0 },
  { id: 3, patient: 'John Patterson', drug: 'Lisinopril 10mg',   dosage: '1× daily', expires: '30 Mar', urgent: false, refills: 3 },
];

const SC = { 'Checked In': { bg: '#d1fae5', text: '#065f46' }, 'En Route': { bg: '#fef3c7', text: '#92400e' }, 'Scheduled': { bg: '#e0e7ff', text: '#3730a3' }, 'Completed': { bg: '#f1f5f9', text: '#475569' } };

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
        style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, maxHeight: '85vh', overflow: 'auto', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [apts, setApts] = useState(INIT_APPOINTMENTS);
  const [rxs, setRxs] = useState(INIT_RX);
  const [noteText, setNoteText] = useState('');

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

  const completeConsult = (id) => {
    setApts(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a));
    setModal(null);
    notify(`✅ Consultation for ${apts.find(a => a.id === id)?.name} saved`);
  };

  const renewRx = (rx) => {
    setRxs(prev => prev.map(r => r.id === rx.id ? { ...r, urgent: false, refills: r.refills + 2, expires: '17 Apr' } : r));
    notify(`✅ Rxn renewed: ${rx.drug}`);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f7fb', paddingBottom: 80 }}>
      <AnimatePresence>{toast && <Toast msg={toast} onClose={() => setToast(null)} />}</AnimatePresence>

      <AnimatePresence>
        {modal?.type === 'consult' && (
          <Modal title={`Consultation – ${modal.apt.name}`} onClose={() => setModal(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[['BP', modal.apt.bp, '#ef4444'], ['Heart Rate', `${modal.apt.hr} bpm`, '#ec4899'], ['Age', modal.apt.age, '#6366f1'], ['Status', modal.apt.status, '#10b981']].map(([k, v, c]) => (
                <div key={k} style={{ background: '#f8fafc', borderRadius: 12, padding: 12 }}>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{k}</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: c, marginTop: 4 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fef3c7', padding: '10px 14px', borderRadius: 10, fontSize: 13, color: '#92400e', fontWeight: 600, marginBottom: 14 }}>⚠ {modal.apt.a11y}</div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Session Notes</label>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              style={{ width: '100%', minHeight: 90, padding: 12, borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 16 }}
              placeholder="Enter consultation notes…" />
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => completeConsult(modal.apt.id)}
                style={{ flex: 2, padding: 14, borderRadius: 14, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>
                ✓ Complete & Save
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { notify(`📞 Calling ${modal.apt.name}…`); setModal(null); }}
                style={{ flex: 1, padding: 14, borderRadius: 14, background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Phone size={16} /> Call
              </motion.button>
            </div>
          </Modal>
        )}
        {modal?.type === 'records' && (
          <Modal title={`Records – ${modal.apt.name}`} onClose={() => setModal(null)}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: modal.apt.color + '20', border: `2px solid ${modal.apt.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: modal.apt.color }}>{modal.apt.initials}</div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{modal.apt.name}</p>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Age {modal.apt.age} · {modal.apt.a11y}</p>
              </div>
            </div>
            {[['Last Visit', 'Feb 22, 2026'], ['Diagnoses', 'Hypertension, Diabetes'], ['Allergies', 'Penicillin'], ['Insurance', 'BlueCross Platinum']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setModal(null); navigate('/medical-records'); }}
              style={{ width: '100%', marginTop: 20, padding: 14, borderRadius: 14, background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Open Full Medical Records →
            </motion.button>
          </Modal>
        )}
        {modal?.type === 'newRx' && (
          <Modal title="New Prescription" onClose={() => setModal(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Patient Name', 'e.g. John Doe'], ['Medication', 'e.g. Metformin 500mg'], ['Dosage', 'e.g. 2× daily'], ['Duration', 'e.g. 30 days']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setModal(null); notify('✅ Prescription issued successfully'); }}
                style={{ width: '100%', padding: 14, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Save size={18} /> Issue Prescription
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0f766e,#0d9488,#14b8a6)', padding: '28px 20px 52px', borderBottomLeftRadius: 36, borderBottomRightRadius: 36, boxShadow: '0 12px 40px -8px rgba(13,148,136,0.5)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{greeting}, Dr.</p>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>{user?.name || 'Doctor'}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <Stethoscope size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Physician Portal</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => notify('📋 No new clinical alerts')}
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#fff" />
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
            { icon: Users,       value: apts.length, label: "Queue",     color: '#0d9488', bg: '#d1fae5' },
            { icon: CheckCircle, value: apts.filter(a => a.status === 'Completed').length, label: 'Done', color: '#6366f1', bg: '#e0e7ff' },
            { icon: Clock,       value: apts.filter(a => a.status !== 'Completed').length, label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
            { icon: Star,        value: '4.9',  label: 'Rating',  color: '#ec4899', bg: '#fce7f3' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: 20, padding: '14px 12px', textAlign: 'center', boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: FileText,   label: 'New Rx',       color: '#6366f1', bg: '#e0e7ff', fn: () => setModal({ type: 'newRx' }) },
            { icon: Activity,   label: 'Vitals',       color: '#ef4444', bg: '#fee2e2', fn: () => notify('📊 Opening vitals monitor…') },
            { icon: Heart,      label: 'Health',       color: '#ec4899', bg: '#fce7f3', fn: () => notify('❤️ Health overview loading…') },
            { icon: TrendingUp, label: 'Analytics',    color: '#0d9488', bg: '#d1fae5', fn: () => notify('📈 Analytics loading…') },
          ].map((a, i) => (
            <motion.button key={i} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} onClick={a.fn}
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 18, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 2px 10px -4px rgba(0,0,0,0.08)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a.icon size={20} color={a.color} /></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8, background: '#e8edf4', borderRadius: 16, padding: 4 }}>
          {[{ key: 'queue', label: 'Patient Queue' }, { key: 'rx', label: 'Prescriptions' }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flex: 1, padding: '10px 0', borderRadius: 12, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#0f172a' : '#64748b', boxShadow: activeTab === tab.key ? '0 2px 12px -4px rgba(0,0,0,0.15)' : 'none' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'queue' ? (
            <motion.div key="q" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Today's Appointments</h2>
                <span style={{ fontSize: 12, color: '#0d9488', fontWeight: 700 }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {apts.map((apt, i) => {
                  const sc = SC[apt.status] || { bg: '#f1f5f9', text: '#475569' };
                  const exp = expandedId === apt.id;
                  return (
                    <motion.div key={apt.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      onClick={() => setExpandedId(exp ? null : apt.id)}
                      style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', border: exp ? `2px solid ${apt.color}40` : '1px solid rgba(0,0,0,0.05)', boxShadow: exp ? `0 8px 24px -8px ${apt.color}40` : '0 2px 12px -4px rgba(0,0,0,0.08)', transition: 'all 0.25s' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: 5, background: apt.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 14, background: apt.color + '20', border: `2px solid ${apt.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: apt.color, flexShrink: 0 }}>{apt.initials}</div>
                              <div>
                                <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{apt.name}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                  <Clock size={12} color="#94a3b8" />
                                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{apt.time}</span>
                                  <span style={{ color: '#cbd5e1' }}>•</span>
                                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Age {apt.age}</span>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: sc.bg, color: sc.text, textTransform: 'uppercase' }}>{apt.status}</span>
                              <motion.div animate={{ rotate: exp ? 90 : 0 }} transition={{ duration: 0.2 }}><ChevronRight size={18} color="#94a3b8" /></motion.div>
                            </div>
                          </div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, background: '#fef3c7', padding: '5px 10px', borderRadius: 10 }}>
                            <AlertCircle size={12} color="#d97706" />
                            <span style={{ fontSize: 11, color: '#92400e', fontWeight: 700 }}>{apt.a11y}</span>
                          </div>
                          <AnimatePresence>
                            {exp && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                                <p style={{ fontSize: 13, color: '#64748b', marginTop: 10, lineHeight: 1.5 }}>{apt.notes}</p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                  <button onClick={e => { e.stopPropagation(); setNoteText(apt.notes); setModal({ type: 'consult', apt }); }}
                                    style={{ flex: 2, padding: 10, borderRadius: 12, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${apt.color},${apt.color}cc)`, color: '#fff', fontWeight: 700, fontSize: 13 }}>
                                    Start Consultation
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); setModal({ type: 'records', apt }); }}
                                    style={{ flex: 1, padding: 10, borderRadius: 12, cursor: 'pointer', border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 700, fontSize: 13 }}>
                                    Records
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); notify(`📞 Calling ${apt.name}…`); }}
                                    style={{ width: 42, padding: 10, borderRadius: 12, cursor: 'pointer', border: '1.5px solid #e2e8f0', background: '#fff', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={16} />
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); notify(`💬 Message sent to ${apt.name}`); }}
                                    style={{ width: 42, padding: 10, borderRadius: 12, cursor: 'pointer', border: '1.5px solid #e2e8f0', background: '#fff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageSquare size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="rx" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Active Prescriptions</h2>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setModal({ type: 'newRx' })}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  <Plus size={14} /> New Rx
                </motion.button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rxs.map((rx, i) => (
                  <motion.div key={rx.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ background: '#fff', borderRadius: 18, padding: 16, border: rx.urgent ? '1.5px solid #fca5a5' : '1px solid rgba(0,0,0,0.05)', boxShadow: rx.urgent ? '0 4px 20px -6px rgba(239,68,68,0.25)' : '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pill size={20} color="#6366f1" /></div>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{rx.drug}</p>
                          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{rx.patient}</p>
                        </div>
                      </div>
                      {rx.urgent && <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}><AlertCircle size={12} /> Renew Soon</div>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                      {[['Dosage', rx.dosage], ['Expires', rx.expires], ['Refills', rx.refills]].map(([k, v]) => (
                        <div key={k} style={{ background: '#f8fafc', borderRadius: 10, padding: '8px 12px' }}>
                          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{k}</p>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#334155', marginTop: 2 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <motion.button whileTap={{ scale: 0.98 }} onClick={() => renewRx(rx)}
                        style={{ flex: 1, padding: 10, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                        Renew Prescription
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.98 }} onClick={() => notify(`📧 Sent ${rx.drug} to ${rx.patient}'s pharmacy`)}
                        style={{ flex: 1, padding: 10, borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                        Send to Pharmacy
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
