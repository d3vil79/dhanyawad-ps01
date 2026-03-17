import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowLeft, Navigation, Phone, Clock, CheckCircle, Loader, Volume2, ShieldCheck, Send, MessageSquare, Share2, Calendar } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web'; // eslint-disable-line no-unused-vars
import { AlertBanner } from '../../components/facility/AlertBanner';
import { ScoreBadge } from '../../components/facility/ScoreBadge';
import { AccessibilityScorecard } from '../../components/facility/AccessibilityScorecard';
import { ProofGallery } from '../../components/facility/ProofGallery';
import { IndoorMap } from '../../components/facility/IndoorMap';
import { LiveStatusCard } from '../../components/facility/LiveStatusCard';
import { AccessibilityChat } from '../../components/facility/AccessibilityChat';
import { LiveUpdateModal } from '../../components/facility/LiveUpdateModal';
import AppointmentModal from '../../components/facility/AppointmentModal';
import ShareA11ySheet from '../../components/caregiver/ShareA11ySheet';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useUserStore } from '../../contexts/useUserStore';
import { getFacilityById, pingPreArrival } from '../../services/api';
import { formatDistance } from '../../utils/formatters';
import { predictFacilityA11y } from '../../utils/predictiveEngine';

export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tap, success } = useHaptics();
  const { speak, stopSpeaking } = useAccessibilityStore();
  const { profile } = useUserStore();

  const [facility, setFacility] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [pingState, setPingState] = useState('idle');
  const [showPingConfirm, setShowPingConfirm] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isIndoorMapOpen, setIsIndoorMapOpen] = useState(false);
  const [localAlert, setLocalAlert] = useState(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    getFacilityById(id).then(f => {
      setFacility(f);
      if (f) {
        speak(
          `${f.name}. Accessibility score ${f.score} out of 10. ${formatDistance(f.distance)}. ${f.hours}.` +
          (f.alert ? ` Alert: ${f.alert.message}` : '')
        );
      }
    });
    return () => stopSpeaking();
  }, [id]);

  const handlePing = async () => {
    tap();
    setPingState('loading');
    speak('Notifying facility of your arrival. Please wait.');
    await pingPreArrival(id, profile.needs);
    success();
    setPingState('done');
    setShowPingConfirm(true);
    speak('Facility has been notified. Accessibility staff will be ready for your arrival in 15 to 20 minutes.');
    setTimeout(() => { setPingState('idle'); setShowPingConfirm(false); }, 5000);
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    tap();
    speak(`Opening navigation to ${facility?.name}.`);
    navigate('/map', { state: { routeTo: facility } });
  };

  const handleLiveUpdate = (alert) => {
    setLocalAlert(alert);
    speak(`New live update broadcasted: ${alert.message}`);
  };

  const graphSpring = useSpring({
    from: { opacity: 0, y: 30 },
    to: { opacity: facility ? 1 : 0, y: facility ? 0 : 30 },
    delay: 200,
    config: { tension: 200, friction: 20 }
  });

  const readFacilityAloud = () => {
    if (!facility) return;
    tap();
    const catsText = facility.categories?.length 
      ? `Specific accessibility support includes: ${facility.categories.join(', ')}.`
      : '';
    speak(
      `${facility.name}. Score ${facility.score} out of 10. ${facility.address}. ${facility.hours}. ${catsText}`,
      { force: true }
    );
  };

  if (!facility) {
    return (
      <div style={{ padding: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: i === 1 ? 280 : 60, borderRadius: 'var(--r-lg)', marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100dvh', paddingBottom: 110 }}>
      {/* ── Hero Gallery ── */}
      <div style={{ position: 'relative', height: 280, background: 'var(--clr-surface)', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            src={facility.images[imgIdx]}
            alt={`${facility.name} — photo ${imgIdx + 1} of ${facility.images.length}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        </AnimatePresence>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(0,0,0,0.35) 0%,transparent 40%,rgba(0,0,0,0.5) 100%)',
        }} aria-hidden="true" />

        {/* Back */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tap(); navigate(-1); }}
          aria-label="Go back"
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <ArrowLeft size={18} color="var(--clr-text-primary)" />
        </motion.button>

        {/* Read Aloud button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={readFacilityAloud}
          aria-label="Read facility details aloud"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Volume2 size={18} color="var(--clr-primary)" />
        </motion.button>

        {/* Image dots */}
        {facility.images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', gap: 6, justifyContent: 'center' }}>
            {facility.images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setImgIdx(i); tap(); speak(`Image ${i + 1} of ${facility.images.length}`); }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === imgIdx}
                style={{
                  width: i === imgIdx ? 20 : 8, height: 8, borderRadius: 4, border: 'none',
                  background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer', transition: 'all var(--transition-base)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 'var(--sp-5) var(--sp-4)' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <h1 style={{
                fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)',
                color: 'var(--clr-text-primary)', lineHeight: 'var(--lh-tight)',
              }}>
                {facility.name}
              </h1>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { tap(); setAdminModalOpen(true); }}
                style={{
                  marginTop: 8, background: 'var(--clr-primary-light)', color: 'var(--clr-primary)',
                  border: 'none', padding: '6px 12px', borderRadius: 'var(--r-md)',
                  fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Send size={12} /> Broadcast Live Update
              </motion.button>

              {facility.floorPlan && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { tap(); setIsIndoorMapOpen(true); speak('Opening indoor map.'); }}
                  style={{
                    marginTop: 8, background: 'var(--clr-secondary-light)', color: 'var(--clr-secondary)',
                    border: 'none', padding: '6px 12px', borderRadius: 'var(--r-md)',
                    fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Navigation size={12} /> View Indoor Map
                </motion.button>
              )}
            </div>
            <ScoreBadge score={facility.score} large />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              📍 {formatDistance(facility.distance)} · {facility.address}
            </span>
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} aria-hidden="true" /> {facility.hours}
            </span>
            <a
              href={`tel:${facility.phone}`}
              onClick={tap}
              style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 'var(--fw-medium)' }}
              aria-label={`Call ${facility.name}: ${facility.phone}`}
            >
              <Phone size={13} aria-hidden="true" /> {facility.phone}
            </a>
          </div>

          {facility.verified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <CheckCircle size={14} color="var(--clr-secondary)" aria-hidden="true" />
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-secondary)', fontWeight: 'var(--fw-medium)' }}>
                Community Verified Facility
              </span>
            </div>
          )}
        </motion.div>

        {/* Alert */}
        {(localAlert || facility.alert) && (
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            <AlertBanner alert={localAlert || facility.alert} />
          </div>
        )}

        {/* Live Status Header */}
        {facility.liveStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 'var(--sp-6)' }}>
            <LiveStatusCard status={facility.liveStatus} />
          </motion.div>
        )}

        {/* Scorecard & Proofs */}
        <animated.div style={{ ...graphSpring, marginBottom: 'var(--sp-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-4)' }}>
            📊 Detailed Scorecard
          </h2>
          {(() => {
            const displayScorecard = facility.scorecard || predictFacilityA11y(facility).scorecard;
            const predictionData = !facility.scorecard ? predictFacilityA11y(facility) : null;
            
            return (
              <AccessibilityScorecard 
                scores={displayScorecard} 
                isPredicted={!!predictionData}
                confidence={predictionData?.confidence}
              />
            );
          })()}
        </animated.div>
        
        {/* Proof Gallery */}
        <animated.div style={{ ...graphSpring, marginBottom: 'var(--sp-6)', delay: 300 }}>
          {facility.proofs && <ProofGallery initialProofs={facility.proofs} />}
        </animated.div>

        {/* Reviews */}
        {facility.reviews.length > 0 && (
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)' }}>
              💬 Community Reviews
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {facility.reviews.map(r => (
                <div key={r.id} style={{
                  background: 'var(--clr-bg-secondary)', borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-4)', border: '1px solid var(--clr-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-primary)' }}>{r.author}</span>
                      {r.verified && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#059669', title: 'Verified Identity' }}>
                          <ShieldCheck size={14} />
                        </div>
                      )}
                    </div>
                    <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)', fontSize: 'var(--fs-sm)' }}>{r.rating}/10</span>
                  </div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', marginBottom: 8, fontStyle: 'italic' }}>
                    Verified {r.role}
                  </div>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: 8 }}>
                    {r.text}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {r.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 'var(--fs-xs)', padding: '2px 8px',
                        borderRadius: 'var(--r-full)',
                        background: 'var(--clr-primary-light)', color: 'var(--clr-primary)',
                        fontWeight: 'var(--fw-medium)',
                      }}>{t}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => { tap(); speak(`Review by ${r.author}, verified ${r.role}. Score ${r.rating}. ${r.text}`, { force: true }); }}
                    aria-label={`Read review by ${r.author} aloud`}
                    style={{
                      marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--clr-text-muted)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Volume2 size={12} /> Read aloud
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Action Bar ── */}
      <div style={{
        position: 'fixed', bottom: 72, left: 0, right: 0,
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--clr-border)',
        display: 'flex', gap: 12, zIndex: 50,
      }}>
        {profile.role === 'caregiver' ? (
          <>
            {/* Share Summary */}
            <motion.button
              onClick={() => { tap(); setIsShareSheetOpen(true); }}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 'var(--r-lg)',
                border: '2px solid var(--clr-secondary)', color: 'var(--clr-secondary)',
                fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)',
                background: 'transparent', cursor: 'pointer',
              }}
            >
              <Share2 size={16} /> Share Specs
            </motion.button>

            {/* Coordinate Visit */}
            <motion.button
              onClick={pingState === 'idle' ? handlePing : undefined}
              whileTap={{ scale: 0.96 }}
              disabled={pingState !== 'idle'}
              style={{
                flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 'var(--r-lg)', border: 'none',
                background: pingState === 'done' ? 'var(--clr-secondary)' : 'var(--clr-primary)',
                color: '#fff', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)',
                cursor: 'pointer', boxShadow: 'var(--shadow-md)'
              }}
            >
              {pingState === 'loading' ? <Loader size={16} className="spin" /> : <ShieldCheck size={16} />}
              {pingState === 'done' ? 'Visit Coordinated' : 'Coordinate Visit'}
            </motion.button>
          </>
        ) : (
          <>
            {/* Standard Individual Buttons */}
            <motion.button
              aria-label={`Get directions to ${facility.name}`}
              onClick={handleNavigate}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 'var(--r-lg)',
                border: '2px solid var(--clr-primary)', color: 'var(--clr-primary)',
                fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)',
                background: 'transparent', cursor: 'pointer',
              }}
            >
              <Navigation size={16} aria-hidden="true" /> Navigate
            </motion.button>

            <motion.button
              onClick={() => { tap(); setIsChatOpen(true); speak('Opening chat with accessibility coordinator.'); }}
              whileTap={{ scale: 0.96 }}
              aria-label="Chat with facility accessibility staff"
              style={{
                width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--r-lg)', border: '1.5px solid var(--clr-border)',
                background: 'var(--clr-surface)', cursor: 'pointer',
              }}
            >
              <MessageSquare size={18} color="var(--clr-text-primary)" />
            </motion.button>

            <motion.button
              aria-label={`Book an appointment at ${facility.name}`}
              onClick={() => { tap(); setIsBookingOpen(true); }}
              whileTap={{ scale: 0.96 }}
              style={{
                borderRadius: 'var(--r-lg)', border: '1.5px solid var(--clr-primary)',
                padding: '12px 16px',
                background: 'var(--clr-primary-light)', color: 'var(--clr-primary)',
                fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Calendar size={16} /> Book
            </motion.button>

            <motion.button
              onClick={pingState === 'idle' ? handlePing : undefined}
              whileTap={{ scale: 0.96 }}
              disabled={pingState !== 'idle'}
              aria-label="Ping facility for pre-arrival accessibility assistance"
              style={{
                flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 'var(--r-lg)', border: 'none',
                background: pingState === 'done' ? 'var(--clr-secondary)' : pingState === 'loading' ? 'var(--clr-primary-dark)' : 'var(--clr-primary)',
                color: '#fff', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)',
                cursor: pingState === 'idle' ? 'pointer' : 'default',
              }}
            >
              {pingState === 'loading'
                ? <><Loader size={16} className="spin" /> Notifying…</>
                : pingState === 'done'
                ? <><CheckCircle size={16} /> Pinged!</>
                : <>📡 Ping Pre-Arrival</>
              }
            </motion.button>
          </>
        )}
      </div>

      <AnimatePresence>
        {isShareSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsShareSheetOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2999, backdropFilter: 'blur(4px)' }}
            />
            <ShareA11ySheet facility={facility} onClose={() => setIsShareSheetOpen(false)} />
          </>
        )}
      </AnimatePresence>

      <LiveUpdateModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} onSubmit={handleLiveUpdate} />
      <IndoorMap isOpen={isIndoorMapOpen} onClose={() => setIsIndoorMapOpen(false)} facility={facility} />
      <AccessibilityChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} facility={facility} />
      
      <AnimatePresence>
        {isBookingOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 3000, backdropFilter: 'blur(4px)' }}
            />
            <AppointmentModal facility={facility} onClose={() => setIsBookingOpen(false)} />
          </>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
}
