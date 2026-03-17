import { create } from 'zustand';

const DEFAULT_COORDS = { lat: 28.6139, lng: 77.2090 }; // New Delhi fallback

export const useLocationStore = create((set) => ({
  coords: DEFAULT_COORDS,
  loading: false,
  error: null,
  hasRealLocation: false,

  fetchLocation: () => {
    if (!navigator.geolocation) {
      set({ error: 'Geolocation not supported', coords: DEFAULT_COORDS, hasRealLocation: false });
      return;
    }
    set({ loading: true, error: null });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          loading: false,
          hasRealLocation: true,
          error: null,
        });
      },
      (err) => {
        const msg = {
          1: 'Location access denied. Using default location.',
          2: 'Location unavailable. Using default location.',
          3: 'Location request timed out. Using default location.',
        }[err.code] || 'Location unavailable.';
        set({ error: msg, loading: false, coords: DEFAULT_COORDS, hasRealLocation: false });
      },
      { timeout: 8000, maximumAge: 60000, enableHighAccuracy: true }
    );
  },

  /**
   * Watch for live position updates (call once on mount)
   * Returns a cleanup function to call on unmount
   */
  watchLocation: () => {
    if (!navigator.geolocation) return () => {};
    const id = navigator.geolocation.watchPosition(
      (pos) => set({
        coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        hasRealLocation: true,
        error: null,
      }),
      () => {},
      { timeout: 10000, maximumAge: 30000, enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  },
}));
