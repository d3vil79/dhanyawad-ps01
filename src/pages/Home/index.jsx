import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, MapPin, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hero3D } from '../../components/home/Hero3D';
import { MicButton } from '../../components/common/MicButton';
import { PillTag } from '../../components/common/PillTag';
import { FacilityCard } from '../../components/facility/FacilityCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { useHaptics } from '../../hooks/useHaptics';
import { useNearby } from '../../hooks/useNearby';
import { useUserStore } from '../../contexts/useUserStore';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useLocationStore } from '../../contexts/useLocationStore';
import { CATEGORIES } from '../../services/mockData';

export default function Home() {
  const { profile } = useUserStore();
  const { speak, stopSpeaking, ttsEnabled, toggleTts } = useAccessibilityStore();
  const { tap, success } = useHaptics();
  const { coords, hasRealLocation, fetchLocation, error: locError } = useLocationStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);
  const [voiceError, setVoiceError] = useState(null);

  // Voice command: auto-commits final result into search
  const { listening, transcript, error: speechError, startListening, stopListening } = useVoiceCommand({
    onFinalResult: (text) => {
      setQuery(text);
      speak(`Searching for ${text}`);
      tap();
    },
  });

  const { facilities, loading } = useNearby({
    categories: activeCategories,
    query: listening ? transcript : query,
  });

  // Announce page on arrival (TTS)
  useEffect(() => {
    speak(`Home. ${facilities.length} accessible facilities near you.`);
    return () => stopSpeaking();
  }, []);

  // Announce result count when filter changes
  useEffect(() => {
    if (!loading && !listening) {
      speak(`${facilities.length} facilities found.`);
    }
  }, [facilities.length, loading]);

  // Show speech errors
  useEffect(() => {
    if (speechError) setVoiceError(speechError);
  }, [speechError]);

  const toggleCategory = (id) => {
    tap();
    setActiveCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    const cat = CATEGORIES.find(c => c.id === id);
    speak(cat ? `${cat.label} filter toggled.` : '');
  };

  const handleMic = () => {
    tap();
    setVoiceError(null);
    if (listening) stopListening();
    else startListening();
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100dvh' }}>
      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 100%)',
        padding: 'var(--sp-6) var(--sp-4) var(--sp-8)',
        overflow: 'hidden',
      }}>
        <Hero3D />
        
        {/* TopNav */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', marginBottom: 2 }}>{greeting()},</p>
            <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', lineHeight: 'var(--lh-tight)' }}>
              {profile.name} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            {/* Q&A Help Link */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { tap(); navigate('/qna'); }}
              aria-label="Help and Q and A"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#fff', border: '1.5px solid var(--clr-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              <HelpCircle size={18} color="var(--clr-text-primary)" />
            </motion.button>
            {/* TTS toggle in topnav */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { tap(); toggleTts(); }}
              aria-label={ttsEnabled ? 'Disable text to speech' : 'Enable text to speech'}
              aria-pressed={ttsEnabled}
              title={ttsEnabled ? 'TTS On' : 'TTS Off'}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: ttsEnabled ? 'var(--clr-primary-light)' : '#fff',
                border: `1.5px solid ${ttsEnabled ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              {ttsEnabled
                ? <Volume2 size={18} color="var(--clr-primary)" />
                : <VolumeX size={18} color="var(--clr-text-muted)" />
              }
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { tap(); navigate('/profile'); }}
              aria-label="View profile"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--clr-primary),var(--clr-secondary))',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-base)',
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </motion.button>
          </div>
        </div>

        {/* Location status */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--sp-4)' }}
        >
          <MapPin size={13} color={hasRealLocation ? 'var(--clr-secondary)' : 'var(--clr-text-muted)'} />
          <span style={{ fontSize: 'var(--fs-xs)', color: hasRealLocation ? 'var(--clr-secondary)' : 'var(--clr-text-muted)', fontWeight: 'var(--fw-medium)' }}>
            {locError ? locError : hasRealLocation ? 'Using your real GPS location' : 'Using default location — tap to update'}
          </span>
          {!hasRealLocation && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { tap(); fetchLocation(); speak('Fetching your location.'); }}
              style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-primary)', fontWeight: 'var(--fw-semibold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Update
            </motion.button>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}
        >
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="var(--clr-text-muted)" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} aria-hidden="true" />
            <input
              type="search"
              value={listening ? transcript : query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => speak('Search for healthcare facilities by name or address.')}
              placeholder={listening ? '🎤 Listening…' : 'Search clinics, hospitals…'}
              aria-label="Search facilities"
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: 'var(--r-xl)',
                border: `2px solid ${listening ? 'var(--clr-alert-red)' : 'var(--clr-border)'}`,
                background: '#fff',
                fontSize: 'var(--fs-base)',
                color: 'var(--clr-text-primary)',
                boxShadow: 'var(--shadow-sm)',
                outline: 'none',
                transition: 'border-color var(--transition-base)',
              }}
            />
            {query && !listening && (
              <button
                onClick={() => { setQuery(''); speak('Search cleared.'); tap(); }}
                aria-label="Clear search"
                style={{
                  position: 'absolute', right: 12,
                  background: 'var(--clr-surface)', border: 'none', borderRadius: '50%',
                  width: 22, height: 22, cursor: 'pointer', fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--clr-text-muted)',
                }}
              >✕</button>
            )}
          </div>
          <MicButton listening={listening} onClick={handleMic} size={52} />
        </motion.div>

        {/* Voice / speech errors */}
        <AnimatePresence>
          {voiceError && (
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: 8, fontSize: 'var(--fs-xs)', color: 'var(--clr-alert-red)', fontWeight: 'var(--fw-medium)' }}
              role="alert"
            >
              ⚠ {voiceError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: 'var(--sp-5) var(--sp-4)' }}>
        {/* Category Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: 'var(--sp-6)' }}>
          <h2 style={{
            fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)',
            color: 'var(--clr-text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: 'var(--sp-3)',
          }}>Filter by Need</h2>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <PillTag
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                active={activeCategories.includes(cat.id)}
                onClick={() => toggleCategory(cat.id)}
                color={cat.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>
            {activeCategories.length > 0 || query ? '🔍 Results' : '✨ Recommended for You'}
          </h2>
          <span
            aria-live="polite"
            style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}
          >
            {loading ? '…' : `${facilities.length} found`}
          </span>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="responsive-grid">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : facilities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--sp-12) var(--sp-4)', color: 'var(--clr-text-muted)' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🏥</p>
            <p style={{ fontWeight: 'var(--fw-semibold)' }}>No facilities found</p>
            <p style={{ fontSize: 'var(--fs-sm)', marginTop: 4 }}>Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {facilities.map((f, i) => (
              <FacilityCard key={f.id} facility={f} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
