import { useState, useEffect } from 'react';
import { fetchOSMFacilities, setFacilityCache } from '../services/api';
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
 * Fetches real facilities from Overpass API (OSM) around the user's live GPS coords.
 */
export function useNearby({ categories = [], maxKm = 20, query = '' } = {}) {
  const { coords, hasRealLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    let active = true;
    
    // Only search if we have coords (even default ones)
    if (!coords) return;
    
    const fetchRealData = async () => {
      setLoading(true);
      
      // Radius default 5km, but if we don't have real location, expand 
      // heavily so we find something anywhere on earth to keep demo working
      const radiusMeters = hasRealLocation ? maxKm * 1000 : 50000; 

      try {
        const results = await fetchOSMFacilities(coords.lat, coords.lng, radiusMeters);
        if (!active) return;
        
        // Calculate dynamic distances
        const withDistance = results.map(f => ({
          ...f,
          distance: haversineDistance(coords, f.coords),
        }));

        // Filter
        let filtered = withDistance.filter(f => {
          const matchesCat = categories.length === 0 || categories.some(c => f.categories.includes(c));
          const matchesQuery = !query ||
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.address.toLowerCase().includes(query.toLowerCase());
          return matchesCat && matchesQuery;
        });
        
        // Sort and cache
        filtered.sort((a, b) => a.distance - b.distance);
        setFacilityCache(filtered);
        setFacilities(filtered);
        
      } catch (e) {
        console.error("useNearby fetch error:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    // Debounce the fetch slightly to avoid slamming OSM API if coords update rapidly
    const timer = setTimeout(fetchRealData, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [coords?.lat, coords?.lng, categories.join(','), query, maxKm, hasRealLocation]);

  return { facilities, loading };
}
