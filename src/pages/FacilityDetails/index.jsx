import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useSpring, animated } from '@react-spring/web';
import { ArrowLeft, Navigation, Phone, Clock, CheckCircle, Loader, Volume2, Camera } from 'lucide-react';
import { AlertBanner } from '../../components/facility/AlertBanner';
import { ScoreBadge } from '../../components/facility/ScoreBadge';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useUserStore } from '../../contexts/useUserStore';
import { getFacilityById, pingPreArrival } from '../../services/api';
import { formatDistance } from '../../utils/formatters';

export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tap, success, error: errVib } = useHaptics();
  const { speak, stopSpeaking } = useAccessibilityStore();
  const { profile } = useUserStore();

  const [facility, setFacility] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [pingState, setPingState] = useState('idle');
  const [showPingConfirm, setShowPingConfirm] = useState(false);

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

  const chartData = facility ? [
    { name: 'Motor', val: facility.categories.includes('wheelchair') ? facility.score * 10 : 40, color: '#3B82F6' },
    { name: 'Visual', val: facility.categories.includes('visual') ? facility.score * 9.5 : 35, color: '#8B5CF6' },
    { name: 'Cognitive', val: facility.categories.includes('cognitive') ? facility.score * 9 : 30, color: '#F59E0B' },
    { name: 'Hearing', val: facility.categories.includes('hearing') ? facility.score * 9.2 : 45, color: '#10B981' },
    { name: 'Sensory', val: facility.categories.includes('sensory') ? facility.score * 8.8 : 50, color: '#EC4899' },
  ] : [];

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
            <h1 style={{
              fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)',
              color: 'var(--clr-text-primary)', lineHeight: 'var(--lh-tight)',
              flex: 1, marginRight: 12,
            }}>
              {facility.name}
            </h1>
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
        {facility.alert && (
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            <AlertBanner alert={facility.alert} />
          </div>
        )}

        {/* Analytics Graph */}
        <animated.div style={{ ...graphSpring, marginBottom: 'var(--sp-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-4)' }}>
            📊 Accessibility Breakdown
          </h2>
          <div style={{ height: 260, background: 'var(--clr-bg-card)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-4)', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-sm)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} dy={8} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }} 
                  contentStyle={{ borderRadius: 'var(--r-md)', border: 'none', boxShadow: 'var(--shadow-lg)', fontSize: 13, fontWeight: 'var(--fw-bold)' }}
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Proficiency']}
                />
                <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--clr-text-primary)' }}>{r.author}</span>
                    <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)', fontSize: 'var(--fs-sm)' }}>{r.rating}/10</span>
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
                  
                  {r.proofImage && (
                    <div style={{ marginTop: 12, borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--clr-border)', position: 'relative' }}>
                      <img src={r.proofImage} alt="User uploaded accessibility proof" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Camera size={10} /> Verified Proof
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { tap(); speak(`Review by ${r.author}. Score ${r.rating}. ${r.text}`, { force: true }); }}
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
        {/* Navigate */}
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

        {/* Ping Pre-Arrival */}
        <motion.button
          onClick={pingState === 'idle' ? handlePing : undefined}
          whileTap={{ scale: 0.96 }}
          disabled={pingState !== 'idle'}
          aria-label="Ping facility for pre-arrival accessibility assistance"
          aria-busy={pingState === 'loading'}
          style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px', borderRadius: 'var(--r-lg)', border: 'none',
            background: pingState === 'done' ? 'var(--clr-secondary)' : pingState === 'loading' ? 'var(--clr-primary-dark)' : 'var(--clr-primary)',
            color: '#fff', fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)',
            cursor: pingState === 'idle' ? 'pointer' : 'default',
            transition: 'background var(--transition-base)',
          }}
        >
          {pingState === 'loading'
            ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Notifying…</>
            : pingState === 'done'
            ? <><CheckCircle size={16} aria-hidden="true" /> Facility Pinged!</>
            : <>📡 Ping Pre-Arrival</>
          }
        </motion.button>
      </div>

      {/* Ping Toast */}
      <AnimatePresence>
        {showPingConfirm && (
          <motion.div
            role="status" aria-live="polite"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: 168, left: 16, right: 16,
              background: 'var(--clr-secondary-light)',
              border: '1.5px solid var(--clr-secondary)',
              borderRadius: 'var(--r-lg)', padding: '12px 16px', zIndex: 200,
            }}
          >
            <p style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-secondary)' }}>✅ Facility Notified!</p>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)' }}>
              Accessibility staff will be ready for your arrival in ~15–20 minutes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
