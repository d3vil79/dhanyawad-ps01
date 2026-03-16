import { create } from 'zustand';

const API = 'http://localhost:5000/api';
const STORE_KEY = 'accesscare_users';
const SESSION_KEY = 'accesscare_session';

// ── Pre-seeded demo users (always available locally) ──────────────────────────
const DEMO_USERS = [
  { id: 'demo-1', name: 'Patient User',  email: 'patient@demo.com',  password: 'demo1234', role: 'patient'  },
  { id: 'demo-2', name: 'Dr. Doctor',    email: 'doctor@demo.com',   password: 'demo1234', role: 'doctor'   },
  { id: 'demo-3', name: 'City Hospital', email: 'hospital@demo.com', password: 'demo1234', role: 'hospital' },
  { id: 'demo-4', name: 'System Admin',  email: 'admin@demo.com',    password: 'demo1234', role: 'admin'    },
];

// ── Local user store helpers ──────────────────────────────────────────────────
function getLocalUsers() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const registered = raw ? JSON.parse(raw) : [];
    // Always include demo users; registered users can override by same email
    const demosNotOverridden = DEMO_USERS.filter(
      d => !registered.find(r => r.email === d.email)
    );
    return [...demosNotOverridden, ...registered];
  } catch {
    return [...DEMO_USERS];
  }
}

function saveLocalUser(user) {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = [...existing.filter(u => u.email !== user.email), user];
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  } catch {/* ignore */}
}

function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch {/* */}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {/* */}
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiLogin(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json(); // { user, token }
}

async function apiRegister(data) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Register failed');
  return res.json(); // { user, token }
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    const em = email.toLowerCase().trim();

    // Try real API first
    try {
      const data = await apiLogin(em, password);
      const user = data.user;
      saveSession(user);
      localStorage.setItem('accesscare_token', data.token);
      set({ user, isAuthenticated: true, token: data.token });
      return user;
    } catch (apiErr) {
      // API unavailable — fall back to local auth
    }

    // Local fallback
    const users = getLocalUsers();
    const match = users.find(u => u.email === em);
    if (!match) throw new Error('No account found with that email address.');
    if (match.password !== password) throw new Error('Incorrect password.');

    const { password: _pw, ...safeUser } = match;
    saveSession(safeUser);
    set({ user: safeUser, isAuthenticated: true, token: 'local' });
    return safeUser;
  },

  // ── REGISTER ─────────────────────────────────────────────────────────────
  register: async ({ name, email, password, role }) => {
    const em = email.toLowerCase().trim();

    // Try real API first
    try {
      const data = await apiRegister({ name, email: em, password, role });
      const user = data.user;
      saveSession(user);
      localStorage.setItem('accesscare_token', data.token);
      set({ user, isAuthenticated: true, token: data.token });
      return user;
    } catch (apiErr) {
      // API unavailable — fall back to local storage
    }

    // Local fallback — check email not already taken
    const users = getLocalUsers();
    if (users.find(u => u.email === em)) {
      throw new Error('An account with this email already exists.');
    }
    if (!name || !email || !password) throw new Error('All fields are required.');

    const newUser = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      email: em,
      password,
      role: role || 'patient',
    };
    saveLocalUser(newUser);

    const { password: _pw, ...safeUser } = newUser;
    saveSession(safeUser);
    set({ user: safeUser, isAuthenticated: true, token: 'local' });
    return safeUser;
  },

  // ── SESSION RESTORE ───────────────────────────────────────────────────────
  restoreSession: async () => {
    // Try JWT with real API
    const token = localStorage.getItem('accesscare_token');
    if (token && token !== 'local') {
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { user } = await res.json();
          set({ user, isAuthenticated: true, token });
          return;
        }
      } catch {/* fall through */}
    }

    // Fall back to localStorage session
    const session = loadSession();
    if (session) {
      set({ user: session, isAuthenticated: true, token: 'local' });
    }
  },

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  logout: () => {
    clearSession();
    localStorage.removeItem('accesscare_token');
    set({ user: null, isAuthenticated: false, token: null });
  },
}));
