import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNearby } from '../../hooks/useNearby';
import { useLocationStore } from '../../contexts/useLocationStore';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useHaptics } from '../../hooks/useHaptics';
import { createCustomIcon } from '../../services/mapService';
import { BottomSheet } from '../../components/map/BottomSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Locate, MapPin } from 'lucide-react';

/**
 * Inner component — auto-pans map when user's real GPS coords arrive.
 */
function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.lat, coords.lng], 14, { animate: true });
  }, [coords.lat, coords.lng]);
  return null;
}

function RecenterBtn({ coords, onPress }) {
  const map = useMap();
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => { map.setView([coords.lat, coords.lng], 15, { animate: true }); onPress?.(); }}
      aria-label="Center map on my location"
      style={{
        position: 'absolute', bottom: 96, right: 16, zIndex: 999,
        width: 48, height: 48, borderRadius: '50%',
        background: '#fff', border: '1.5px solid var(--clr-border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}
    >
      <Locate size={22} color="var(--clr-primary)" />
    </motion.button>
  );
}

export default function MapDiscovery() {
  const { coords, hasRealLocation, fetchLocation, watchLocation, loading, error } = useLocationStore();
  const { speak } = useAccessibilityStore();
  const { tap } = useHaptics();
  const { facilities } = useNearby();
  const [selected, setSelected] = useState(null);
  const [locToast, setLocToast] = useState('');

  // Start GPS watch when map mounts
  useEffect(() => {
    speak('Map view. Showing accessible facilities near you.');
    const stopWatch = watchLocation();
    return stopWatch;
  }, []);

  // Show GPS toast when real location is acquired
  useEffect(() => {
    if (hasRealLocation) {
      setLocToast('📍 Using your real GPS location');
      setTimeout(() => setLocToast(''), 3000);
    }
  }, [hasRealLocation]);

  const handleMarkerClick = (f) => {
    tap();
    setSelected(f);
    speak(`${f.name}. Score ${f.score} out of 10. ${f.distance.toFixed(1)} kilometres away.`);
  };

  const handleRecenter = () => {
    tap();
    speak('Recentered map to your location.');
  };

  return (
    <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden' }}>
      <h1 className="sr-only">Map Discovery — Find Accessible Facilities</h1>

      {/* Top overlay */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 500,
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--clr-border)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-base)', color: 'var(--clr-text-primary)' }}>
            Nearby Facilities
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <MapPin size={11} color={hasRealLocation ? 'var(--clr-secondary)' : 'var(--clr-text-muted)'} />
            <p style={{ fontSize: 'var(--fs-xs)', color: hasRealLocation ? 'var(--clr-secondary)' : 'var(--clr-text-muted)' }}>
              {error ? error : hasRealLocation ? 'Live GPS' : 'Default location'}
              {' · '}{facilities.length} facilities
            </p>
          </div>
        </div>

        {/* Locate button in header */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tap(); fetchLocation(); speak('Fetching your GPS location.'); }}
          aria-label="Update GPS location"
          disabled={loading}
          style={{
            padding: '7px 14px', borderRadius: 'var(--r-full)',
            border: '1.5px solid var(--clr-primary)',
            background: 'var(--clr-primary-light)',
            color: 'var(--clr-primary)',
            fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <Locate size={13} /> {loading ? 'Locating…' : 'Locate Me'}
        </motion.button>

        {/* Score legend */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[{ color: '#059669', label: 'Great' }, { color: '#D97706', label: 'OK' }, { color: '#DC2626', label: 'Poor' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: 'var(--clr-text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* GPS Toast */}
      <AnimatePresence>
        {locToast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
              zIndex: 600, background: 'var(--clr-secondary)',
              color: '#fff', padding: '6px 16px', borderRadius: 'var(--r-full)',
              fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
              whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
            }}
          >
            {locToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaflet Map */}
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Auto-pan when GPS updates */}
        <MapController coords={coords} />

        {/* Facility markers */}
        {facilities.map(f => (
          <Marker
            key={f.id}
            position={[f.coords.lat, f.coords.lng]}
            icon={createCustomIcon(f.score)}
            eventHandlers={{ click: () => handleMarkerClick(f) }}
            alt={`${f.name}, accessibility score ${f.score}`}
          />
        ))}

        {/* User location */}
        <Marker
          position={[coords.lat, coords.lng]}
          icon={createCustomIcon('📍')}
          alt="Your current location"
        />

        <RecenterBtn coords={coords} onPress={handleRecenter} />
      </MapContainer>

      {/* BottomSheet preview */}
      <BottomSheet facility={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
