import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Velocity from 'velocity-animate';
import { ArrowLeft, FileText, Pill, AlertTriangle, Clock, Download } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';

const MOCK_RECORDS = [
  { id: 1, type: 'alert', title: 'Severe Penicillin Allergy', date: 'Active', icon: AlertTriangle, color: 'var(--clr-accent)' },
  { id: 2, type: 'prescription', title: 'Lisinopril 10mg', date: 'Refill by Oct 12', icon: Pill, color: 'var(--clr-primary)' },
  { id: 3, type: 'prescription', title: 'Atorvastatin 20mg', date: 'Refill by Nov 05', icon: Pill, color: 'var(--clr-primary)' },
  { id: 4, type: 'document', title: 'Cardiology Report (Accessible PDF)', date: 'Sep 14, 2023', icon: FileText, color: 'var(--clr-secondary)' },
  { id: 5, type: 'document', title: 'Annual Physical Summary', date: 'Jan 02, 2023', icon: FileText, color: 'var(--clr-secondary)' },
];

export default function MedicalRecords() {
  const navigate = useNavigate();
  const { tap } = useHaptics();
  const { speak } = useAccessibilityStore();
  const listRef = useRef(null);

  useEffect(() => {
    speak('My Medical Records and Alerts.');
    
    // Velocity.js Staggered Entrance Animation
    if (listRef.current) {
      const children = listRef.current.children;
      // Reset opacity first
      for (let i = 0; i < children.length; i++) {
        children[i].style.opacity = 0;
      }
      
      Velocity(
        children,
        "transition.slideUpIn",
        { stagger: 100, duration: 600, drag: true }
      );
    }
  }, [speak]);

  const handleReadRecord = (record) => {
    tap();
    speak(`${record.type === 'alert' ? 'Medical Alert' : 'Record'}: ${record.title}. ${record.date}.`);
  };

  return (
    <div style={{ padding: 'var(--sp-5) var(--sp-4)', paddingBottom: 100, minHeight: '100dvh', background: 'var(--clr-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--sp-6)', gap: 16 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tap(); navigate(-1); }}
          aria-label="Go back to profile"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)', flexShrink: 0
          }}
        >
          <ArrowLeft size={20} color="var(--clr-text-primary)" />
        </motion.button>
        <div>
          <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)' }}>
            Medical Records
          </h1>
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-sm)' }}>
            Secure & accessible health data
          </p>
        </div>
      </div>

      {/* Record List */}
      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {MOCK_RECORDS.map((record) => {
          const Icon = record.icon;
          return (
            <motion.button
              key={record.id}
              onClick={() => handleReadRecord(record)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: 'var(--sp-4)', background: 'var(--clr-surface)',
                borderRadius: 'var(--r-xl)', border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-sm)', width: '100%', textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--r-lg)',
                background: `${record.color}15`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Icon size={24} color={record.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 4 }}>
                  {record.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)' }}>
                  <Clock size={12} />
                  <span>{record.date}</span>
                </div>
              </div>
              <div style={{ color: 'var(--clr-primary)', padding: 8 }}>
                {record.type === 'document' && <Download size={20} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
