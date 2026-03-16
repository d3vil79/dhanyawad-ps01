import { create } from 'zustand';

const API = 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  login: async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    set({ user: data.user, isAuthenticated: true, token: data.token });
    // Store token in localStorage so it survives page refreshes
    localStorage.setItem('accesscare_token', data.token);
    return data.user;
  },

  register: async (userData) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    set({ user: data.user, isAuthenticated: true, token: data.token });
    localStorage.setItem('accesscare_token', data.token);
    return data.user;
  },

  // Call this on app load to re-authenticate from stored token
  restoreSession: async () => {
    const token = localStorage.getItem('accesscare_token');
    if (!token) return;

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Session expired');
      const data = await res.json();
      set({ user: data.user, isAuthenticated: true, token });
    } catch {
      localStorage.removeItem('accesscare_token');
      set({ user: null, isAuthenticated: false, token: null });
    }
  },

  logout: () => {
    localStorage.removeItem('accesscare_token');
    set({ user: null, isAuthenticated: false, token: null });
  },
}));
