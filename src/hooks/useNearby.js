import { useState, useEffect } from 'react';
import { fetchOSMFacilities, setFacilityCache } from '../services/api';
import { useLocationStore } from '../contexts/useLocationStore';
import { sortByProfileMatch } from '../utils/profileMatcher';
import { parseSearchIntent } from '../utils/nlpSearch';

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
 * When `userNeeds` is set and no manual `categories` filter is active, results are
 * sorted by profile match score (highest first), then distance.
 */
export function useNearby({ categories = [], maxKm = 20, query = '', userNeeds = [] } = {}) {
  const { coords, hasRealLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);

  const smartSortActive = userNeeds.length > 0 && categories.length === 0;

  useEffect(() => {
    let active = true;
    
    if (!coords) return;
    
    const fetchRealData = async () => {
      setLoading(true);
      
      const radiusMeters = hasRealLocation ? maxKm * 1000 : 50000; 

      try {
        const results = await fetchOSMFacilities(coords.lat, coords.lng, radiusMeters);
        if (!active) return;
        
        // Calculate dynamic distances
        const withDistance = results.map(f => ({
          ...f,
          distance: haversineDistance(coords, f.coords),
        }));

        // Parse NL intent if query exists and is long enough
        const intent = query.length > 8 ? parseSearchIntent(query) : null;

        // Filter by manual category and query
        let filtered = withDistance.filter(f => {
          // 1. Category Filter (Manual OR NL extracted)
          const allCategories = [...new Set([...categories, ...(intent?.categories || [])])];
          const matchesCat = allCategories.length === 0 || allCategories.some(c => f.categories.includes(c));

          // 2. Query/Name Filter
          const searchSpace = `${f.name} ${f.address}`.toLowerCase();
          let matchesQuery = !query || searchSpace.includes(query.toLowerCase());

          // 3. NL Specific Filters
          if (intent) {
            // Facility Type match (e.g. "hospital")
            if (intent.facilityType && !f.name.toLowerCase().includes(intent.facilityType)) {
              matchesQuery = false;
            }

            // Feature match (e.g. "MRI")
            if (intent.features.length > 0) {
              const fString = JSON.stringify(f.features).toLowerCase();
              if (!intent.features.some(feat => fString.includes(feat))) {
                matchesQuery = false;
              }
            }
          }

          return matchesCat && matchesQuery;
        });
        
        // Sort: profile-match first (when no manual filter), else distance
        // If NL intent specifies "nearby", prioritize distance over smart sort
        if (smartSortActive && (!intent || !intent.isNearbyIntent)) {
          filtered = sortByProfileMatch(filtered, userNeeds);
        } else {
          filtered.sort((a, b) => a.distance - b.distance);
        }

        setFacilityCache(filtered);
        setFacilities(filtered);
        
      } catch (e) {
        console.error("useNearby fetch error:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchRealData, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [coords?.lat, coords?.lng, categories.join(','), query, maxKm, hasRealLocation, userNeeds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { facilities, loading, smartSortActive };
}

