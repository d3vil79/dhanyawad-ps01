import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: {
    name: 'Alex',
    avatar: null,
    needs: ['wheelchair', 'visual'],
    role: 'individual', // 'individual' | 'caregiver'
    dependents: [
      { id: 'd1', name: 'Mother (Sarah)', needs: ['wheelchair'] },
      { id: 'd2', name: 'Grandpa Jim', needs: ['hearing', 'visual'] }
    ],
    activeDependentId: null,
  },
  setName: (name) => set(s => ({ profile: { ...s.profile, name } })),
  setRole: (role) => set(s => ({ profile: { ...s.profile, role } })),
  setActiveDependent: (id) => set(s => ({ profile: { ...s.profile, activeDependentId: id } })),
  toggleNeed: (need) => set(s => ({
    profile: {
      ...s.profile,
      needs: s.profile.needs.includes(need)
        ? s.profile.needs.filter(n => n !== need)
        : [...s.profile.needs, need],
    },
  })),
}));
