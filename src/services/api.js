export const getMockFallbackFacilities = (lat, lng) => [
  {
    id: 'mock-1',
    name: 'Metropolis Complete Care Hospital',
    address: '1000 Wellness Blvd, Metropolis',
    distance: 2.5,
    score: 9.8,
    categories: ['wheelchair', 'visual', 'cognitive', 'hearing', 'sensory'],
    hours: 'Open 24/7',
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { lat: lat + 0.012, lng: lng + 0.015 },
    verified: true,
    alert: null,
    reviews: [
      { id: 'r1', author: 'Sarah J.', rating: 10, text: 'Absolutely incredible facility. Wide doors, braille everywhere, and the staff is completely sensory-aware.', tags: ['Wheelchair Access', 'Sensory Friendly'] },
      { id: 'r2', author: 'Mark T.', rating: 9, text: 'The smart ramps and automatic doors make navigating here a breeze. Only issue was parking was slightly full.', tags: ['Parking'] }
    ]
  },
  {
    id: 'mock-2',
    name: 'Sunrise Community & Rehabilitation Clinic',
    address: '456 Oak Ave, District 4',
    distance: 4.2,
    score: 8.2,
    categories: ['wheelchair', 'hearing'],
    hours: '9:00 AM - 6:00 PM',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1538108149393-cebb47ac17e7?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { lat: lat - 0.015, lng: lng - 0.005 },
    verified: true,
    alert: { type: 'amber', message: 'Elevator B in the East Wing is currently under maintenance. Please use Elevator A.' },
    reviews: [
      { id: 'r3', author: 'David L.', rating: 8, text: 'Great hearing loops included at reception. The staff knew basic sign language which was incredibly comforting.', tags: ['ASL', 'Hearing Loop'] }
    ]
  },
  {
    id: 'mock-3',
    name: 'Pioneer Advanced Neurology Center',
    address: '88 Brainerd Lane, Tech District',
    distance: 7.1,
    score: 9.4,
    categories: ['cognitive', 'visual', 'sensory'],
    hours: '8:00 AM - 8:00 PM',
    images: [
      'https://images.unsplash.com/photo-1551076805-e166946c9eb9?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { lat: lat + 0.025, lng: lng - 0.02 },
    verified: true,
    alert: null,
    reviews: [
      { id: 'r4', author: 'Emily R.', rating: 10, text: 'They have a dedicated quiet room for cognitive overload. The lighting is soft, not fluorescent. Perfect.', tags: ['Quiet Room', 'Lighting'] },
      { id: 'r5', author: 'Jon W.', rating: 9, text: 'Clear high-contrast signage helped my mother navigate independently.', tags: ['Signage', 'Visual'] }
    ]
  },
  {
    id: 'mock-4',
    name: 'Valley Emergency Orthopedics',
    address: '12 River Road, West Valley',
    distance: 12.4,
    score: 7.5,
    categories: ['wheelchair'],
    hours: '24/7 Trauma Center',
    images: [
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=800'
    ],
    coords: { lat: lat - 0.03, lng: lng + 0.025 },
    verified: false,
    alert: { type: 'red', message: 'Temporary closure of the main wheelchair ramp due to frozen pipes. Temporary ramp installed at North entrance.' },
    reviews: [
      { id: 'r6', author: 'Pete.', rating: 7, text: 'Getting inside was tricky because of the ramp closure, but the doctors are amazing.', tags: ['Ramp Issue'] }
    ]
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
        reviews: []
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
        reviews: []
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
