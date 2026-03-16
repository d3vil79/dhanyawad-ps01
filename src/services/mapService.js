import L from 'leaflet';
import { scoreColor } from '../utils/scoreCalculator';

// Fix default icon paths broken by Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function createCustomIcon(score) {
  const color = scoreColor(score);
  const html = `
    <div style="
      position:relative;
      width:36px;
      height:36px;
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        position:absolute;
        inset:0;
        border-radius:50%;
        background:${color}30;
        animation:pin-pulse 2s infinite ease-out;
      "></div>
      <div style="
        width:28px;
        height:28px;
        border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 2px 8px ${color}60;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:10px;
        font-weight:700;
        color:white;
        position:relative;
        z-index:1;
      ">${score}</div>
    </div>
  `;
  return L.divIcon({ className: '', html, iconSize: [36, 36], iconAnchor: [18, 18] });
}
