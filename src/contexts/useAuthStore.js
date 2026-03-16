import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // { id, name, email, role: 'patient'|'doctor'|'hospital'|'admin' }
  isAuthenticated: false,

  login: async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));
    
    // Mock authentication check based on email string matching
    let role = 'patient';
    if (email.includes('doctor')) role = 'doctor';
    if (email.includes('hospital') || email.includes('clinic')) role = 'hospital';
    if (email.includes('admin')) role = 'admin';

    set({
      user: {
        id: Math.random().toString(36).slice(2),
        name: email.split('@')[0],
        email,
        role,
      },
      isAuthenticated: true,
    });
  },

  register: async (userData) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    set({
      user: {
        id: Math.random().toString(36).slice(2),
        ...userData
      },
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));
