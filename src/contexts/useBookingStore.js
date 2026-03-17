import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  appointments: [],
  sharedRecords: [], // history of record sharing with facilities

  bookAppointment: (appointment) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newAppointment = { ...appointment, id, status: 'confirmed', bookedAt: new Date().toISOString() };
    set((state) => ({
      appointments: [...state.appointments, newAppointment]
    }));
    return newAppointment;
  },

  shareRecord: (facilityId, needs) => {
    const shareEntry = {
      facilityId,
      needs,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).slice(2, 9),
    };
    set((state) => ({
      sharedRecords: [...state.sharedRecords, shareEntry]
    }));
    return shareEntry;
  },

  cancelAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id)
    }));
  }
}));
