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
      { id: 'r1', author: 'Priya M.', role: 'Disabled Individual', verified: true, rating: 9, date: '2026-03-10', text: 'The tactile paths truly helped our guide dog navigate. Exemplary staff.', tags: ['Tactile paths', 'Kind staff'] },
      { id: 'r2', author: 'Robert K.', role: 'Ally', verified: true, rating: 10, date: '2026-03-08', text: 'Best accessible hospital I have visited. ASL interpreters were ready immediately.', tags: ['ASL available', 'No wait'] },
    ],
    hours: 'Open 24 hours',
    verified: true,
    liveStatus: {
      waitTime: '8 mins',
      occupancy: 45,
      sensoryLevel: 'calm',
      alerts: []
    },
    specialists: [
      { id: 's1', name: 'Dr. Anita Desai', role: 'Chief Cardiologist', training: ['Wheelchair competency', 'Deaf culture & ASL basics'] },
      { id: 's2', name: 'Dr. Marcus Thorne', role: 'Senior Surgeon', training: ['Neurodiversity awareness'] }
    ],
    insuranceCoverage: {
      'BlueCross': ['Wheelchair navigation', 'ASL interpreter'],
      'Universal Health': ['All accessibility services'],
      'State Care': ['Mobility assistance']
    },
    floorPlan: {
      levels: ['Ground Floor', 'Level 1', 'Level 2'],
      poi: [
        { id: 'ent1', type: 'entrance', label: 'Ramp Entrance', coords: { x: 10, y: 90 }, floor: 0, description: 'Main accessible entrance with automatic sliding doors.' },
        { id: 'e1', type: 'elevator', label: 'Main Elevator A', coords: { x: 45, y: 45 }, floor: 0, description: 'Priority elevator for wheelchair users. Wide doors.' },
        { id: 'e2', type: 'elevator', label: 'Main Elevator A', coords: { x: 45, y: 45 }, floor: 1, description: 'Priority elevator for wheelchair users. Wide doors.' },
        { id: 'r1', type: 'restroom', label: 'Accessible Restroom', coords: { x: 80, y: 20 }, floor: 0, description: 'Large stall with grab bars and emergency pull cord.' },
        { id: 'r2', type: 'restroom', label: 'Accessible Restroom', coords: { x: 80, y: 20 }, floor: 1, description: 'Large stall with grab bars and emergency pull cord.' },
        { id: 'p1', type: 'parking', label: 'Reserved Parking', coords: { x: 40, y: 90 }, floor: 0, description: '3 reserved bays for blue badge holders.' },
        { id: 'inf1', type: 'info', label: 'A11y Help Desk', coords: { x: 55, y: 55 }, floor: 0, description: 'Staff available for mobility assistance & guidance.' }
      ]
    },
    scorecard: {"infrastructure":91,"services":93,"staffTraining":82,"emergencyReadiness":75},
    proofs: [
  {
    "id": "p1a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p1b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
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
      { id: 'r3', author: 'Mohammed A.', role: 'Disabled Individual', verified: true, rating: 8, date: '2026-03-06', text: 'Good ramps but the elevator issue is frustrating.', tags: ['Good ramps', 'Elevator issue'] },
    ],
    hours: 'Mon–Sat 8am–8pm',
    verified: true,
    saved: true,
    liveStatus: {
      waitTime: '22 mins',
      occupancy: 82,
      sensoryLevel: 'crowded',
      alerts: [{ type: 'emergency', message: 'Main lift undergoing maintenance' }]
    },
    specialists: [
      { id: 's3', name: 'Dr. Sarah Jenkins', role: 'GP', training: ['Deaf-blind communication'] }
    ],
    insuranceCoverage: {
      'BlueCross': ['Hearing loop access'],
      'HealthFirst': ['Scheduled ASL']
    },
    scorecard: {"infrastructure":96,"services":71,"staffTraining":76,"emergencyReadiness":76},
    proofs: [
  {
    "id": "p2a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p2b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
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
      { id: 'r4', author: 'Sarah L.', role: 'Caregiver', verified: true, rating: 7, date: '2026-02-28', text: 'Nice quiet area but could use more visual navigation aids.', tags: ['Quiet', 'Needs improvement'] },
    ],
    hours: 'Mon–Fri 9am–6pm',
    verified: false,
    scorecard: {"infrastructure":89,"services":95,"staffTraining":83,"emergencyReadiness":73},
    proofs: [
  {
    "id": "p3a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p3b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
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
    scorecard: {"infrastructure":88,"services":70,"staffTraining":88,"emergencyReadiness":99},
    proofs: [
  {
    "id": "p4a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p4b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
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
    scorecard: {"infrastructure":83,"services":74,"staffTraining":71,"emergencyReadiness":77},
    proofs: [
  {
    "id": "p5a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p5b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
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
    scorecard: {"infrastructure":87,"services":70,"staffTraining":83,"emergencyReadiness":86},
    proofs: [
  {
    "id": "p6a",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
    "author": "Facility Admin",
    "caption": "Wide automatic entrance doors with ramp access",
    "date": "2026-02-15"
  },
  {
    "id": "p6b",
    "type": "image",
    "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    "author": "Priya M.",
    "caption": "Clear braille signage next to lifts",
    "date": "2026-03-01"
  }
],
  },
];

export const CATEGORIES = [
  { id: 'wheelchair', label: 'Wheelchair',   icon: '♿', color: '#2563EB' },
  { id: 'visual',    label: 'Visual',        icon: '👁',  color: '#7C3AED' },
  { id: 'hearing',   label: 'Hearing',       icon: '👂',  color: '#0891B2' },
  { id: 'mental',    label: 'Mental Health', icon: '🧠',  color: '#059669' },
  { id: 'sensory',   label: 'Sensory',       icon: '✋',  color: '#D97706' },
  { id: 'cognitive', label: 'Cognitive',     icon: '🔍',  color: '#9333EA' },
];

export const USER_NEEDS = [
  { id: 'wheelchair', label: 'Wheelchair User',         icon: '♿', description: 'Ramps, lifts, wide corridors, accessible restrooms' },
  { id: 'visual',     label: 'Visual Impairment',       icon: '👁',  description: 'Braille signage, tactile paths, audio navigation' },
  { id: 'hearing',    label: 'Hearing Impairment',      icon: '👂',  description: 'ASL interpreters, hearing loops, visual alerts' },
  { id: 'mental',     label: 'Mental Health',           icon: '🧠',  description: 'Quiet rooms, mental health navigators' },
  { id: 'motor',      label: 'Motor Difficulty',        icon: '🤲',  description: 'Power-assisted doors, lowered reception desks' },
  { id: 'chronic',    label: 'Chronic Condition',       icon: '💊',  description: 'Priority seating, minimal waiting times' },
  { id: 'cognitive',  label: 'Cognitive Support',       icon: '🔍',  description: 'Simple signage, step-by-step guidance' },
  { id: 'speech',     label: 'Speech Difficulty',       icon: '🗣',  description: 'AAC devices, patient communication boards' },
  { id: 'autism',     label: 'Autism-Friendly',         icon: '🌈',  description: 'Low-stimulation areas, predictable routines' },
  { id: 'braille',    label: 'Braille Required',        icon: '⠿',   description: 'Comprehensive braille labelling throughout' },
  { id: 'sensory',    label: 'Sensory Sensitivity',     icon: '✋',  description: 'Dim lighting, quiet spaces, scent-free zones' },
];

export const EDUCATION_CATEGORIES = [
  { id: 'legal', label: 'Legal Rights', icon: '⚖️' },
  { id: 'advocacy', label: 'Self-Advocacy', icon: '🗣️' },
  { id: 'training', label: 'Skills & Training', icon: '🎓' },
];

export const EDUCATION_RESOURCES = [
  {
    id: 'ada-basics',
    category: 'legal',
    title: 'ADA Basics for Patients',
    summary: 'A plain-language guide to your rights under the Americans with Disabilities Act in healthcare settings.',
    content: `The Americans with Disabilities Act (ADA) ensures that people with disabilities have the same rights and opportunities as everyone else. In healthcare, this means:
    
    1. **Effective Communication**: Hospitals must provide auxiliary aids and services (like ASL interpreters or braille) to ensure effective communication.
    2. **Physical Access**: Facilities must remove architectural barriers where "readily achievable."
    3. **Reasonable Modifications**: Providers must change policies or procedures to accommodate your disability.
    
    If you feel your rights are being violated, you can file a complaint with the Department of Justice or the HHS Office for Civil Rights.`,
    tags: ['ADA', 'Legal', 'Patient Rights'],
    readTime: '5 min'
  },
  {
    id: 'section-1557',
    category: 'legal',
    title: 'Section 1557 Explained',
    summary: 'Understanding the non-discrimination provisions of the Affordable Care Act.',
    content: `Section 1557 is the primary non-discrimination provision of the ACA. It prohibits discrimination on the basis of race, color, national origin, sex, age, or disability in health programs or activities that receive federal financial assistance.
    
    Key protections include:
    - Right to meaningful access for individuals with Limited English Proficiency (LEP).
    - Protections for individuals with disabilities, including requirements for accessible technology and auxiliary aids.
    - Prohibition of discriminatory health insurance benefit designs.`,
    tags: ['ACA', 'Section 1557', 'Regulation'],
    readTime: '4 min'
  },
  {
    id: 'advocacy-tips',
    category: 'advocacy',
    title: 'Effective Self-Advocacy',
    summary: 'How to clearly communicate your needs and ensure you receive the best care possible.',
    content: `Being your own advocate is crucial in navigating the healthcare system. Here are some tips:
    
    - **Be Clear and Specific**: Instead of saying "I need help," say "I need a sign language interpreter for my appointment."
    - **Know Your History**: Keep a folder of your medical records and accessibility requirements.
    - **Bring a Support Person**: If possible, have a friend or family member join you to take notes or provide emotional support.
    - **Ask for the A11y Coordinator**: Most large facilities have a designated ADA or Accessibility Coordinator. Ask to speak with them if you face barriers.`,
    tags: ['Advocacy', 'Communication', 'Tips'],
    readTime: '6 min'
  },
  {
    id: 'requesting-interpreters',
    category: 'advocacy',
    title: 'Requesting Interpreters',
    summary: 'A step-by-step guide to requesting ASL or language interpreters for medical visits.',
    content: `Under the ADA, healthcare providers are generally responsible for providing qualified interpreters when necessary for effective communication.
    
    - Request the interpreter as early as possible (ideally when booking).
    - Specify the type of interpreting (ASL, tactile, etc.).
    - You should not be charged for this service.
    - You are not required to provide your own interpreter (like a family member), as they may not be qualified for medical terminology.`,
    tags: ['ASL', 'Interpreters', 'Access'],
    readTime: '3 min'
  }
];

