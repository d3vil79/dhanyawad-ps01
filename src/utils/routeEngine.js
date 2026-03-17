/**
 * routeEngine.js
 * 
 * Simulates accessible waypoints (ramps, elevators, flat paths)
 * along a given GeoJSON route coordinate path.
 */

// Generate reproducible but pseudo-random numbers based on string seed
function seededRandom(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function generateAccessibleWaypoints(geojson) {
  if (!geojson || !geojson.coordinates || geojson.coordinates.length < 5) return [];

  // OSRM returns coordinates as [lng, lat]
  const coords = geojson.coordinates;
  const waypoints = [];
  
  // Use the first and last coordinate as a seed so the waypoints are stable for the same route
  const seed = `${coords[0][0]},${coords[coords.length-1][0]}`;
  const rand = seededRandom(seed);
  const rand01 = () => (rand() % 1000) / 1000;

  // We want ~3 waypoints for a short route, more for longer ones
  const numWaypoints = Math.max(2, Math.floor(coords.length / 15));
  const types = ['ramp', 'elevator', 'flat_crossing', 'wide_path'];

  // Spread them somewhat evenly along the route
  const step = Math.floor(coords.length / (numWaypoints + 1));

  for (let i = 1; i <= numWaypoints; i++) {
    // Add some jitter to the index
    const jitter = Math.floor(rand01() * step * 0.5);
    const idx = Math.min(coords.length - 2, (i * step) + jitter);
    
    if (idx > 0 && idx < coords.length) {
      const type = types[Math.floor(rand01() * types.length)];
      waypoints.push({
        id: `wp_${idx}`,
        type,
        coords: coords[idx], // [lng, lat]
        label: getLabelForType(type)
      });
    }
  }

  return waypoints;
}

function getLabelForType(type) {
  switch(type) {
    case 'ramp': return 'Accessible Ramp';
    case 'elevator': return 'Public Elevator';
    case 'flat_crossing': return 'Dropped Kerb Crossing';
    case 'wide_path': return 'Wide Smooth Path';
    default: return 'Accessible Point';
  }
}
