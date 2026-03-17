import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Home, Map, User, Star, Type, Contrast, Maximize, Bell, LogOut, X, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAccessibilityStore } from '../contexts/useAccessibilityStore';
import { useHaptics } from '../hooks/useHaptics';
import { useAuthStore } from '../contexts/useAuthStore';

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: Home,  announce: 'Home page. Find accessible healthcare near you.' },
  { to: '/map',     label: 'Map',     Icon: Map,   announce: 'Map view. Explore nearby accessible facilities on a map.' },
  { to: '/review',  label: 'Review',  Icon: Star,  announce: 'Submit a review. Share your accessibility experience.' },
  { to: '/profile', label: 'Profile', Icon: User,  announce: 'Profile page. Manage your accessibility settings.' },
];

export function MainAppLayout({ children }) {
  const [sosActive, setSosActive] = useState(false);
  const [rulerY, setRulerY] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const NOTIFICATIONS = [
    { id: 1, icon: '🏥', title: 'New Facility Nearby', body: 'Nexus Rehab Center (score 9.7) is 1.9km away.', time: '2 min ago', link: '/map' },
    { id: 2, icon: '⚠️', title: 'Accessibility Alert', body: 'North wing ramp closed at HorizonCare Hospital.', time: '18 min ago', link: '/map' },
    { id: 3, icon: '💬', title: 'Q&A Answer Posted', body: 'Your question about wheelchair access received a reply.', time: '1 hr ago', link: '/qna' },
    { id: 4, icon: '📋', title: 'Review Reminder', body: 'Rate your recent visit to Sunrise General.', time: '3 hrs ago', link: '/review' },
  ];

  const unreadCount = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id)).length;
  
  const { 
    speak, readingRuler,
    highContrast, toggleHighContrast,
    fontSize, setFontSize,
    largeTapTargets, toggleLargeTargets
  } = useAccessibilityStore();
  
  const { tap } = useHaptics();
  const location = useLocation();

  // Announce page changes to TTS
  useEffect(() => {
    const item = NAV_ITEMS.find(n => n.to === location.pathname);
    if (item) speak(item.announce);
  }, [location.pathname]);

  // Track mouse for reading ruler
  useEffect(() => {
    if (!readingRuler) return;
    const handleMove = (e) => setRulerY(e.clientY);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', (e) => setRulerY(e.touches[0].clientY));
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove); // cleanup touch
    };
  }, [readingRuler]);

  const handleSOS = () => {
    tap();
    if ('vibrate' in navigator) navigator.vibrate([120, 60, 120, 60, 300]);
    speak('Emergency SOS activated. Contacting emergency services.', { force: true });
    setSosActive(true);
    setTimeout(() => setSosActive(false), 4000);
  };

  const handleFontCycle = () => {
    tap();
    if (fontSize === 'base') setFontSize('lg');
    else if (fontSize === 'lg') setFontSize('xl');
    else setFontSize('base');
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--clr-bg)' }}>
      {/* Reading Ruler Overlay */}
      <div 
        className="reading-ruler-overlay" 
        style={{ top: rulerY }} 
        aria-hidden="true" 
      />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {children}
      </main>

      {/* ─── QUICK ACCESS A11Y FLOATING TOOLBAR ─── */}
      <div style={{
        position: 'fixed', top: '50%', right: 12, transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: 'var(--clr-bg-card)', padding: 6,
        borderRadius: 'var(--r-full)', boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--clr-border)', zIndex: 'var(--z-elevated)'
      }}>
        {/* Bell / Notifications */}
        <button
          onClick={() => { tap(); setNotifOpen(o => !o); }}
          aria-label={`Notifications — ${unreadCount} unread`}
          style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', background: notifOpen ? 'var(--clr-primary-light)' : 'transparent', color: notifOpen ? 'var(--clr-primary)' : 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid var(--clr-bg-card)' }} />
          )}
        </button>
        <button
          onClick={() => { tap(); if (fontSize === 'base') setFontSize('lg'); else if (fontSize === 'lg') setFontSize('xl'); else setFontSize('base'); }}
          aria-label="Cycle Text Size"
          style={{ width: 44, height: 44, borderRadius: '50%', background: fontSize !== 'base' ? 'var(--clr-primary-light)' : 'transparent', color: fontSize !== 'base' ? 'var(--clr-primary)' : 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Type size={20} />
        </button>
        <button
          onClick={() => { tap(); toggleHighContrast(); }}
          aria-label="Toggle High Contrast"
          style={{ width: 44, height: 44, borderRadius: '50%', background: highContrast ? 'var(--clr-primary-light)' : 'transparent', color: highContrast ? 'var(--clr-primary)' : 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Contrast size={20} />
        </button>
        <button
          onClick={() => { tap(); toggleLargeTargets(); }}
          aria-label="Toggle Oversized Buttons"
          style={{ width: 44, height: 44, borderRadius: '50%', background: largeTapTargets ? 'var(--clr-primary-light)' : 'transparent', color: largeTapTargets ? 'var(--clr-primary)' : 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Maximize size={20} />
        </button>
        {/* Logout */}
        <button
          onClick={() => { tap(); logout(); navigate('/auth/login'); }}
          aria-label="Sign out"
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'transparent', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} />
        </button>
      </div>

      {/* ─── NOTIFICATION PANEL ─── */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 300, maxWidth: '85vw',
              background: 'var(--clr-bg-card)', borderLeft: '1px solid var(--clr-border)',
              boxShadow: '-12px 0 40px rgba(0,0,0,0.12)', zIndex: 1000,
              display: 'flex', flexDirection: 'column',
            }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--clr-text-primary)' }}>Notifications</p>
                <p style={{ fontSize: 12, color: 'var(--clr-text-muted)' }}>Hi, {user?.name || 'there'} 👋</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {unreadCount > 0 && (
                  <button onClick={() => setReadNotifs(NOTIFICATIONS.map(n => n.id))} style={{ fontSize: 11, color: 'var(--clr-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Mark all read</button>
                )}
                <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', display: 'flex' }}><X size={18} /></button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {NOTIFICATIONS.map(n => {
                const isRead = readNotifs.includes(n.id);
                return (
                  <motion.div key={n.id} whileTap={{ scale: 0.98 }}
                    onClick={() => { setReadNotifs(r => [...r, n.id]); setNotifOpen(false); navigate(n.link); tap(); }}
                    style={{ padding: '14px 16px', borderBottom: '1px solid var(--clr-border)', display: 'flex', gap: 12, cursor: 'pointer', background: isRead ? 'transparent' : 'rgba(0,114,255,0.04)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 3 }}>
                        <p style={{ fontWeight: isRead ? 600 : 800, fontSize: 13, color: 'var(--clr-text-primary)', lineHeight: 1.3 }}>{n.title}</p>
                        {!isRead && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--clr-primary)', flexShrink: 0, marginTop: 3 }} />}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--clr-text-muted)', lineHeight: 1.4 }}>{n.body}</p>
                      <p style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginTop: 4 }}>{n.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for notification panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setNotifOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }} />
        )}
      </AnimatePresence>

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
        {NAV_ITEMS.map(({ to, label, Icon: NavIcon }) => (
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
                  <NavIcon
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
