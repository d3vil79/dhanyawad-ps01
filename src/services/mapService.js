import { scoreColor } from '../utils/scoreCalculator';

// Lazily import Leaflet only when actually needed (browser context).
// Avoids top-level `import L from 'leaflet'` which causes Vite 500 errors
// when the CJS leaflet module is encountered during pre-bundling.
let _L = null;
async function getL() {
  if (!_L) {
    const leaflet = await import('leaflet');
    _L = leaflet.default ?? leaflet;
  }
  return _L;
}

let iconPatched = false;
function ensureIconPatched(L) {
  if (iconPatched) return;
  iconPatched = true;
  try {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  } catch (e) {
    // silently ignore if Leaflet not ready in this context
  }
}

function buildIconHtml(color, score) {
  return `
    <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:50%;background:${color}30;animation:pin-pulse 2s infinite ease-out;"></div>
      <div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px ${color}60;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:white;position:relative;z-index:1;">${score}</div>
    </div>
  `;
}

// Synchronous version — works when Leaflet is already loaded on window (e.g. react-leaflet context)
export function createCustomIcon(score) {
  // eslint-disable-next-line no-undef
  const L = (typeof window !== 'undefined' && window.L) ? window.L : null;
  if (!L) return null;
  ensureIconPatched(L);
  return L.divIcon({ className: '', html: buildIconHtml(scoreColor(score), score), iconSize: [36, 36], iconAnchor: [18, 18] });
}

// Async version — dynamically imports Leaflet when needed
export async function createCustomIconAsync(score) {
  const L = await getL();
  ensureIconPatched(L);
  return L.divIcon({ className: '', html: buildIconHtml(scoreColor(score), score), iconSize: [36, 36], iconAnchor: [18, 18] });
}
