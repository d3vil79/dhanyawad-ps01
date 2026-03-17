import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, BadgeCheck, BriefcaseMedical, CheckCircle, Info } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useUserStore } from '../../contexts/useUserStore';
import { useBookingStore } from '../../contexts/useBookingStore';
import { USER_NEEDS } from '../../services/mockData';

export default function AppointmentModal({ facility, onClose }) {
  const { tap, success } = useHaptics();
  const { profile } = useUserStore();
  const { bookAppointment, shareRecord } = useBookingStore();

  const [step, setStep] = useState(1); // 1: Select Specialist/Time, 2: Notes & Sharing, 3: Confirm
  const [selectedSpecialist, setSelectedSpecialist] = useState(facility.specialists?.[0] || null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState(() => {
    const activeNeeds = USER_NEEDS.filter(n => profile.needs.includes(n.id))
      .map(n => n.label)
      .join(', ');
    return activeNeeds ? `I require assistance with: ${activeNeeds}.` : '';
  });
  const [shouldShareProfile, setShouldShareProfile] = useState(true);

  const handleBook = () => {
    tap();
    const appointment = {
      facilityId: facility.id,
      facilityName: facility.name,
      specialist: selectedSpecialist,
      date,
      time,
      notes,
    };
    bookAppointment(appointment);
    if (shouldShareProfile) {
      shareRecord(facility.id, profile.needs);
    }
    success();
    setStep(3);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '92vh', background: 'var(--clr-bg)',
        borderTopLeftRadius: 'var(--r-xl)', borderTopRightRadius: 'var(--r-xl)',
        zIndex: 3001, display: 'flex', flexDirection: 'column',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
        padding: 'var(--sp-5) var(--sp-4)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)' }}>
            Book Appointment
          </h2>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>{facility.name}</p>
        </div>
        <button onClick={() => { tap(); onClose(); }} style={{ padding: 8, background: 'var(--clr-surface)', borderRadius: '50%' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {/* Specialist Selection */}
            {facility.specialists?.length > 0 && (
              <section>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={16} color="var(--clr-primary)" /> Select Specialist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {facility.specialists.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { tap(); setSelectedSpecialist(s); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--sp-3)',
                        borderRadius: 'var(--r-lg)', border: `2px solid ${selectedSpecialist?.id === s.id ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                        background: selectedSpecialist?.id === s.id ? 'var(--clr-primary-light)' : 'var(--clr-bg-card)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--clr-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {s.name.charAt(4)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)' }}>{s.name}</p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>{s.role}</p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {s.training.map(t => (
                          <span key={t} title={t} style={{ color: 'var(--clr-secondary)' }}>
                            <BadgeCheck size={18} />
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <section>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={16} color="var(--clr-primary)" /> Date
                </h3>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: 'var(--clr-bg-card)', fontFamily: 'inherit' }}
                />
              </section>
              <section>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={16} color="var(--clr-primary)" /> Time
                </h3>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)', background: 'var(--clr-bg-card)', fontFamily: 'inherit' }}
                />
              </section>
            </div>

            {/* Insurance Info */}
            {facility.insuranceCoverage && (
              <section style={{ background: 'var(--clr-bg-secondary)', padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)', border: '1px solid var(--clr-border)' }}>
                <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BriefcaseMedical size={16} color="var(--clr-secondary)" /> Accessibility Coverage
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.entries(facility.insuranceCoverage).map(([plan, items]) => (
                    <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
                      <span style={{ fontWeight: 'var(--fw-medium)' }}>{plan}</span>
                      <span style={{ color: 'var(--clr-text-secondary)' }}>{items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            <section>
              <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)' }}>
                Accessibility Notes for Provider
              </h3>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', marginBottom: 'var(--sp-3)' }}>
                These are automatically pre-filled based on your profile. You can edit them below.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific needs (e.g., ASL required, wide chair, quiet waiting...)"
                style={{
                  width: '100%', height: 120, padding: '12px',
                  borderRadius: 'var(--r-md)', border: '1px solid var(--clr-border)',
                  background: 'var(--clr-bg-card)', fontFamily: 'inherit', resize: 'none'
                }}
              />
            </section>

            <section style={{
              display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
              padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, var(--clr-primary-light), transparent)',
              border: '1px solid var(--clr-primary)'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)', marginBottom: 2 }}>
                  Share Accessibility Profile
                </h4>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-secondary)' }}>
                  Securely share your verified disability needs with hospital staff pre-arrival.
                </p>
              </div>
              <input
                type="checkbox"
                checked={shouldShareProfile}
                onChange={() => { tap(); setShouldShareProfile(!shouldShareProfile); }}
                style={{ width: 24, height: 24, cursor: 'pointer' }}
              />
            </section>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 'var(--sp-4)' }}>
            <div style={{ color: 'var(--clr-secondary)', background: 'var(--clr-secondary-light)', padding: 24, borderRadius: '50%' }}>
              <CheckCircle size={64} />
            </div>
            <h3 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-extrabold)' }}>Appointment Confirmed!</h3>
            <p style={{ color: 'var(--clr-text-secondary)', maxWidth: 280 }}>
              Your session with <strong>{selectedSpecialist?.name}</strong> at <strong>{facility.name}</strong> is booked for {date} at {time}.
            </p>
            {shouldShareProfile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--clr-primary-light)', color: 'var(--clr-primary)', borderRadius: 'var(--r-full)', fontSize: 'var(--fs-xs)', fontWeight: 'bold' }}>
                <Info size={14} /> Accessibility profile shared with provider
              </div>
            )}
            <button
              onClick={onClose}
              className="btn btn--primary"
              style={{ marginTop: 'var(--sp-6)', width: '100%' }}
            >
              Back to Facility
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {step < 3 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: 'var(--sp-4)', background: 'var(--clr-bg)',
          borderTop: '1px solid var(--clr-border)', display: 'flex', gap: 12
        }}>
          {step === 1 ? (
            <button
              disabled={!date || !time}
              onClick={() => { tap(); setStep(2); }}
              className="btn btn--primary"
              style={{ flex: 1 }}
            >
              Continue to Preferences
            </button>
          ) : (
            <>
              <button onClick={() => { tap(); setStep(1); }} className="btn btn--ghost" style={{ flex: 1 }}>Back</button>
              <button onClick={handleBook} className="btn btn--primary" style={{ flex: 2 }}>Confirm Booking</button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
