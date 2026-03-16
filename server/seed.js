/**
 * Full Seed Script — Seeds ALL mock data from the frontend into MongoDB
 * Includes: Facilities, Reviews, Categories, User Needs, Demo Users
 *
 * Run with:  node server/seed.js
 *
 * Demo accounts created:
 *   patient@demo.com  / demo1234  (Role: patient)
 *   doctor@demo.com   / demo1234  (Role: doctor)
 *   hospital@demo.com / demo1234  (Role: hospital)
 *   admin@demo.com    / demo1234  (Role: admin)
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User     = require('./models/User');
const Facility = require('./models/Facility');
const Category = require('./models/Category');

// ─────────────────────────────────────────────────────────────────
// DEMO USERS
// ─────────────────────────────────────────────────────────────────
const USERS = [
  { name: 'Patient User',  email: 'patient@demo.com',  password: 'demo1234', role: 'patient'  },
  { name: 'Dr. Doctor',    email: 'doctor@demo.com',   password: 'demo1234', role: 'doctor'   },
  { name: 'City Hospital', email: 'hospital@demo.com', password: 'demo1234', role: 'hospital' },
  { name: 'System Admin',  email: 'admin@demo.com',    password: 'demo1234', role: 'admin'    },
];

// ─────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'wheelchair', label: 'Wheelchair', icon: '♿', color: '#2563EB' },
  { id: 'visual',     label: 'Visual',     icon: '👁',  color: '#7C3AED' },
  { id: 'hearing',    label: 'Hearing',    icon: '👂',  color: '#0891B2' },
  { id: 'mental',     label: 'Mental',     icon: '🧠',  color: '#059669' },
  { id: 'cognitive',  label: 'Cognitive',  icon: '🔍',  color: '#D97706' },
  { id: 'sensory',    label: 'Sensory',    icon: '✋',  color: '#DB2777' },
  { id: 'motor',      label: 'Motor',      icon: '🤲',  color: '#7C3AED' },
  { id: 'chronic',    label: 'Chronic',    icon: '💊',  color: '#DC2626' },
  { id: 'speech',     label: 'Speech',     icon: '🗣',  color: '#0284C7' },
];

// ─────────────────────────────────────────────────────────────────
// FACILITIES  (all 10 — 6 from mockData.js + 4 from api.js)
// ─────────────────────────────────────────────────────────────────
const FACILITIES = [
  // ── From mockData.js ─────────────────────────────────────────
  {
    name: 'Sunrise General Hospital',
    address: '123 Wellness Blvd, Downtown',
    phone: '+1 (555) 234-5678',
    coords: { lat: 28.6139, lng: 77.2090 },
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
          { name: 'Ramp at main entrance',          available: true  },
          { name: 'Accessible parking (10 bays)',   available: true  },
          { name: 'Wheelchair-accessible washrooms',available: true  },
          { name: 'Elevator to all floors',         available: true  },
          { name: 'Motorized wheelchair available', available: false },
        ],
      },
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'Braille signage throughout', available: true },
          { name: 'Tactile floor paths',        available: true },
          { name: 'Audio navigation system',    available: true },
          { name: 'High-contrast signage',      available: true },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter on staff', available: true  },
          { name: 'Visual alert systems',     available: true  },
          { name: 'Video relay service',      available: true  },
          { name: 'Hearing loop system',      available: false },
        ],
      },
      mental: {
        label: 'Mental Health Support',
        items: [
          { name: 'Quiet waiting area',        available: true },
          { name: 'Sensory-friendly environment', available: true },
          { name: 'Mental health navigator',   available: true },
        ],
      },
    },
    alert: null,
    reviews: [
      {
        author: 'Priya M.', rating: 9, date: '2026-03-10',
        text: 'The tactile paths truly helped our guide dog navigate. Exemplary staff.',
        tags: ['Tactile paths', 'Kind staff'],
        proofImage: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=300&q=80',
      },
      {
        author: 'Robert K.', rating: 10, date: '2026-03-08',
        text: 'Best accessible hospital I have visited. ASL interpreters were ready immediately.',
        tags: ['ASL available', 'No wait'],
      },
    ],
    hours: 'Open 24 hours',
    verified: true,
  },
  {
    name: 'ClearPath Medical Center',
    address: '45 Horizon St, Midtown',
    phone: '+1 (555) 987-6543',
    coords: { lat: 28.6200, lng: 77.2150 },
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
          { name: 'Ramp at main entrance',          available: true  },
          { name: 'Accessible parking (5 bays)',    available: true  },
          { name: 'Wheelchair-accessible washrooms',available: true  },
          { name: 'Elevator to all floors',         available: false },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter (scheduled)', available: true },
          { name: 'Visual alert systems',        available: true },
          { name: 'Hearing loop system',         available: true },
        ],
      },
    },
    alert: { type: 'amber', message: 'Main elevator out of service. Service lift available via east wing.' },
    reviews: [
      {
        author: 'Mohammed A.', rating: 8, date: '2026-03-06',
        text: 'Good ramps but the elevator issue is frustrating.',
        tags: ['Good ramps', 'Elevator issue'],
      },
    ],
    hours: 'Mon–Sat 8am–8pm',
    verified: true,
  },
  {
    name: 'Vista Community Clinic',
    address: '789 Park Ave, East Side',
    phone: '+1 (555) 345-6789',
    coords: { lat: 28.6080, lng: 77.2180 },
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
          { name: 'Braille signage (partial)', available: true  },
          { name: 'Tactile floor paths',       available: false },
          { name: 'High-contrast signage',     available: true  },
        ],
      },
      mental: {
        label: 'Mental Health Support',
        items: [
          { name: 'Quiet waiting area',      available: true  },
          { name: 'Mental health navigator', available: false },
        ],
      },
    },
    alert: null,
    reviews: [
      {
        author: 'Sarah L.', rating: 7, date: '2026-02-28',
        text: 'Nice quiet area but could use more visual navigation aids.',
        tags: ['Quiet', 'Needs improvement'],
      },
    ],
    hours: 'Mon–Fri 9am–6pm',
    verified: false,
  },
  {
    name: 'HorizonCare Specialty Hospital',
    address: '12 Meridian Road, Northgate',
    phone: '+1 (555) 111-2233',
    coords: { lat: 28.6300, lng: 77.2050 },
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
          { name: 'Ramp at all entrances',         available: true },
          { name: 'Accessible parking (12 bays)',  available: true },
          { name: 'Power-assisted doors',          available: true },
          { name: 'Motorized wheelchair available',available: true },
        ],
      },
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'ASL interpreter on staff', available: true },
          { name: 'Real-time captioning',     available: true },
        ],
      },
    },
    alert: { type: 'red', message: 'EMERGENCY: North wing ramp closed for emergency repairs. Use south entrance.' },
    reviews: [],
    hours: 'Open 24 hours',
    verified: true,
  },
  {
    name: 'Meadows Family Health',
    address: '55 Greenway Lane, Suburbs',
    phone: '+1 (555) 444-5566',
    coords: { lat: 28.6020, lng: 77.2000 },
    score: 5.2,
    categories: ['wheelchair'],
    images: [
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80',
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Ramp at main entrance',          available: true  },
          { name: 'Accessible parking',             available: false },
          { name: 'Wheelchair-accessible washrooms',available: false },
        ],
      },
    },
    alert: null,
    reviews: [],
    hours: 'Mon–Fri 8am–5pm',
    verified: false,
  },
  {
    name: 'Nexus Rehabilitation Center',
    address: '30 Therapy Blvd, Westend',
    phone: '+1 (555) 777-8899',
    coords: { lat: 28.6150, lng: 77.1990 },
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
          { name: 'Lift at all levels',     available: true },
          { name: 'Wide corridors',         available: true },
        ],
      },
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'Complete tactile path system', available: true },
          { name: 'Audio navigation',             available: true },
          { name: 'Braille everywhere',           available: true },
        ],
      },
    },
    alert: null,
    reviews: [
      {
        author: 'Anika J.', rating: 10, date: '2026-03-12',
        text: 'Absolutely gold standard for disability-inclusive care.',
        tags: ['Gold standard', 'Inclusive'],
      },
    ],
    hours: 'Mon–Sun 7am–9pm',
    verified: true,
  },

  // ── From api.js (fallback mock facilities) ───────────────────
  {
    name: 'Metropolis Complete Care Hospital',
    address: '1000 Wellness Blvd, Metropolis',
    coords: { lat: 28.6260, lng: 77.2240 },
    score: 9.8,
    categories: ['wheelchair', 'visual', 'cognitive', 'hearing', 'sensory'],
    hours: 'Open 24/7',
    images: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    ],
    verified: true,
    alert: null,
    reviews: [
      {
        author: 'Sarah J.', rating: 10,
        text: 'Absolutely incredible facility. Wide doors, braille everywhere, and the staff is completely sensory-aware.',
        tags: ['Wheelchair Access', 'Sensory Friendly'],
      },
      {
        author: 'Mark T.', rating: 9,
        text: 'The smart ramps and automatic doors make navigating here a breeze. Only issue was parking was slightly full.',
        tags: ['Parking'],
      },
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Smart ramps at all entrances',  available: true },
          { name: 'Automatic doors throughout',    available: true },
          { name: 'Accessible parking (20 bays)',  available: true },
        ],
      },
      sensory: {
        label: 'Sensory Support',
        items: [
          { name: 'Sensory-aware staff training',     available: true },
          { name: 'Low-stimulation waiting area',     available: true },
          { name: 'Noise-cancelling headphones available', available: true },
        ],
      },
    },
  },
  {
    name: 'Sunrise Community & Rehabilitation Clinic',
    address: '456 Oak Ave, District 4',
    coords: { lat: 28.5989, lng: 77.2085 },
    score: 8.2,
    categories: ['wheelchair', 'hearing'],
    hours: '9:00 AM - 6:00 PM',
    images: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1538108149393-cebb47ac17e7?auto=format&fit=crop&q=80&w=800',
    ],
    verified: true,
    alert: { type: 'amber', message: 'Elevator B in the East Wing is currently under maintenance. Please use Elevator A.' },
    reviews: [
      {
        author: 'David L.', rating: 8,
        text: 'Great hearing loops included at reception. The staff knew basic sign language which was incredibly comforting.',
        tags: ['ASL', 'Hearing Loop'],
      },
    ],
    features: {
      hearing: {
        label: 'Hearing & Speech',
        items: [
          { name: 'Hearing loop at reception',   available: true },
          { name: 'Staff know basic sign language', available: true },
          { name: 'Visual alert system',         available: true },
        ],
      },
    },
  },
  {
    name: 'Pioneer Advanced Neurology Center',
    address: '88 Brainerd Lane, Tech District',
    coords: { lat: 28.6390, lng: 77.1890 },
    score: 9.4,
    categories: ['cognitive', 'visual', 'sensory'],
    hours: '8:00 AM - 8:00 PM',
    images: [
      'https://images.unsplash.com/photo-1551076805-e166946c9eb9?auto=format&fit=crop&q=80&w=800',
    ],
    verified: true,
    alert: null,
    reviews: [
      {
        author: 'Emily R.', rating: 10,
        text: 'They have a dedicated quiet room for cognitive overload. The lighting is soft, not fluorescent. Perfect.',
        tags: ['Quiet Room', 'Lighting'],
      },
      {
        author: 'Jon W.', rating: 9,
        text: 'Clear high-contrast signage helped my mother navigate independently.',
        tags: ['Signage', 'Visual'],
      },
    ],
    features: {
      cognitive: {
        label: 'Cognitive Support',
        items: [
          { name: 'Dedicated quiet room',          available: true },
          { name: 'Low-fluorescence lighting',     available: true },
          { name: 'Step-by-step wayfinding guides',available: true },
        ],
      },
      visual: {
        label: 'Visual Impairment',
        items: [
          { name: 'High-contrast signage throughout', available: true },
          { name: 'Braille menus & forms',           available: true },
        ],
      },
    },
  },
  {
    name: 'Valley Emergency Orthopedics',
    address: '12 River Road, West Valley',
    coords: { lat: 28.5830, lng: 77.2340 },
    score: 7.5,
    categories: ['wheelchair'],
    hours: '24/7 Trauma Center',
    images: [
      'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=800',
    ],
    verified: false,
    alert: { type: 'red', message: 'Temporary closure of the main wheelchair ramp due to frozen pipes. Temporary ramp installed at North entrance.' },
    reviews: [
      {
        author: 'Pete.', rating: 7,
        text: 'Getting inside was tricky because of the ramp closure, but the doctors are amazing.',
        tags: ['Ramp Issue'],
      },
    ],
    features: {
      wheelchair: {
        label: 'Wheelchair & Mobility',
        items: [
          { name: 'Wheelchair ramp (main — CLOSED)', available: false },
          { name: 'Temporary ramp at North entrance', available: true  },
          { name: 'Accessible restrooms',             available: true  },
        ],
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGO_URI, {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  });
  console.log('✅ Connected!\n');

  // ── Users ────────────────────────────────────────────────────
  console.log('👤 Seeding demo users...');
  for (const u of USERS) {
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log(`   ⏭  ${u.email} already exists`); continue; }
    await User.create(u);
    console.log(`   ✅ ${u.role}: ${u.email}`);
  }

  // ── Categories ───────────────────────────────────────────────
  console.log('\n🏷️  Seeding categories...');
  await Category.deleteMany({});
  await Category.insertMany(CATEGORIES);
  console.log(`   ✅ ${CATEGORIES.length} categories inserted`);

  // ── Facilities ───────────────────────────────────────────────
  console.log('\n🏥 Seeding facilities...');
  await Facility.deleteMany({});
  const inserted = await Facility.insertMany(FACILITIES);
  console.log(`   ✅ ${inserted.length} facilities inserted`);
  inserted.forEach(f => console.log(`      • ${f.name} (score: ${f.score})`));

  console.log('\n🎉 Seeding complete! Summary:');
  console.log(`   Users:      ${USERS.length}`);
  console.log(`   Categories: ${CATEGORIES.length}`);
  console.log(`   Facilities: ${inserted.length}`);
  console.log('\n   Credentials: <email> / demo1234\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
