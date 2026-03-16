import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, CalendarDays, Globe2, Ear, CheckCircle, Clock } from 'lucide-react';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useHaptics } from '../../hooks/useHaptics';

const MOCK_INTERPRETERS = [
  { id: 'i1', name: 'Dr. Ramesh K.', type: 'Sign Language (ASL/ISL)', status: 'online', rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=ramesh', nextAvailable: 'Now' },
  { id: 'i2', name: 'Alisha S.', type: 'Regional (Marathi)', status: 'offline', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=alisha', nextAvailable: '2:00 PM' },
  { id: 'i3', name: 'John D.', type: 'Sign Language (ASL)', status: 'online', rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=johnd', nextAvailable: 'Now' },
];

export default function InterpreterBooking() {
  const { speak } = useAccessibilityStore();
  const { tap, success } = useHaptics();
  const [activeTab, setActiveTab] = useState('sign'); // 'sign' | 'regional'
  const [bookingState, setBookingState] = useState('idle'); // idle | booking | booked
  const [selectedInterpreter, setSelectedInterpreter] = useState(null);

  useEffect(() => {
    speak('Interpreter Booking. Connect instantly via video call with sign language or regional language interpreters.');
  }, []);

  const handleBook = (interpreter) => {
    tap();
    speak(`Initiating connection with ${interpreter.name}...`);
    setSelectedInterpreter(interpreter);
    setBookingState('booking');
    
    // Simulate connection delay
    setTimeout(() => {
      success();
      setBookingState('booked');
      speak(`Connected. The video call with ${interpreter.name} will begin shortly.`);
    }, 2000);
  };

  const handleCancel = () => {
    tap();
    setBookingState('idle');
    setSelectedInterpreter(null);
    speak('Booking cancelled.');
  };

  return (
    <div style={{ padding: 'var(--sp-6) var(--sp-4)', maxWidth: 640, margin: '0 auto', minHeight: '100dvh', background: 'var(--clr-bg)' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--sp-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 'var(--r-full)', background: 'var(--clr-primary-light)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={32} />
          </div>
        </div>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-2)' }}>
          Interpreter Services
        </h1>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--fs-base)' }}>
          Real-time video translation for your healthcare visits.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {bookingState === 'idle' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--clr-surface)', borderRadius: 'var(--r-lg)', padding: 4, marginBottom: 'var(--sp-6)' }}>
              <button
                onClick={() => { tap(); setActiveTab('sign'); speak('Sign Language tab selected.'); }}
                style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', border: 'none', background: activeTab === 'sign' ? '#fff' : 'transparent', color: activeTab === 'sign' ? 'var(--clr-text-primary)' : 'var(--clr-text-muted)', fontWeight: activeTab === 'sign' ? 'var(--fw-bold)' : 'var(--fw-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: activeTab === 'sign' ? 'var(--shadow-sm)' : 'none' }}
              >
                <Ear size={16} /> Sign Language
              </button>
              <button
                onClick={() => { tap(); setActiveTab('regional'); speak('Regional Languages tab selected.'); }}
                style={{ flex: 1, padding: '10px', borderRadius: 'var(--r-md)', border: 'none', background: activeTab === 'regional' ? '#fff' : 'transparent', color: activeTab === 'regional' ? 'var(--clr-text-primary)' : 'var(--clr-text-muted)', fontWeight: activeTab === 'regional' ? 'var(--fw-bold)' : 'var(--fw-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: activeTab === 'regional' ? 'var(--shadow-sm)' : 'none' }}
              >
                <Globe2 size={16} /> Regional
              </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {MOCK_INTERPRETERS.filter(i => activeTab === 'sign' ? i.type.includes('Sign') : !i.type.includes('Sign')).map((interpreter) => (
                <div key={interpreter.id} style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--clr-border)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={interpreter.avatar} alt={interpreter.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: interpreter.status === 'online' ? 'var(--clr-success)' : 'var(--clr-text-muted)', border: '2px solid #fff' }} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>{interpreter.name}</h3>
                    <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)' }}>{interpreter.type}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 'var(--fs-xs)', color: interpreter.status === 'online' ? 'var(--clr-success)' : 'var(--clr-text-muted)' }}>
                      <Clock size={12} /> {interpreter.status === 'online' ? 'Available Now' : `Available ${interpreter.nextAvailable}`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBook(interpreter)}
                    disabled={interpreter.status !== 'online'}
                    style={{
                      padding: '10px 16px', borderRadius: 'var(--r-lg)',
                      background: interpreter.status === 'online' ? 'var(--clr-primary)' : 'var(--clr-surface)',
                      color: interpreter.status === 'online' ? '#fff' : 'var(--clr-text-muted)',
                      border: 'none', fontWeight: 'var(--fw-bold)', cursor: interpreter.status === 'online' ? 'pointer' : 'not-allowed',
                      opacity: interpreter.status === 'online' ? 1 : 0.6
                    }}
                  >
                    {interpreter.status === 'online' ? 'Connect' : 'Book'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {bookingState === 'booking' && (
          <motion.div key="booking" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 'var(--sp-8) 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} style={{ width: 56, height: 56, border: '4px solid var(--clr-primary-light)', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', margin: '0 auto var(--sp-4)' }} />
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>Connecting...</h2>
            <p style={{ color: 'var(--clr-text-muted)', marginTop: 'var(--sp-2)' }}>Establishing secure video link with {selectedInterpreter?.name}</p>
          </motion.div>
        )}

        {bookingState === 'booked' && (
          <motion.div key="booked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', background: '#111', borderRadius: 'var(--r-2xl)', overflow: 'hidden', height: 400, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Mock Video Call UI */}
            <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 'var(--r-md)', color: '#fff', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, background: 'var(--clr-alert-red)', borderRadius: '50%' }} /> 00:00
            </div>
            
            <img src={selectedInterpreter?.avatar} alt={selectedInterpreter?.name} style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #333', marginBottom: 'var(--sp-4)' }} />
            <h2 style={{ color: '#fff', fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>{selectedInterpreter?.name}</h2>
            <p style={{ color: '#aaa', fontSize: 'var(--fs-sm)' }}>Wait for interpreter to join video...</p>

            <div style={{ position: 'absolute', bottom: 24, display: 'flex', gap: 'var(--sp-4)' }}>
              <button onClick={handleCancel} style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--clr-alert-red)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ transform: 'rotate(135deg)', display: 'block' }}>📞</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
