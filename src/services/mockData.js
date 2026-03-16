export const FACILITIES = [
  {
    id: '1',
    name: 'Sunrise General Hospital',
    address: '123 Wellness Blvd, Downtown',
    phone: '+1 (555) 234-5678',
    coords: { lat: 28.6139, lng: 77.2090 },
    distance: 0.8,
    score: 9.2,
    categories: ['wheelchair', 'visual', 'hearing'],
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Ramp at main entrance', available: true },
          { name: 'Accessible parking (10 bays)', available: true },
          { name: 'Wheelchair-accessible washrooms', available: true },
          { name: 'Elevator to all floors', available: true },
          { name: 'Motorized wheelchair available', available: false },
        ],
      },
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'Braille signage throughout', available: true },
          { name: 'Tactile floor paths', available: true },
          { name: 'Audio navigation system', available: true },
          { name: 'High-contrast signage', available: true },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter on staff', available: true },
          { name: 'Visual alert systems', available: true },
          { name: 'Video relay service', available: true },
          { name: 'Hearing loop system', available: false },
        ],
      },
      mental: {
        label: 'Mental Health Support',
        items: [
          { name: 'Quiet waiting area', available: true },
          { name: 'Sensory-friendly environment', available: true },
          { name: 'Mental health navigator', available: true },
        ],
      },
    },
    alert: null,
    reviews: [
      { id: 'r1', author: 'Priya M.', rating: 9, date: '2026-03-10', text: 'The tactile paths truly helped our guide dog navigate. Exemplary staff.', tags: ['Tactile paths', 'Kind staff'], proofImage: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=300&q=80' },
      { id: 'r2', author: 'Robert K.', rating: 10, date: '2026-03-08', text: 'Best accessible hospital I have visited. ASL interpreters were ready immediately.', tags: ['ASL available', 'No wait'] },
    ],
    hours: 'Open 24 hours',
    verified: true,
  },
  {
    id: '2',
    name: 'ClearPath Medical Center',
    address: '45 Horizon St, Midtown',
    phone: '+1 (555) 987-6543',
    coords: { lat: 28.6200, lng: 77.2150 },
    distance: 1.4,
    score: 7.8,
    categories: ['wheelchair', 'hearing'],
    images: [
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Ramp at main entrance', available: true },
          { name: 'Accessible parking (5 bays)', available: true },
          { name: 'Wheelchair-accessible washrooms', available: true },
          { name: 'Elevator to all floors', available: false },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter (scheduled)', available: true },
          { name: 'Visual alert systems', available: true },
          { name: 'Hearing loop system', available: true },
        ],
      },
    },
    alert: { type: 'amber', message: 'Main elevator out of service. Service lift available via east wing.' },
    reviews: [
      { id: 'r3', author: 'Mohammed A.', rating: 8, date: '2026-03-06', text: 'Good ramps but the elevator issue is frustrating.', tags: ['Good ramps', 'Elevator issue'] },
    ],
    hours: 'Mon–Sat 8am–8pm',
    verified: true,
  },
  {
    id: '3',
    name: 'Vista Community Clinic',
    address: '789 Park Ave, East Side',
    phone: '+1 (555) 345-6789',
    coords: { lat: 28.6080, lng: 77.2180 },
    distance: 2.1,
    score: 6.5,
    categories: ['visual', 'mental'],
    images: [
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
    ],
    features: {
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'Braille signage (partial)', available: true },
          { name: 'Tactile floor paths', available: false },
          { name: 'High-contrast signage', available: true },
        ],
      },
      mental: {
        label: 'Mental Health Support',
        items: [
          { name: 'Quiet waiting area', available: true },
          { name: 'Mental health navigator', available: false },
        ],
      },
    },
    alert: null,
    reviews: [
      { id: 'r4', author: 'Sarah L.', rating: 7, date: '2026-02-28', text: 'Nice quiet area but could use more visual navigation aids.', tags: ['Quiet', 'Needs improvement'] },
    ],
    hours: 'Mon–Fri 9am–6pm',
    verified: false,
  },
  {
    id: '4',
    name: 'HorizonCare Specialty Hospital',
    address: '12 Meridian Road, Northgate',
    phone: '+1 (555) 111-2233',
    coords: { lat: 28.6300, lng: 77.2050 },
    distance: 3.0,
    score: 8.5,
    categories: ['wheelchair', 'visual', 'hearing', 'mental'],
    images: [
      'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=800&q=80',
      'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Ramp at all entrances', available: true },
          { name: 'Accessible parking (12 bays)', available: true },
          { name: 'Power-assisted doors', available: true },
          { name: 'Motorized wheelchair available', available: true },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter on staff', available: true },
          { name: 'Real-time captioning', available: true },
        ],
      },
    },
    alert: { type: 'red', message: 'EMERGENCY: North wing ramp closed for emergency repairs. Use south entrance.' },
    reviews: [],
    hours: 'Open 24 hours',
    verified: true,
  },
  {
    id: '5',
    name: 'Meadows Family Health',
    address: '55 Greenway Lane, Suburbs',
    phone: '+1 (555) 444-5566',
    coords: { lat: 28.6020, lng: 77.2000 },
    distance: 4.5,
    score: 5.2,
    categories: ['wheelchair'],
    images: [
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Ramp at main entrance', available: true },
          { name: 'Accessible parking', available: false },
          { name: 'Wheelchair-accessible washrooms', available: false },
        ],
      },
    },
    alert: null,
    reviews: [],
    hours: 'Mon–Fri 8am–5pm',
    verified: false,
  },
  {
    id: '6',
    name: 'Nexus Rehabilitation Center',
    address: '30 Therapy Blvd, Westend',
    phone: '+1 (555) 777-8899',
    coords: { lat: 28.6150, lng: 77.1990 },
    distance: 1.9,
    score: 9.7,
    categories: ['wheelchair', 'visual', 'hearing', 'mental'],
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Full wheelchair access', available: true },
          { name: 'Lift at all levels', available: true },
          { name: 'Wide corridors', available: true },
        ],
      },
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'Complete tactile path system', available: true },
          { name: 'Audio navigation', available: true },
          { name: 'Braille everywhere', available: true },
        ],
      },
    },
    alert: null,
    reviews: [
      { id: 'r5', author: 'Anika J.', rating: 10, date: '2026-03-12', text: 'Absolutely gold standard for disability-inclusive care.', tags: ['Gold standard', 'Inclusive'] },
    ],
    hours: 'Mon–Sun 7am–9pm',
    verified: true,
  },
];

export const CATEGORIES = [
  { id: 'wheelchair', label: 'Wheelchair', icon: '♿', color: '#2563EB' },
  { id: 'visual',    label: 'Visual',     icon: '👁',  color: '#7C3AED' },
  { id: 'hearing',   label: 'Hearing',    icon: '👂',  color: '#0891B2' },
  { id: 'mental',    label: 'Mental',     icon: '🧠',  color: '#059669' },
];

export const USER_NEEDS = [
  { id: 'wheelchair',  label: 'Wheelchair User',      icon: '♿' },
  { id: 'visual',      label: 'Visual Impairment',    icon: '👁' },
  { id: 'hearing',     label: 'Hearing Impairment',   icon: '👂' },
  { id: 'mental',      label: 'Mental Health',         icon: '🧠' },
  { id: 'motor',       label: 'Motor Difficulty',      icon: '🤲' },
  { id: 'chronic',     label: 'Chronic Condition',    icon: '💊' },
  { id: 'cognitive',   label: 'Cognitive Support',    icon: '🔍' },
  { id: 'speech',      label: 'Speech Difficulty',    icon: '🗣' },
];
