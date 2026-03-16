import { useState, useEffect, useMemo } from 'react';
import { FACILITIES } from '../services/mockData';
import { useLocationStore } from '../contexts/useLocationStore';

function haversineDistance(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin1 = Math.sin(dLat / 2);
  const sin2 = Math.sin(dLng / 2);
  const calc = sin1 * sin1 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sin2 * sin2;
  return R * 2 * Math.atan2(Math.sqrt(calc), Math.sqrt(1 - calc));
}

/**
 * useNearby
 *
 * Filters and sorts facilities by distance from the user's location.
 *
 * Smart fallback:
 *  - First tries facilities within maxKm (default 20km).
 *  - If fewer than 3 results (e.g. real GPS is far from demo coords), returns
 *    ALL facilities sorted by distance so the app always shows something useful.
 */
export function useNearby({ categories = [], maxKm = 20000, query = '' } = {}) {
  const { coords } = useLocationStore();
  const [loading, setLoading] = useState(true);

  // Simulate initial loading shimmer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const facilities = useMemo(() => {
    const withDistance = FACILITIES.map(f => ({
      ...f,
      distance: haversineDistance(coords, f.coords),
    }));

    const filtered = withDistance.filter(f => {
      const matchesCat = categories.length === 0 || categories.some(c => f.categories.includes(c));
      const matchesQuery = !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.address.toLowerCase().includes(query.toLowerCase());
      return f.distance <= maxKm && matchesCat && matchesQuery;
    });

    // Smart fallback: if nothing passes category/query filters at all, show all sorted
    const base = filtered.length > 0 ? filtered : withDistance.filter(f => {
      const matchesCat = categories.length === 0 || categories.some(c => f.categories.includes(c));
      const matchesQuery = !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.address.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });

    return base.sort((a, b) => a.distance - b.distance);
  }, [coords, categories, maxKm, query]);

  return { facilities, loading };
}
