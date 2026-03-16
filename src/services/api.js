export const getMockFallbackFacilities = (lat, lng) => [
  {
    id: 'mock-1',
    name: 'City General Hospital (Mock)',
    address: '123 Main St',
    distance: 2.5,
    score: 8.5,
    categories: ['wheelchair', 'visual', 'cognitive'],
    hours: 'Open 24/7',
    images: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'],
    coords: { lat: lat + 0.01, lng: lng + 0.01 },
    verified: true,
    alert: null
  },
  {
    id: 'mock-2',
    name: 'Sunrise Community Clinic (Mock)',
    address: '456 Oak Ave',
    distance: 4.2,
    score: 9.2,
    categories: ['wheelchair', 'hearing'],
    hours: '9:00 AM - 6:00 PM',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'],
    coords: { lat: lat - 0.015, lng: lng - 0.005 },
    verified: true,
    alert: { type: 'amber', message: 'Elevator B is currently under maintenance.' }
  }
];

// Hash function to make reliable mock scores/details from OSM IDs
function getPseudoRandomFeatures(osmId) {
  const seed = String(osmId).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  const score = 6.0 + ((seed % 40) / 10); // Between 6.0 and 9.9
  const isVerified = seed % 3 === 0;
  
  const allCategories = ['wheelchair', 'visual', 'hearing', 'cognitive', 'sensory'];
  const categories = [];
  categories.push(allCategories[seed % 5]);
  if (seed % 2 === 0) categories.push(allCategories[(seed + 1) % 5]);
  if (score > 8.5) categories.push(allCategories[(seed + 2) % 5]);
  
  const defaultImages = [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800', // Modern hospital exterior
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800', // Clinic exterior
    'https://images.unsplash.com/photo-1538108149393-cebb47ac17e7?auto=format&fit=crop&q=80&w=800', // Hospital hallway
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', // Clinic entrance
  ];
  const images = [defaultImages[seed % defaultImages.length]];
  
  let alert = null;
  if (seed % 7 === 0) alert = { type: 'amber', message: 'Main entrance ramp under construction. Please use the East entrance.' };
  if (seed % 11 === 0) alert = { type: 'red', message: 'Currently operating on backup generators. Non-emergency services may be delayed.' };

  return { score, verified: isVerified, categories, images, alert };
}

export async function fetchOSMFacilities(lat, lng, radiusRadiusInMeters = 5000) {
  // Query Overpass OSM API for hospitals, clinics, and doctors within radius
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:${radiusRadiusInMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusRadiusInMeters},${lat},${lng});
      node["amenity"="doctors"](around:${radiusRadiusInMeters},${lat},${lng});
    );
    out body 25;
  `;

  try {
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response from Overpass was not ok');
    
    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      console.warn('No real facilities found on OSM nearby. Falling back to mocks based on current GPS.');
      return getMockFallbackFacilities(lat, lng);
    }

    // Map raw OSM node to our known Facility schema
    return data.elements.map(node => {
      const p = node.tags;
      const pseudoFeatures = getPseudoRandomFeatures(node.id);
      
      const name = p.name || p.operator || p['name:en'] || 'Local Healthcare Facility';
      
      let address = 'Address not specified';
      if (p['addr:street']) {
        address = `${p['addr:housenumber'] ? p['addr:housenumber'] + ' ' : ''}${p['addr:street']}${p['addr:city'] ? ', ' + p['addr:city'] : ''}`;
      } else if (p['addr:full']) {
        address = p['addr:full'];
      }
      
      // Override categories if actual OSM accessibility tags exist
      let categories = pseudoFeatures.categories;
      if (p.wheelchair === 'yes') categories = [...new Set(['wheelchair', ...categories])];
      if (p.wheelchair === 'no') categories = categories.filter(c => c !== 'wheelchair');
      
      return {
        id: node.id.toString(),
        name,
        address,
        coords: { lat: node.lat, lng: node.lon },
        distance: 0, // This gets calculated dynamically by the hook
        score: pseudoFeatures.score,
        categories,
        hours: p.opening_hours || 'Contact for hours',
        images: pseudoFeatures.images,
        verified: pseudoFeatures.verified,
        alert: pseudoFeatures.alert,
        contact: p.phone ? { phone: p.phone } : undefined,
      };
    });

  } catch (error) {
    console.error("Overpass API error, falling back to mocks", error);
    return getMockFallbackFacilities(lat, lng);
  }
}

// Global cache for single-facility lookups without requesting OSM again
let cachedFacilities = [];

export function setFacilityCache(fetchedFacilities) {
  cachedFacilities = fetchedFacilities;
}

export async function getFacilityById(id) {
  // Check our live cache first
  const match = cachedFacilities.find(f => f.id === String(id));
  if (match) return match;
  
  // If not in cache, fallback to fetching specifically from OSM via ID
  if (id.startsWith('mock')) return getMockFallbackFacilities(0,0).find(f => f.id === id);

  try {
    const query = `[out:json];node(${id});out;`;
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.elements && data.elements.length > 0) {
      const node = data.elements[0];
      const p = node.tags;
      const pseudoFeatures = getPseudoRandomFeatures(node.id);
      return {
        id: node.id.toString(),
        name: p.name || 'Healthcare Facility',
        address: p['addr:full'] || 'Address unknown',
        coords: { lat: node.lat, lng: node.lon },
        score: pseudoFeatures.score,
        categories: pseudoFeatures.categories,
        hours: p.opening_hours || 'Contact for hours',
        images: pseudoFeatures.images,
        verified: pseudoFeatures.verified,
        alert: pseudoFeatures.alert,
      };
    }
  } catch(e) { /* ignore */ }
  
  return null;
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export async function submitReview(facilityId, review) {
  await delay(1000);
  return { success: true, id: Math.random().toString(36).slice(2), facilityId, ...review };
}

export async function pingPreArrival(facilityId, userNeeds) {
  await delay(1500);
  return { success: true, facilityId, estimatedResponse: '15–20 minutes', needs: userNeeds };
}
