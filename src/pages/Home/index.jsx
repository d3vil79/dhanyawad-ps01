import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Search, MapPin, Volume2, VolumeX, HelpCircle, ChevronDown, Sparkles, AlertTriangle, X, Users, Heart, Share2, PlusCircle, BookOpen, Scale, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hero3D } from '../../components/home/Hero3D';
import { MicButton } from '../../components/common/MicButton';
import { PillTag } from '../../components/common/PillTag';
import { FacilityCard } from '../../components/facility/FacilityCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { useHaptics } from '../../hooks/useHaptics';
import { useNearby } from '../../hooks/useNearby';
import { useEmergencyAlerts } from '../../hooks/useEmergencyAlerts';
import { useUserStore } from '../../contexts/useUserStore';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useLocationStore } from '../../contexts/useLocationStore';
import { CATEGORIES, USER_NEEDS } from '../../services/mockData';

export default function Home() {
  const { profile } = useUserStore();
  const { ttsEnabled, toggleTts, speak, stopSpeaking, simpleMode } = useAccessibilityStore();
  const { tap } = useHaptics();
  const { hasRealLocation, fetchLocation, error: locError } = useLocationStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);
  const [voiceError, setVoiceError] = useState(null);
  const [smartSort, setSmartSort] = useState(true); // default ON
  const [profileBannerOpen, setProfileBannerOpen] = useState(false);

  const { activeAlert, dismissAlert } = useEmergencyAlerts();

  // Voice command: auto-commits final result into search
  const { listening, transcript, error: speechError, startListening, stopListening } = useVoiceCommand({
    onFinalResult: (text) => {
      setQuery(text);
      speak(`Searching for ${text}`);
      tap();
    },
  });

  const { facilities, loading, smartSortActive } = useNearby({
    categories: activeCategories,
    query: listening ? transcript : query,
    userNeeds: smartSort ? profile.needs : [],
  });

  // Label for the needs
  const activeNeedLabels = USER_NEEDS.filter(n => profile.needs.includes(n.id));

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
    if (speechError) {
      setTimeout(() => setVoiceError(speechError), 0);
    }
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
      {/* Emergency Alert Toast */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            onClick={() => { tap(); navigate(`/facility/${activeAlert.facilityId}`); }}
            style={{
              position: 'fixed', top: 0, left: 16, right: 16, zIndex: 2000,
              background: '#FEF2F2', border: '2px solid #EF4444', borderRadius: 'var(--r-xl)',
              padding: '16px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)',
              display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer'
            }}
          >
            <div style={{ padding: 8, background: '#EF4444', borderRadius: 12 }}>
              <AlertTriangle size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 'var(--fw-bold)', color: '#991B1B', fontSize: 'var(--fs-sm)' }}>
                  ⚠️ Emergency A11y Alert
                </span>
                <span style={{ fontSize: 10, color: '#DC2626' }}>{activeAlert.timestamp}</span>
              </div>
              <p style={{ fontSize: 'var(--fs-sm)', color: '#B91C1C', fontWeight: 'var(--fw-medium)', marginBottom: 2 }}>
                {activeAlert.facilityName}
              </p>
              <p style={{ fontSize: 'var(--fs-xs)', color: '#EF4444' }}>
                {activeAlert.message}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); dismissAlert(); }}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 100%)',
        padding: 'var(--sp-6) var(--sp-4) var(--sp-8)',
        overflow: 'hidden',
      }}>
        {!simpleMode && <Hero3D />}
        
        {/* TopNav */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', marginBottom: 2 }}>{greeting()},</p>
            <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', lineHeight: 'var(--lh-tight)' }}>
              {profile.role === 'caregiver' ? 'Care Coordinator' : profile.name} 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            {/* Role Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const nextRole = profile.role === 'caregiver' ? 'individual' : 'caregiver';
                const { setRole } = useUserStore.getState();
                setRole(nextRole);
                tap();
                speak(`Switched to ${nextRole} mode.`);
              }}
              style={{
                height: 40, padding: '0 12px', borderRadius: 'var(--r-full)',
                background: profile.role === 'caregiver' ? 'var(--clr-secondary)' : 'var(--clr-surface)',
                border: `1.5px solid ${profile.role === 'caregiver' ? 'var(--clr-secondary)' : 'var(--clr-border)'}`,
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                color: profile.role === 'caregiver' ? '#fff' : 'var(--clr-text-primary)'
              }}
            >
              {profile.role === 'caregiver' ? <Heart size={14} fill="#fff" /> : <Users size={14} />}
              <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)' }}>
                {profile.role === 'caregiver' ? 'Caregiver' : 'Individual'}
              </span>
            </motion.button>
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
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { tap(); toggleTts(); }}
              aria-label={ttsEnabled ? 'Disable text to speech' : 'Enable text to speech'}
              aria-pressed={ttsEnabled}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: ttsEnabled ? 'var(--clr-primary-light)' : '#fff',
                border: `1.5px solid ${ttsEnabled ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              {ttsEnabled ? <Volume2 size={18} color="var(--clr-primary)" /> : <VolumeX size={18} color="var(--clr-text-muted)" />}
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
            {locError || (hasRealLocation ? 'Using real GPS location' : 'Using default location')}
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
              onFocus={() => speak('Search using names or natural phrases like, hospital with wheelchair MRI nearby.')}
              placeholder={listening ? '🎤 Listening…' : 'Search clinics, hospitals…'}
              aria-label="Search facilities"
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: 'var(--r-xl)',
                border: `2px solid ${listening ? 'var(--clr-alert-red)' : (query.length > 15 ? 'var(--clr-primary)' : 'var(--clr-border)')}`,
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

        {/* AI Analysis Active Indicator */}
        <AnimatePresence>
          {query.length > 15 && !listening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                fontWeight: 'var(--fw-medium)'
              }}
            >
              <Sparkles size={12} />
              <span>AI Analysis Active: Extracting intent & accessibility features…</span>
            </motion.div>
          )}
        </AnimatePresence>

        {profile.role === 'caregiver' ? (
          /* Care Coordination Dashboard */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'relative', zIndex: 10,
              marginTop: 16, padding: '16px',
              background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
              border: '1.5px solid #10B981', borderRadius: 'var(--r-xl)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 6, background: '#10B981', borderRadius: 8 }}>
                  <Users size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 'var(--fw-bold)', color: '#047857', textTransform: 'uppercase' }}>Coordination Hub</div>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>Managing {profile.dependents.length} Dependents</div>
                </div>
              </div>
              <PlusCircle size={20} color="#10B981" />
            </div>

            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {profile.dependents.map(d => (
                <motion.button
                  key={d.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { tap(); const { setActiveDependent } = useUserStore.getState(); setActiveDependent(profile.activeDependentId === d.id ? null : d.id); }}
                  style={{
                    padding: '10px 14px', borderRadius: 'var(--r-lg)',
                    background: profile.activeDependentId === d.id ? '#10B981' : '#fff',
                    color: profile.activeDependentId === d.id ? '#fff' : 'var(--clr-text-primary)',
                    border: `1.5px solid ${profile.activeDependentId === d.id ? '#10B981' : 'var(--clr-border)'}`,
                    boxShadow: 'var(--shadow-sm)', minWidth: 140, cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)' }}>{d.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>Needs: {d.needs.join(', ')}</div>
                </motion.button>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1, padding: '8px', borderRadius: 'var(--r-md)', fontSize: 10, fontWeight: 'var(--fw-bold)',
                background: '#fff', border: '1px solid var(--clr-border)', color: 'var(--clr-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
              }}>
                <Share2 size={12} /> Share Summary
              </button>
              <button style={{
                flex: 1, padding: '8px', borderRadius: 'var(--r-md)', fontSize: 10, fontWeight: 'var(--fw-bold)',
                background: '#fff', border: '1px solid var(--clr-border)', color: 'var(--clr-text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
              }}>
                <HelpCircle size={12} /> Help Guide
              </button>
            </div>
          </motion.div>
        ) : (
          /* Smart Profile Banner (Individual Mode) */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              position: 'relative', zIndex: 10,
              margin: '12px 0 0',
              background: smartSortActive
                ? 'linear-gradient(135deg,#EFF6FF,#F0FDF4)'
                : 'var(--clr-surface)',
              border: `1.5px solid ${smartSortActive ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
              borderRadius: 'var(--r-xl)',
              padding: '10px 14px',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => { tap(); setProfileBannerOpen(o => !o); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <span style={{ fontSize: 16 }}>🎯</span>
                <span style={{
                  fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)',
                  color: smartSortActive ? 'var(--clr-primary)' : 'var(--clr-text-secondary)',
                }}>
                  {smartSortActive ? 'Smart Sort Active' : 'Smart Sort Off'}
                </span>
                {profile.needs.length > 0 && (
                  <span style={{
                    fontSize: 'var(--fs-xs)', background: 'var(--clr-primary-light)',
                    color: 'var(--clr-primary)', borderRadius: 'var(--r-full)',
                    padding: '1px 7px', fontWeight: 'var(--fw-semibold)',
                  }}>
                    {profile.needs.length} needs
                  </span>
                )}
                <ChevronDown
                  size={14}
                  color="var(--clr-text-muted)"
                  style={{ transform: profileBannerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>

              {/* Toggle smart sort on/off */}
              <button
                onClick={() => { tap(); setSmartSort(s => !s); speak(smartSort ? 'Smart sort disabled.' : 'Smart sort enabled. Facilities ranked by your profile.'); }}
                aria-pressed={smartSort}
                aria-label={smartSort ? 'Disable smart sort' : 'Enable smart sort'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px',
                  borderRadius: 'var(--r-full)',
                  border: `1.5px solid ${smartSort ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                  background: smartSort ? 'var(--clr-primary)' : 'transparent',
                  color: smartSort ? '#fff' : 'var(--clr-text-secondary)',
                  cursor: 'pointer', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                  transition: 'all 0.2s',
                }}
              >
                <Sparkles size={12} />
                {smartSort ? 'On' : 'Off'}
              </button>
            </div>

            {/* Expandable need pills */}
            <AnimatePresence>
              {profileBannerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ paddingTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {profile.needs.length === 0 ? (
                      <button
                        onClick={() => { tap(); navigate('/profile'); }}
                        style={{
                          fontSize: 'var(--fs-xs)', color: 'var(--clr-primary)',
                          background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'var(--fw-medium)',
                        }}
                      >
                        ➕ Add needs to your profile →
                      </button>
                    ) : (
                      activeNeedLabels.map(need => (
                        <span
                          key={need.id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px',
                            borderRadius: 'var(--r-full)',
                            background: 'var(--clr-primary-light)',
                            color: 'var(--clr-primary)',
                            fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-medium)',
                          }}
                        >
                          {need.icon} {need.label}
                        </span>
                      ))
                    )}

                    {profile.needs.length > 0 && (
                      <button
                        onClick={() => { tap(); navigate('/profile'); }}
                        style={{
                          fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Edit profile
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
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
        {/* Education Hub Billboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => { tap(); navigate('/education'); speak('Opening Education Hub. Learn about your legal rights and advocacy tips.'); }}
          style={{
            marginBottom: 'var(--sp-8)',
            padding: '24px',
            borderRadius: 'var(--r-2xl)',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
            color: '#fff',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.2)'
          }}
        >
          {/* Decorative icons */}
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <BookOpen size={120} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ padding: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 8 }}>
                <Scale size={18} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Know Your Rights
              </span>
            </div>
            
            <h3 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-extrabold)', marginBottom: 8, lineHeight: 'var(--lh-tight)' }}>
              Accessibility Education Hub
            </h3>
            <p style={{ fontSize: 'var(--fs-sm)', opacity: 0.9, marginBottom: 16, maxWidth: '80%' }}>
              Learn about ADA laws, Section 1557, and how to advocate for yourself in healthcare settings.
            </p>
            
            <button style={{
              padding: '8px 16px', borderRadius: 'var(--r-lg)', background: '#fff', color: '#1E3A8A',
              border: 'none', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-xs)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              Explore Resources <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

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
