import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, MapPin, Navigation, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';

const POI_ICONS = {
  elevator: '🛗',
  restroom: '♿',
  entrance: '🚪',
  parking: '🅿️',
  info: 'ℹ️',
};

export function IndoorMap({ isOpen, onClose, facility }) {
  const { tap } = useHaptics();
  const { speak } = useAccessibilityStore();
  const [currentFloor, setCurrentFloor] = useState(0);
  const [selectedPoi, setSelectedPoi] = useState(null);

  if (!isOpen || !facility?.floorPlan) return null;

  const { levels, poi } = facility.floorPlan;
  const filteredPoi = poi.filter(p => p.floor === currentFloor);

  const handleFloorChange = (idx) => {
    tap();
    setCurrentFloor(idx);
    setSelectedPoi(null);
    speak(`Switched to ${levels[idx]}. ${poi.filter(p => p.floor === idx).length} accessible markers found.`);
  };

  const handlePoiClick = (p) => {
    tap();
    setSelectedPoi(p);
    speak(`${p.label}. ${p.description}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'var(--clr-bg)', display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', borderBottom: '1px solid var(--clr-border)', zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)' }}>Indoor Map</h2>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>{facility.name} • {levels[currentFloor]}</p>
          </div>
          <button
            onClick={() => { tap(); onClose(); }}
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--clr-surface)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 20 }}>
          <div style={{
            width: '100%', height: '100%', maxWidth: 600, margin: '0 auto',
            position: 'relative', background: '#f8fafc', borderRadius: 24,
            border: '2px solid var(--clr-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Stylized Floor Grid */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* High Contrast Walls (Simulated) */}
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="var(--clr-text-primary)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="10" y1="50" x2="40" y2="50" stroke="var(--clr-text-primary)" strokeWidth="1" />
              <line x1="60" y1="50" x2="90" y2="50" stroke="var(--clr-text-primary)" strokeWidth="1" />
            </svg>

            {/* POI Markers */}
            {filteredPoi.map(p => (
              <motion.button
                key={p.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handlePoiClick(p)}
                style={{
                  position: 'absolute', left: `${p.coords.x}%`, top: `${p.coords.y}%`,
                  width: 36, height: 36, borderRadius: '50%',
                  background: selectedPoi?.id === p.id ? 'var(--clr-primary)' : '#fff',
                  border: `2px solid ${selectedPoi?.id === p.id ? '#fff' : 'var(--clr-primary)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 5, transform: 'translate(-50%, -50%)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <span style={{ fontSize: 18 }}>{POI_ICONS[p.type] || '📍'}</span>
              </motion.button>
            ))}

            {/* You Are Here */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                position: 'absolute', left: '20%', top: '85%',
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--clr-secondary)', border: '2px solid #fff',
                boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
              }}
            />
          </div>
        </div>

        {/* POI Details Tooltip */}
        <AnimatePresence>
          {selectedPoi && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              style={{
                position: 'absolute', bottom: 100, left: 16, right: 16,
                background: 'var(--clr-bg-card)', padding: 16, borderRadius: 'var(--r-xl)',
                boxShadow: '0 -4px 12px rgba(0,0,0,0.1)', border: '1.5px solid var(--clr-primary)',
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{POI_ICONS[selectedPoi.type]}</span>
                <div>
                  <h4 style={{ fontWeight: 'var(--fw-bold)', color: 'var(--clr-primary)' }}>{selectedPoi.label}</h4>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--clr-text-muted)' }}>Location Verified</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 1.5 }}>
                {selectedPoi.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floor Controls */}
        <div style={{
          padding: '16px 20px 40px', background: '#fff',
          borderTop: '1px solid var(--clr-border)', display: 'flex', gap: 12, overflowX: 'auto'
        }}>
          {levels.map((lvl, idx) => (
            <button
              key={lvl}
              onClick={() => handleFloorChange(idx)}
              style={{
                padding: '10px 20px', borderRadius: 'var(--r-lg)', whiteSpace: 'nowrap',
                background: currentFloor === idx ? 'var(--clr-primary)' : 'var(--clr-surface)',
                color: currentFloor === idx ? '#fff' : 'var(--clr-text-secondary)',
                border: '1.5px solid', borderColor: currentFloor === idx ? 'var(--clr-primary)' : 'var(--clr-border)',
                fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)', cursor: 'pointer'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
