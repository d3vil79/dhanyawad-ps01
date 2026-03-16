import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNearby } from '../../hooks/useNearby';
import { useLocationStore } from '../../contexts/useLocationStore';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { useHaptics } from '../../hooks/useHaptics';
import { createCustomIcon } from '../../services/mapService';
import { BottomSheet } from '../../components/map/BottomSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Locate, MapPin, Navigation2, X, Search, Map as MapIcon } from 'lucide-react';

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
      import('leaflet').then(({ default: L }) => {
        const geoLayer = L.geoJSON(routeGeoJSON);
        map.fitBounds(geoLayer.getBounds(), { padding: [50, 50], animate: true });
      });
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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Routing state
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);

  // Start GPS watch when map mounts
  useEffect(() => {
    speak('Map view. Showing accessible facilities near you.');
    const stopWatch = watchLocation();
    
    // Check if we came from Internal Navigation
    if (state?.routeTo && hasRealLocation) {
      handleAutoRouteLaunch(state.routeTo);
    }
    
    return stopWatch;
  }, []);

  // Show GPS toast when real location is acquired
  useEffect(() => {
    if (hasRealLocation) {
      setLocToast('📍 Using your real GPS location');
      setTimeout(() => setLocToast(''), 3000);
      
      // If we arrived internally before GPS locked, do it now
      if (state?.routeTo && !routeGeoJSON) {
        handleAutoRouteLaunch(state.routeTo);
      }
    }
  }, [hasRealLocation, state?.routeTo]);

  const handleAutoRouteLaunch = async (targetFacility) => {
    try {
      tap();
      const p1 = `${coords.lng},${coords.lat}`;
      const p2 = `${targetFacility.coords.lng},${targetFacility.coords.lat}`;
      const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${p1};${p2}?overview=full&geometries=geojson&steps=true`;
      const res = await fetch(osrmUrl);
      const data = await res.json();
      if (data.routes && data.routes[0]) {
        const steps = data.routes[0].legs[0]?.steps || [];
        handleRouteCalculated(data.routes[0].geometry, targetFacility, steps);
        setSelected(targetFacility); // Auto select the marker too
      }
    } catch (e) {
      console.error("OSRM route fetch failed", e);
    }
  };

  const handleMarkerClick = (f) => {
    tap();
    setSelected(f);
    speak(`${f.name}. Score ${f.score} out of 10. ${f.distance.toFixed(1)} kilometres away.`);
  };

  const handleRecenter = () => {
    tap();
    speak('Recentered map to your location.');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    tap();
    setIsSearching(true);
    speak(`Searching for ${searchQuery}`);
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newCoords = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        // We update the global coordinates so the map and Overpass queries recenter
        useLocationStore.setState({ coords: newCoords }); 
        setLocToast(`📍 Found: ${result.display_name.split(',')[0]}`);
        speak(`Found location. Showing accessible facilities near ${result.display_name.split(',')[0]}.`);
        setTimeout(() => setLocToast(''), 4000);
      } else {
        setLocToast('❌ Location not found');
        setTimeout(() => setLocToast(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setLocToast('❌ Search failed');
      setTimeout(() => setLocToast(''), 3000);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRouteCalculated = (geojson, targetFacility, steps = []) => {
    setRouteGeoJSON(geojson);
    setRouteTarget(targetFacility);
    
    // Process steps to ensure they have standard text instructions
    // OSRM provides raw maneuver data, we will extract or provide fallback text
    const processedSteps = steps.map(s => {
      let inst = s.maneuver?.instruction;
      if (!inst) {
         // Create basic instruction if OSRM doesn't bundle pre-localized text
         inst = `${s.maneuver.type} ${s.maneuver.modifier ? s.maneuver.modifier : ''} ${s.name ? 'onto ' + s.name : ''}`.trim();
      }
      return { instruction: inst, distance: s.distance };
    }).filter(s => s.distance > 0 && s.instruction.length > 3);

    setRouteSteps(processedSteps);
    speak(`Route calculated to ${targetFacility.name}. Follow the highlighted path.`);
  };

  const clearRoute = () => {
    tap();
    setRouteGeoJSON(null);
    setRouteTarget(null);
    setRouteSteps([]);
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

      {/* Floating Search Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          position: 'absolute', top: 76, left: 16, right: 16, zIndex: 490,
        }}
      >
        <form 
          onSubmit={handleSearch}
          style={{
            display: 'flex', alignItems: 'center', background: 'var(--clr-bg-card)',
            borderRadius: 'var(--r-xl)', padding: '4px 4px 4px 16px',
            boxShadow: 'var(--shadow-md)', border: '1px solid var(--clr-border)'
          }}
        >
          <Search size={18} color="var(--clr-text-muted)" />
          <input 
            type="text" 
            placeholder="Search city or address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              padding: '10px 12px', fontSize: 'var(--fs-sm)', color: 'var(--clr-text-primary)',
              fontFamily: 'inherit'
            }}
          />
          <button 
            type="submit"
            disabled={isSearching}
            style={{
              background: 'var(--clr-primary)', color: '#fff', border: 'none',
              padding: '10px 16px', borderRadius: 'var(--r-lg)', fontWeight: 'var(--fw-bold)',
              fontSize: 'var(--fs-xs)', cursor: 'pointer', transition: 'background 0.2s',
              opacity: isSearching ? 0.7 : 1
            }}
          >
            {isSearching ? '...' : 'Go'}
          </button>
        </form>
      </motion.div>

      {/* Active Route Header & Turn-by-Turn (replaces top overlay visually if navigating) */}
      <AnimatePresence>
        {routeTarget && (
          <motion.div
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 550,
              background: 'var(--clr-bg-card)', 
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Header Area */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--clr-primary)', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Navigation2 size={24} />
                <div>
                  <p style={{ fontSize: 'var(--fs-xs)', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigating to</p>
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
            </div>

            {/* Turn-by-Turn Directions Panel */}
            {routeSteps.length > 0 && (
              <div 
                style={{ 
                  maxHeight: '30vh', overflowY: 'auto', padding: '12px 16px',
                  borderBottom: '1px solid var(--clr-border)'
                }}
              >
                 <p style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-muted)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', gap: 4, alignItems: 'center' }}>
                   <MapIcon size={12} /> Turn-by-Turn Directions
                 </p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                   {routeSteps.map((step, i) => (
                     <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: i < routeSteps.length - 1 ? '1px solid var(--clr-surface)' : 'none' }}>
                       <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--clr-surface)', color: 'var(--clr-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                         {i + 1}
                       </div>
                       <div style={{ flex: 1 }}>
                         <p style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--clr-text-primary)' }}>
                           {step.instruction}
                         </p>
                         <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)', marginTop: 2 }}>
                           in {Math.round(step.distance)}m
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
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
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="High-Res Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* The active navigation route line */}
        {routeGeoJSON && (
          <GeoJSON 
            key={JSON.stringify(routeGeoJSON)} // Force re-render on new route
            data={routeGeoJSON} 
            style={{
              color: 'var(--clr-primary)',
              weight: 6,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '1, 10' // dotted styling for walking/driving path
            }}
          />
        )}

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
        onRouteCalculated={(geojson, target, steps) => handleRouteCalculated(geojson, target, steps)}
      />
    </div>
  );
}
