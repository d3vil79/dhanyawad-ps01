import { useState } from 'react';
import { useAuthStore } from '../../contexts/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Activity, Clock, FileText, CheckCircle, Calendar,
  Stethoscope, ChevronRight, Bell, LogOut, Pill, Heart,
  TrendingUp, AlertCircle, Users, Star
} from 'lucide-react';

const APPOINTMENTS = [
  { id: 1, time: '09:00 AM', name: 'Sarah Jenkins',       initials: 'SJ', age: 34, a11y: 'Requires ASL Interpreter', status: 'Checked In',   color: '#10b981' },
  { id: 2, time: '10:15 AM', name: 'Marcus Tullius',      initials: 'MT', age: 67, a11y: 'Cognitive Overload Risk',   status: 'En Route',      color: '#f59e0b' },
  { id: 3, time: '11:30 AM', name: 'Elena Vasquez',       initials: 'EV', age: 45, a11y: 'Mobility Impairment',       status: 'Scheduled',     color: '#6366f1' },
  { id: 4, time: '02:00 PM', name: 'John Patterson',      initials: 'JP', age: 52, a11y: 'Low Vision Support',        status: 'Scheduled',     color: '#3b82f6' },
  { id: 5, time: '03:30 PM', name: 'Amara Osei',          initials: 'AO', age: 28, a11y: 'Standard Needs',            status: 'Scheduled',     color: '#ec4899' },
];

const PRESCRIPTIONS = [
  { patient: 'Sarah Jenkins',  drug: 'Amoxicillin 500mg', dosage: '3× daily', expires: '24 Mar', urgent: false },
  { patient: 'Marcus Tullius', drug: 'Metformin 1000mg',  dosage: '2× daily', expires: '18 Mar', urgent: true  },
  { patient: 'John Patterson', drug: 'Lisinopril 10mg',   dosage: '1× daily', expires: '30 Mar', urgent: false },
];

const statusColors = {
  'Checked In': { bg: '#d1fae5', text: '#065f46' },
  'En Route':   { bg: '#fef3c7', text: '#92400e' },
  'Scheduled':  { bg: '#e0e7ff', text: '#3730a3' },
};

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');
  const [expandedId, setExpandedId] = useState(null);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f7fb', paddingBottom: 80 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
        padding: '28px 20px 52px',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        boxShadow: '0 12px 40px -8px rgba(13, 148, 136, 0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative circle */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {greeting()}, Dr.
            </p>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
              {user?.name || 'Doctor'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <Stethoscope size={13} color="rgba(255,255,255,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>Physician Portal</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
            >
              <Bell size={18} color="#fff" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { logout(); navigate('/auth/login'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
            >
              <LogOut size={15} color="#fff" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Stats Floating Cards ── */}
      <div style={{ padding: '0 16px', marginTop: -32, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: Users,      value: '12',  label: "Today's Queue", color: '#0d9488', bg: '#d1fae5' },
            { icon: CheckCircle,value: '5',   label: 'Completed',     color: '#6366f1', bg: '#e0e7ff' },
            { icon: Clock,      value: '3',   label: 'Pending',       color: '#f59e0b', bg: '#fef3c7' },
            { icon: Star,       value: '4.9', label: 'Avg. Rating',   color: '#ec4899', bg: '#fce7f3' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: '#fff', borderRadius: 20, padding: '14px 12px',
                textAlign: 'center', boxShadow: '0 4px 20px -6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { icon: FileText,     label: 'Prescriptions', color: '#6366f1', bg: '#e0e7ff' },
            { icon: Activity,     label: 'Vitals',        color: '#ef4444', bg: '#fee2e2' },
            { icon: Heart,        label: 'Patient Health',color: '#ec4899', bg: '#fce7f3' },
            { icon: TrendingUp,   label: 'Analytics',     color: '#0d9488', bg: '#d1fae5' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -8px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 18,
                padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, cursor: 'pointer', transition: 'all 0.25s ease',
                boxShadow: '0 2px 10px -4px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 14, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <action.icon size={20} color={action.color} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textAlign: 'center', lineHeight: 1.3 }}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8, background: '#e8edf4', borderRadius: 16, padding: 4 }}>
          {[
            { key: 'queue',         label: 'Patient Queue' },
            { key: 'prescriptions', label: 'Prescriptions' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 12, fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: activeTab === tab.key ? '#fff' : 'transparent',
                color: activeTab === tab.key ? '#0f172a' : '#64748b',
                boxShadow: activeTab === tab.key ? '0 2px 12px -4px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ padding: '16px 16px 0' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'queue' ? (
            <motion.div key="queue" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Today's Appointments</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} color="#0d9488" />
                  <span style={{ fontSize: 12, color: '#0d9488', fontWeight: 700 }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {APPOINTMENTS.map((apt, i) => (
                  <AppointmentCard
                    key={apt.id}
                    apt={apt}
                    index={i}
                    expanded={expandedId === apt.id}
                    onClick={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="prescriptions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.02em' }}>Active Prescriptions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PRESCRIPTIONS.map((rx, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      background: '#fff', borderRadius: 18, padding: '16px',
                      border: rx.urgent ? '1.5px solid #fca5a5' : '1px solid rgba(0,0,0,0.05)',
                      boxShadow: rx.urgent ? '0 4px 20px -6px rgba(239,68,68,0.25)' : '0 2px 12px -4px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 14, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Pill size={20} color="#6366f1" />
                        </div>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.02em' }}>{rx.drug}</p>
                          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{rx.patient}</p>
                        </div>
                      </div>
                      {rx.urgent && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                          <AlertCircle size={12} />
                          Renew Soon
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '8px 12px' }}>
                        <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dosage</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#334155', marginTop: 2 }}>{rx.dosage}</p>
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '8px 12px' }}>
                        <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expires</p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#334155', marginTop: 2 }}>{rx.expires}</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%', marginTop: 12, padding: '10px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 12px -4px rgba(99,102,241,0.4)',
                      }}
                    >
                      Renew Prescription
                    </motion.button>
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

function AppointmentCard({ apt, index, expanded, onClick }) {
  const sc = statusColors[apt.status] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        border: expanded ? `2px solid ${apt.color}40` : '1px solid rgba(0,0,0,0.05)',
        boxShadow: expanded ? `0 8px 24px -8px ${apt.color}40` : '0 2px 12px -4px rgba(0,0,0,0.08)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Colored left bar */}
      <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ width: 5, background: apt.color, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: apt.color + '20', border: `2px solid ${apt.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 15, color: apt.color, flexShrink: 0,
              }}>
                {apt.initials}
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.02em' }}>{apt.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  <Clock size={12} color="#94a3b8" />
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{apt.time}</span>
                  <span style={{ fontSize: 12, color: '#cbd5e1' }}>•</span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Age {apt.age}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: sc.bg, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {apt.status}
              </span>
              <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={18} color="#94a3b8" />
              </motion.div>
            </div>
          </div>

          {/* Accessibility Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, background: '#fef3c7', padding: '6px 10px', borderRadius: 10, width: 'fit-content' }}>
            <AlertCircle size={12} color="#d97706" />
            <span style={{ fontSize: 11, color: '#92400e', fontWeight: 700 }}>{apt.a11y}</span>
          </div>

          {/* Expanded Actions */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: `linear-gradient(135deg, ${apt.color}, ${apt.color}cc)`,
                      color: '#fff', fontWeight: 700, fontSize: 13,
                      boxShadow: `0 4px 12px -4px ${apt.color}66`,
                    }}
                  >
                    Start Consultation
                  </button>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                      border: '1.5px solid #e2e8f0', background: '#fff',
                      color: '#475569', fontWeight: 700, fontSize: 13,
                    }}
                  >
                    View Records
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

