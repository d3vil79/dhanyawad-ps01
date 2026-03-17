import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNearby } from '../../hooks/useNearby';
import { useLocationStore } from '../../contexts/useLocationStore';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useHaptics } from '../../hooks/useHaptics';
import { createCustomIcon } from '../../services/mapService';
import { BottomSheet } from '../../components/map/BottomSheet';
import { generateAccessibleWaypoints } from '../../utils/routeEngine';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Locate, MapPin, Navigation2, X } from 'lucide-react';

/**
 * Inner component — auto-pans map when user's real GPS coords arrive.
 */
function MapController({ coords, routeGeoJSON }) {
  const map = useMap();

  useEffect(() => {
    // Only auto-pan to GPS if we aren't displaying a full route
    if (!routeGeoJSON) {
      map.setView([coords.lat, coords.lng], 14, { animate: true });
    }
  }, [coords.lat, coords.lng, routeGeoJSON]);

  // If a route is generated, fit map bounds to the route
  useEffect(() => {
    if (routeGeoJSON) {
      const geoLayer = L.geoJSON(routeGeoJSON);
      map.fitBounds(geoLayer.getBounds(), { padding: [50, 50], animate: true });
    }
  }, [routeGeoJSON]);

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
  const { state } = useLocation();
  const { coords, hasRealLocation, fetchLocation, watchLocation, loading, error } = useLocationStore();
  const { speak } = useAccessibilityStore();
  const { tap } = useHaptics();
  const { facilities } = useNearby();
  const [selected, setSelected] = useState(null);
  const [locToast, setLocToast] = useState('');

  // Routing state
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);
  const [routeType, setRouteType] = useState(null); // 'standard' | 'accessible'
  const [routeWaypoints, setRouteWaypoints] = useState([]);

  const handleRouteCalculated = (geojson, targetFacility, type = 'standard') => {
    setRouteGeoJSON(geojson);
    setRouteTarget(targetFacility);
    setRouteType(type);
    
    if (type === 'accessible') {
      setRouteWaypoints(generateAccessibleWaypoints(geojson));
      speak(`Barrier-free route calculated to ${targetFacility.name}. Highlighting accessible paths, ramps, and elevators.`);
    } else {
      setRouteWaypoints([]);
      speak(`Standard route calculated to ${targetFacility.name}.`);
    }
  };

  const handleAutoRouteLaunch = async (targetFacility) => {
    try {
      const p1 = `${coords.lng},${coords.lat}`;
      const p2 = `${targetFacility.coords.lng},${targetFacility.coords.lat}`;
      const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${p1};${p2}?overview=full&geometries=geojson`;
      const res = await fetch(osrmUrl);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        handleRouteCalculated(data.routes[0].geometry, targetFacility);
        setSelected(targetFacility); // Auto select the marker too
      }
    } catch (e) {
      console.error("OSRM route fetch failed", e);
    }
  };

  // Start GPS watch when map mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    speak('Map view. Showing accessible facilities near you.');
    const stopWatch = watchLocation();
    
    // Check if we came from Internal Navigation
    if (state?.routeTo && hasRealLocation) {
      setTimeout(() => handleAutoRouteLaunch(state.routeTo), 0);
    }
    
    return stopWatch;
  }, []);

  // Show GPS toast when real location is acquired
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasRealLocation) {
      setTimeout(() => setLocToast('📍 Using your real GPS location'), 0);
      setTimeout(() => setLocToast(''), 3000);
      
      // If we arrived internally before GPS locked, do it now
      if (state?.routeTo && !routeGeoJSON) {
        setTimeout(() => handleAutoRouteLaunch(state.routeTo), 0);
      }
    }
  }, [hasRealLocation, state?.routeTo]);

  const handleMarkerClick = (f) => {
    tap();
    setSelected(f);
    speak(`${f.name}. Score ${f.score} out of 10. ${f.distance.toFixed(1)} kilometres away.`);
  };

  const handleRecenter = () => {
    tap();
    speak('Recentered map to your location.');
  };

  const clearRoute = () => {
    tap();
    setRouteGeoJSON(null);
    setRouteTarget(null);
    setRouteType(null);
    setRouteWaypoints([]);
    speak('Navigation cancelled.');
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

      {/* Active Route Header (replaces top overlay visually if navigating) */}
      <AnimatePresence>
        {routeTarget && (
          <motion.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 550,
              background: 'var(--clr-primary)', color: '#fff',
              padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Navigation2 size={24} />
              <div>
                <p style={{ fontSize: 'var(--fs-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {routeType === 'accessible' ? '♿ Navigating Barrier-Free to' : 'Navigating to'}
                </p>
                <p style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-base)' }}>{routeTarget.name}</p>
              </div>
            </div>
            <button
              onClick={clearRoute}
              aria-label="Cancel navigation"
              style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff'
              }}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GPS Toast */}
      <AnimatePresence>
        {locToast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -10 }}
            animate={{ y: routeTarget ? 88 : 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: 68, left: '50%', transform: 'translateX(-50%)',
              zIndex: 600, background: 'var(--clr-secondary)',
              color: '#fff', padding: '6px 16px', borderRadius: 'var(--r-full)',
              fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
              whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)',
              transition: 'transform 0.3s ease',
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

        {/* The active navigation route line */}
        {routeGeoJSON && (
          <GeoJSON 
            key={JSON.stringify(routeGeoJSON) + routeType} // Force re-render on new route
            data={routeGeoJSON} 
            style={{
              color: routeType === 'accessible' ? '#10B981' : 'var(--clr-primary)',
              weight: 6,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: routeType === 'accessible' ? '12 8' : '1, 10' // dotted styling for walking/driving path
            }}
          />
        )}
        
        {/* Draw Accessible Waypoints along route */}
        {routeWaypoints.map(wp => {
          const emojiIcon = new L.DivIcon({
            html: `<div style="font-size:16px; background:#fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.2); border:2px solid #10B981">${wp.type === 'ramp' ? '♿' : wp.type === 'elevator' ? '🛗' : wp.type === 'flat_crossing' ? '🚶' : '🛤️'}</div>`,
            className: '',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });
          
          return (
            <Marker 
              key={wp.id} 
              position={[wp.coords[1], wp.coords[0]]} 
              icon={emojiIcon} 
            />
          );
        })}

        {/* Auto-pan when GPS updates or Route generates */}
        <MapController coords={coords} routeGeoJSON={routeGeoJSON} />

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
      <BottomSheet 
        facility={selected} 
        userCoords={coords}
        onClose={() => setSelected(null)} 
        onRouteCalculated={handleRouteCalculated}
      />
    </div>
  );
}
