import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: {
    name: 'Alex',
    avatar: null,
    needs: ['wheelchair', 'visual'],
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
}));
