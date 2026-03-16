import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, HeartHandshake, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useHaptics } from '../../hooks/useHaptics';

const MOCK_VOLUNTEERS = [
  { id: 'v1', name: 'Sarah J.', rating: 4.9, distance: '0.8 miles', langs: ['English', 'ASL'], skills: ['Wheelchair Assist', 'Visual Guide'], image: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'v2', name: 'David M.', rating: 4.8, distance: '1.2 miles', langs: ['English', 'Spanish'], skills: ['General Support'], image: 'https://i.pravatar.cc/150?u=david' },
  { id: 'v3', name: 'Priya K.', rating: 5.0, distance: '2.5 miles', langs: ['English', 'Hindi', 'ASL'], skills: ['Deaf/Hard of Hearing Comm', 'Safe Navigation'], image: 'https://i.pravatar.cc/150?u=priya' },
];

export default function CompanionConnect() {
  const { speak } = useAccessibilityStore();
  const { tap, success } = useHaptics();
  const [requestStatus, setRequestStatus] = useState('idle'); // idle | searching | matched
  const [matchedCompanion, setMatchedCompanion] = useState(null);

  useEffect(() => {
    speak('Companion Connect. Match with verified local volunteers for support during your healthcare visit.');
  }, []);

  const handleRequest = () => {
    tap();
    speak('Searching for nearby companions...');
    setRequestStatus('searching');
    
    // Simulate finding a match after 3 seconds
    setTimeout(() => {
      success();
      const match = MOCK_VOLUNTEERS[0];
      setMatchedCompanion(match);
      setRequestStatus('matched');
      speak(`Matched with ${match.name}. They are ${match.distance} away and can assist with ${match.skills[0]}.`);
    }, 3000);
  };

  const handleCancel = () => {
    tap();
    setRequestStatus('idle');
    setMatchedCompanion(null);
    speak('Match request cancelled.');
  };

  return (
    <div style={{ padding: 'var(--sp-6) var(--sp-4)', maxWidth: 600, margin: '0 auto', minHeight: '100dvh', background: 'var(--clr-bg)' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--r-full)', background: 'var(--clr-primary-light)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartHandshake size={32} />
          </div>
        </div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-2)' }}>
          Companion Connect
        </h1>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-base)' }}>
          Get accompanied by background-checked, trained volunteers to your healthcare appointments.
        </p>
      </header>

      <section style={{ background: '#fff', borderRadius: 'var(--r-2xl)', padding: 'var(--sp-6)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--clr-border)' }}>
        <AnimatePresence mode="wait">
          {requestStatus === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ display: 'flex', gap: 'var(--sp-4)', justifyContent: 'center', marginBottom: 'var(--sp-6)' }}>
                <div style={{ textAlign: 'center' }}>
                  <ShieldCheck size={24} color="var(--clr-success)" style={{ margin: '0 auto var(--sp-2)' }} />
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-secondary)', fontWeight: 'var(--fw-medium)' }}>Verified<br/>Locals</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Users size={24} color="var(--clr-primary)" style={{ margin: '0 auto var(--sp-2)' }} />
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-secondary)', fontWeight: 'var(--fw-medium)' }}>Trained to<br/>Assist</p>
                </div>
              </div>
              
              <button
                onClick={handleRequest}
                style={{
                  width: '100%', padding: '16px', borderRadius: 'var(--r-xl)',
                  background: 'var(--clr-primary)', color: '#fff',
                  border: 'none', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                }}
              >
                Find a Companion Now
              </button>
            </motion.div>
          )}

          {requestStatus === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              style={{ textAlign: 'center', padding: 'var(--sp-4) 0' }}
            >
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ width: 48, height: 48, border: '4px solid var(--clr-primary-light)', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', margin: '0 auto var(--sp-4)' }}
              />
              <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>Scanning area...</h2>
              <p style={{ color: 'var(--clr-text-muted)', marginTop: 'var(--sp-2)' }}>Looking for available volunteers near your location.</p>
              
              <button
                onClick={handleCancel}
                style={{ marginTop: 'var(--sp-6)', background: 'none', border: 'none', color: 'var(--clr-alert-red)', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)', cursor: 'pointer' }}
              >
                Cancel Search
              </button>
            </motion.div>
          )}

          {requestStatus === 'matched' && matchedCompanion && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--r-xl)', padding: 'var(--sp-4)', marginBottom: 'var(--sp-6)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                <CheckCircle size={24} color="var(--clr-success)" />
                <div>
                  <h3 style={{ color: '#166534', fontWeight: 'var(--fw-bold)' }}>Match Found!</h3>
                  <p style={{ color: '#15803D', fontSize: 'var(--fs-sm)' }}>They've accepted your request.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
                <img src={matchedCompanion.image} alt={matchedCompanion.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--clr-primary-light)' }} />
                <div>
                  <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>{matchedCompanion.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--clr-text-muted)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
                    <Star size={14} color="#EAB308" fill="#EAB308" /> {matchedCompanion.rating}
                    <span>•</span>
                    <MapPin size={14} /> {matchedCompanion.distance} away
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--sp-6)' }}>
                <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-secondary)', marginBottom: 8 }}>Can assist with:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {matchedCompanion.skills.map(skill => (
                    <span key={skill} style={{ padding: '6px 12px', background: 'var(--clr-surface)', borderRadius: 'var(--r-full)', fontSize: 'var(--fs-xs)', color: 'var(--clr-text-primary)' }}>{skill}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                <button style={{ flex: 1, padding: '14px', borderRadius: 'var(--r-lg)', background: 'var(--clr-primary)', color: '#fff', border: 'none', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>
                  Chat Now
                </button>
                <button
                  onClick={handleCancel}
                  style={{ flex: 1, padding: '14px', borderRadius: 'var(--r-lg)', background: 'var(--clr-surface)', color: 'var(--clr-text-primary)', border: '1px solid var(--clr-border)', fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}
                >
                  Cancel Match
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
