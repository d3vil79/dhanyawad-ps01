import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, User, Star } from 'lucide-react';
import { useState } from 'react';
import { useAccessibilityStore } from '../contexts/useAccessibilityStore';
import { useHaptics } from '../hooks/useHaptics';

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: Home,  announce: 'Home page. Find accessible healthcare near you.' },
  { to: '/map',     label: 'Map',     Icon: Map,   announce: 'Map view. Explore nearby accessible facilities on a map.' },
  { to: '/review',  label: 'Review',  Icon: Star,  announce: 'Submit a review. Share your accessibility experience.' },
  { to: '/profile', label: 'Profile', Icon: User,  announce: 'Profile page. Manage your accessibility settings.' },
];

export function MainAppLayout({ children }) {
  const [sosActive, setSosActive] = useState(false);
  const { speak } = useAccessibilityStore();
  const { tap, error: errVib } = useHaptics();
  const location = useLocation();

  // Announce page changes to TTS
  useEffect(() => {
    const item = NAV_ITEMS.find(n => n.to === location.pathname);
    if (item) speak(item.announce);
  }, [location.pathname]);

  const handleSOS = () => {
    tap();
    if ('vibrate' in navigator) navigator.vibrate([120, 60, 120, 60, 300]);
    speak('Emergency SOS activated. Contacting emergency services.', { force: true });
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--clr-bg)' }}>
      {/* Main */}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {children}
      </main>

      {/* Floating SOS */}
      <motion.button
        onClick={handleSOS}
        aria-label="Emergency SOS — tap to alert emergency services"
        whileTap={{ scale: 0.88 }}
        animate={sosActive
          ? { scale: [1, 1.18, 1, 1.18, 1], backgroundColor: ['#DC2626', '#EF4444', '#DC2626', '#EF4444', '#DC2626'] }
          : {}}
        transition={{ duration: 0.6, repeat: sosActive ? 3 : 0 }}
        style={{
          position: 'fixed', bottom: 100, right: 20,
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--clr-alert-red)', color: '#fff',
          border: 'none', cursor: 'pointer',
          fontWeight: 'var(--fw-extrabold)', fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
          zIndex: 'var(--z-elevated)',
          letterSpacing: '0.05em',
        }}
      >
        SOS
      </motion.button>

      {/* SOS Toast */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{
              position: 'fixed', bottom: 165, right: 16, left: 16,
              maxWidth: 340, margin: '0 auto',
              background: '#FEF2F2', border: '1.5px solid var(--clr-alert-red)',
              borderRadius: 'var(--r-lg)', padding: '14px 16px',
              boxShadow: 'var(--shadow-xl)', zIndex: 'var(--z-toast)',
            }}
          >
            <p style={{ fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-alert-red)', marginBottom: 4 }}>
              🚨 SOS Activated
            </p>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
              Emergency services have been notified of your location. Stay calm — help is on the way.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--clr-bg-card)',
          borderTop: '1px solid var(--clr-border)',
          display: 'flex', alignItems: 'stretch',
          zIndex: 'var(--z-elevated)', height: 72,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
        }}
      >
        {NAV_ITEMS.map(({ to, label, Icon, announce }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            onClick={() => tap()}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  style={{
                    width: 38, height: 32, borderRadius: 'var(--r-md)',
                    background: isActive ? 'var(--clr-primary-light)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background var(--transition-base)',
                  }}
                >
                  <Icon
                    size={20}
                    color={isActive ? 'var(--clr-primary)' : 'var(--clr-text-muted)'}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                </motion.div>
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                  color: isActive ? 'var(--clr-primary)' : 'var(--clr-text-muted)',
                }}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{ position: 'absolute', top: 0, width: 24, height: 2, background: 'var(--clr-primary)', borderRadius: '0 0 2px 2px' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
