import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Navigation } from 'lucide-react';
import { ScoreBadge } from '../facility/ScoreBadge';
import { formatDistance } from '../../utils/formatters';
import { useHaptics } from '../../hooks/useHaptics';

export function BottomSheet({ facility, onClose, userCoords, onRouteCalculated }) {
  const navigate = useNavigate();
  const { tap } = useHaptics();
  const [routing, setRouting] = useState(false);
  const [showingRouteOptions, setShowingRouteOptions] = useState(false);

  const handleCalculateRoute = async (type) => {
    if (!userCoords || !facility) return;
    tap();
    setRouting(true);
    try {
      // OSRM expects coordinates in lng,lat format
      const sx = userCoords.lng;
      const sy = userCoords.lat;
      const dx = facility.coords.lng;
      const dy = facility.coords.lat;
      
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${sx},${sy};${dx},${dy}?overview=full&geometries=geojson`);
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes.length > 0) {
        onRouteCalculated(data.routes[0].geometry, facility, type);
        onClose(); // Hide sheet so user can see the route
      }
    } catch (e) {
      console.error("OSRM routing error:", e);
    } finally {
      setRouting(false);
    }
  };

  return (
    <AnimatePresence>
      {facility && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 90,
            }}
          />
          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Preview of ${facility.name}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            style={{
              position: 'absolute',
              bottom: 80,
              left: 0,
              right: 0,
              zIndex: 100,
              background: 'var(--clr-bg-card)',
              borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
              boxShadow: 'var(--shadow-xl)',
              padding: 'var(--sp-6)',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: 'var(--clr-border)',
              margin: '0 auto var(--sp-4)',
            }} aria-hidden="true" />

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close preview"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--clr-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
              }}
            >
              <X size={16} color="var(--clr-text-muted)" />
            </button>

            <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start' }}>
              <img
                src={facility.images[0]}
                alt={facility.name}
                style={{ width: 80, height: 80, borderRadius: 'var(--r-lg)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>{facility.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MapPin size={12} color="var(--clr-text-muted)" />
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-muted)' }}>
                    {formatDistance(facility.distance)}
                  </span>
                </div>
                <ScoreBadge score={facility.score} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
              <button
                onClick={() => { tap(); setShowingRouteOptions(true); }}
                disabled={routing || !userCoords}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--clr-secondary)',
                  color: '#fff',
                  fontWeight: 'var(--fw-semibold)',
                  fontSize: 'var(--fs-base)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: routing ? 0.7 : 1,
                }}
              >
                <Navigation size={18} />
                {routing ? 'Routing…' : 'Navigate'}
              </button>
              
              <button
                onClick={() => navigate(`/facility/${facility.id}`)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--clr-primary)',
                  color: '#fff',
                  fontWeight: 'var(--fw-semibold)',
                  fontSize: 'var(--fs-base)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Full Details →
              </button>
            </div>

            {/* Route Options Overlay */}
            <AnimatePresence>
              {showingRouteOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    position: 'absolute', inset: 0, background: 'var(--clr-bg-card)', zIndex: 110,
                    borderRadius: 'var(--r-xl) var(--r-xl) 0 0', padding: 'var(--sp-6)',
                    display: 'flex', flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Navigation size={18} color="var(--clr-primary)" /> Choose Route
                    </h3>
                    <button onClick={() => { tap(); setShowingRouteOptions(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={20} color="var(--clr-text-muted)" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCalculateRoute('accessible')}
                      disabled={routing}
                      style={{
                        background: 'linear-gradient(135deg,#EFF6FF,#F0FDF4)', border: '1.5px solid var(--clr-primary)',
                        padding: 16, borderRadius: 'var(--r-lg)', textAlign: 'left', cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', overflow: 'hidden'
                      }}
                    >
                      <div style={{ fontSize: 24 }}>♿</div>
                      <div>
                        <p style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)', fontSize: 'var(--fs-sm)', marginBottom: 2 }}>Barrier-Free Route</p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-secondary)', lineHeight: 1.3 }}>Prioritises ramps, smooth paths, and elevators. Avoids stairs.</p>
                      </div>
                      {routing && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'var(--clr-primary)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-xs)' }}>Calculating...</span></div>}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCalculateRoute('standard')}
                      disabled={routing}
                      style={{
                        background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                        padding: 16, borderRadius: 'var(--r-lg)', textAlign: 'left', cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', overflow: 'hidden'
                      }}
                    >
                      <div style={{ fontSize: 24, paddingLeft: 4, width: 28, overflow: 'hidden' }}>🚶</div>
                      <div>
                        <p style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', fontSize: 'var(--fs-sm)', marginBottom: 2 }}>Standard Route</p>
                        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-secondary)', lineHeight: 1.3 }}>Fastest path. May include stairs or steep inclines.</p>
                      </div>
                      {routing && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'var(--clr-text-primary)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-xs)' }}>Calculating...</span></div>}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
