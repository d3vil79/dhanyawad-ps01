/**
 * nlpSearch.js
 * 
 * A heuristic NLP parser that extracts intent, categories, and features 
 * from natural language search queries.
 */

const FACILITY_TYPES = [
  { keywords: ['hospital', 'medical center', 'healthcare'], type: 'hospital' },
  { keywords: ['clinic', 'doctor', 'dispensary'], type: 'clinic' },
  { keywords: ['pharmacy', 'chemist', 'drugstore'], type: 'pharmacy' },
  { keywords: ['dentist', 'dental'], type: 'dentist' },
];

const CATEGORY_MAP = {
  'wheelchair': 'wheelchair',
  'mobility': 'wheelchair',
  'ramp': 'wheelchair',
  'elevator': 'wheelchair',
  'lift': 'wheelchair',
  'blind': 'visual',
  'visual': 'visual',
  'braille': 'visual',
  'contrast': 'visual',
  'hearing': 'hearing',
  'deaf': 'hearing',
  'interpreter': 'hearing',
  'sign language': 'hearing',
  'asl': 'hearing',
  'mental': 'mental',
  'autism': 'mental',
  'sensory': 'mental',
  'quiet': 'mental',
};

const FEATURE_KEYWORDS = [
  'mri', 'scanner', 'interpreter', 'ramp', 'parking', 'braille', 'washroom', 'elevator', 'navigator'
];

export function parseSearchIntent(query) {
  if (!query || query.length < 3) return null;

  const q = query.toLowerCase();
  
  // 1. Extract Facility Type
  let facilityType = null;
  for (const ft of FACILITY_TYPES) {
    if (ft.keywords.some(k => q.includes(k))) {
      facilityType = ft.type;
      break;
    }
  }

  // 2. Extract Categories
  const categories = [];
  Object.keys(CATEGORY_MAP).forEach(k => {
    if (q.includes(k)) {
      const cat = CATEGORY_MAP[k];
      if (!categories.includes(cat)) {
        categories.push(cat);
      }
    }
  });

  // 3. Extract Specific Features
  const features = FEATURE_KEYWORDS.filter(f => q.includes(f));

  // 4. Intent detection (nearby)
  const isNearbyIntent = q.includes('near me') || q.includes('nearby') || q.includes('closest') || q.includes('around');

  // 5. Clean query (remove stop words)
  const stopWords = ['find', 'a', 'the', 'with', 'and', 'my', 'me', 'near', 'nearby', 'closest', 'around', 'of', 'in', 'at'];
  let cleanQuery = q;
  stopWords.forEach(sw => {
    const regex = new RegExp(`\\b${sw}\\b`, 'g');
    cleanQuery = cleanQuery.replace(regex, '');
  });
  cleanQuery = cleanQuery.trim().split(/\s+/).join(' ');

  return {
    facilityType,
    categories,
    features,
    isNearbyIntent,
    cleanQuery,
    originalQuery: query,
    isComplex: categories.length > 0 || features.length > 0 || facilityType !== null
  };
}
