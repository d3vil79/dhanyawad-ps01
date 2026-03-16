import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: {
    name: 'Alex',
    avatar: null,
    needs: ['wheelchair', 'visual'],
    points: 120, // Starting gamification points
    emergencyLogs: [], // Simulates a backend log of SOS incidents
  },
  setName: (name) => set(s => ({ profile: { ...s.profile, name } })),
  toggleNeed: (need) => set(s => ({
    profile: {
      ...s.profile,
      needs: s.profile.needs.includes(need)
        ? s.profile.needs.filter(n => n !== need)
        : [...s.profile.needs, need],
    },
  })),
  addEmergencySOS: (logData) => set((s) => ({
    profile: {
      ...s.profile,
      emergencyLogs: [
        { id: Date.now().toString(), timestamp: new Date().toISOString(), ...logData },
        ...s.profile.emergencyLogs,
      ],
    },
  })),
  addPoints: (amount) => set((s) => ({
    profile: {
      ...s.profile,
      points: s.profile.points + amount,
    },
  })),
}));
