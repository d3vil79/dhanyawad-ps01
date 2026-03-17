import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { A11yToggle } from '../../components/common/A11yToggle';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useUserStore } from '../../contexts/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';
import { USER_NEEDS } from '../../services/mockData';

export default function UserProfile() {
  const navigate = useNavigate();
  const {
    highContrast, toggleHighContrast,
    dyslexiaFont, toggleDyslexiaFont,
    readingRuler, toggleReadingRuler,
    largeTapTargets, toggleLargeTargets,
    simpleMode, toggleSimpleMode,
    ttsEnabled, toggleTts,
    fontSize, setFontSize,
    speak,
  } = useAccessibilityStore();

  const { profile, toggleNeed, setName } = useUserStore();
  const { tap } = useHaptics();

  // Announce page on arrival
  useEffect(() => {
    speak('Profile page. Manage your disability profile and accessibility settings.');
  }, []);

  const handleNeedToggle = (need) => {
    tap();
    toggleNeed(need.id);
    const next = !profile.needs.includes(need.id);
    speak(`${need.label} ${next ? 'added to' : 'removed from'} your profile.`);
  };

  const handleHighContrast = () => { tap(); toggleHighContrast(); };
  const handleDyslexia = () => { tap(); toggleDyslexiaFont(); };
  const handleTts = () => { tap(); toggleTts(); };
  const handleFontSize = (size) => { tap(); setFontSize(size); };

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100dvh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 100%)',
        padding: 'var(--sp-6) var(--sp-4) var(--sp-8)',
      }}>
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', marginBottom: 4 }}>
          My Profile
        </h1>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>
          Manage your accessibility preferences and disability profile.
        </p>

        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginTop: 'var(--sp-5)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--clr-primary),var(--clr-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'var(--fw-extrabold)', fontSize: 'var(--fs-2xl)', flexShrink: 0,
          }}
            role="img"
            aria-label={`Avatar for ${profile.name}`}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="name-input" style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', fontWeight: 'var(--fw-medium)' }}>
              Your Name
            </label>
            <input
              id="name-input"
              type="text"
              value={profile.name}
              onChange={e => setName(e.target.value)}
              onFocus={() => speak('Enter your name.')}
              onBlur={() => speak(`Name set to ${profile.name}.`)}
              aria-label="Your name"
              style={{
                display: 'block', width: '100%',
                background: 'transparent', border: 'none',
                borderBottom: '2px solid var(--clr-border)',
                fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)',
                color: 'var(--clr-text-primary)', padding: '4px 0',
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--sp-5) var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>

        {/* ── Disability Needs ── */}
        <section aria-labelledby="needs-heading">
          <h2 id="needs-heading" style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 4 }}>
            My Disability Profile
          </h2>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', marginBottom: 'var(--sp-4)' }}>
            Select all that apply. This personalises your AI recommendations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 'var(--sp-3)' }}>
            {USER_NEEDS.map((need, i) => {
              const active = profile.needs.includes(need.id);
              return (
                <motion.button
                  key={need.id}
                  onClick={() => handleNeedToggle(need)}
                  aria-pressed={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: 'var(--sp-4)',
                    borderRadius: 'var(--r-xl)',
                    border: `2px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                    background: active ? 'var(--clr-primary-light)' : 'var(--clr-bg-card)',
                    cursor: 'pointer',
                    boxShadow: active ? '0 4px 16px rgba(37,99,235,0.15)' : 'var(--shadow-sm)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <span style={{ fontSize: 28 }} aria-hidden="true">{need.icon}</span>
                  <span style={{
                    fontSize: 'var(--fs-xs)',
                    fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                    color: active ? 'var(--clr-primary)' : 'var(--clr-text-secondary)',
                    textAlign: 'center', lineHeight: 'var(--lh-tight)',
                  }}>
                    {need.label}
                  </span>
                  {active && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--clr-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 'var(--fw-bold)',
                      }}
                      aria-hidden="true"
                    >✓</motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Medical Records Portal ── */}
        <section aria-labelledby="records-heading">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => { tap(); navigate('/medical-records'); }}
            style={{
              background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-secondary))',
              borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', color: '#fff', boxShadow: 'var(--shadow-md)',
            }}
          >
            <div>
              <h2 id="records-heading" style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-extrabold)', marginBottom: 4 }}>
                My Medical Records
              </h2>
              <p style={{ fontSize: 'var(--fs-sm)', opacity: 0.9 }}>
                View prescriptions and health alerts
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: '50%' }}>
              <FileText size={24} />
            </div>
          </motion.div>
        </section>

        {/* ── A11y Toggles ── */}
        <section aria-labelledby="a11y-heading">
          <h2 id="a11y-heading" style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-3)' }}>
            ⚙️ Accessibility Settings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <A11yToggle
              id="simple-mode"
              label="Simple Mode"
              description="Simplified layout with fewer animations for better focus"
              checked={simpleMode}
              onChange={() => { tap(); toggleSimpleMode(); }}
            />
            <A11yToggle
              id="large-targets"
              label="Oversized Tap Targets"
              description="Increases button sizes and padding for easier tapping"
              checked={largeTapTargets}
              onChange={() => { tap(); toggleLargeTargets(); }}
            />
            <A11yToggle
              id="reading-ruler"
              label="Reading Focus Ruler"
              description="Dims screen to help track reading lines"
              checked={readingRuler}
              onChange={() => { tap(); toggleReadingRuler(); }}
            />
            <A11yToggle
              id="high-contrast"
              label="High Contrast Mode"
              description="Dark theme with high-contrast colors (WCAG AAA)"
              checked={highContrast}
              onChange={handleHighContrast}
            />
            <A11yToggle
              id="dyslexia-font"
              label="Dyslexia-Friendly Font"
              description="Switches all text to OpenDyslexic"
              checked={dyslexiaFont}
              onChange={handleDyslexia}
            />
            <A11yToggle
              id="tts"
              label="Text-to-Speech"
              description="Reads page content aloud as you navigate"
              checked={ttsEnabled}
              onChange={handleTts}
            />
          </div>

          {/* Live TTS test button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              tap();
              speak(
                `Text to speech is ${ttsEnabled ? 'enabled' : 'disabled'}. Your name is ${profile.name}. You have selected ${profile.needs.length} accessibility needs.`,
                { force: true }
              );
            }}
            style={{
              marginTop: 12, width: '100%', padding: '12px',
              borderRadius: 'var(--r-lg)',
              border: '2px solid var(--clr-border)',
              background: 'var(--clr-bg-card)',
              color: 'var(--clr-text-secondary)',
              fontWeight: 'var(--fw-medium)', fontSize: 'var(--fs-sm)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            aria-label="Test text to speech"
          >
            🔊 Test Text-to-Speech
          </motion.button>
        </section>

        {/* ── Font Size ── */}
        <section aria-labelledby="fontsize-heading">
          <h2 id="fontsize-heading" style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 'var(--sp-3)' }}>
            🔠 Text Size
          </h2>
          <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
            {[{ value: 'base', label: 'A', size: 14, name: 'Normal' }, { value: 'lg', label: 'A', size: 18, name: 'Large' }, { value: 'xl', label: 'A', size: 22, name: 'Extra Large' }].map(opt => (
              <motion.button
                key={opt.value}
                onClick={() => handleFontSize(opt.value)}
                aria-pressed={fontSize === opt.value}
                aria-label={`Set text size to ${opt.name}`}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1, padding: 'var(--sp-4)', borderRadius: 'var(--r-lg)',
                  border: `2px solid ${fontSize === opt.value ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                  background: fontSize === opt.value ? 'var(--clr-primary-light)' : 'var(--clr-bg-card)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  color: fontSize === opt.value ? 'var(--clr-primary)' : 'var(--clr-text-secondary)',
                  transition: 'all var(--transition-base)',
                }}
              >
                <span style={{ fontWeight: 'var(--fw-bold)', fontSize: opt.size }}>{opt.label}</span>
                <span style={{ fontSize: 10 }}>{opt.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* App Info */}
        <section style={{
          background: 'var(--clr-bg-secondary)', borderRadius: 'var(--r-xl)',
          padding: 'var(--sp-5)', border: '1px solid var(--clr-border)', textAlign: 'center',
        }}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>♿</p>
          <p style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 4 }}>AccessCare</p>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)', lineHeight: 'var(--lh-relaxed)' }}>
            Empowering individuals with disabilities to access healthcare with dignity and ease.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>WCAG AA Compliant</span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>v1.0.0 · © 2026</span>
          </div>
        </section>
      </div>
    </div>
  );
}
