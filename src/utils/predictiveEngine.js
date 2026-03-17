/**
 * predictiveEngine.js
 * 
 * A heuristic engine that predicts likely accessibility category scores 
 * for facilities with incomplete data using existing metadata.
 */

export function predictFacilityA11y(facility) {
  if (!facility) return null;

  // 1. Determine baseline from overall score (if available, else use a neutral 7.0)
  const baseScorePercent = (facility.score || 7.0) * 10;
  
  // 2. Identify strengths based on facility name and categories
  const name = facility.name.toLowerCase();
  const cats = facility.categories || [];
  
  // Weights for different categories
  let weights = {
    infrastructure: 1.0,
    services: 1.0,
    staffTraining: 1.0,
    emergencyReadiness: 1.0
  };

  // Heuristic: Specialized medical centers usually have better infrastructure
  if (name.includes('hospital') || name.includes('clinic')) {
    weights.infrastructure *= 1.1;
    weights.services *= 1.2;
    weights.staffTraining *= 1.1;
  }

  // Heuristic: 'Modern' or 'Center' usually implies newer building codes
  if (name.includes('modern') || name.includes('center') || name.includes('plaza')) {
    weights.infrastructure *= 1.15;
    weights.emergencyReadiness *= 1.1;
  }

  // Heuristic: If we know they support wheelchair, infrastructure is likely high
  if (cats.includes('wheelchair')) {
    weights.infrastructure *= 1.2;
  }

  // Heuristic: Multi-category support implies better staff training
  if (cats.length > 2) {
    weights.staffTraining *= 1.15;
  }

  // 3. Generate the distribution
  // We add some deterministic "noise" based on the facility ID to make it feel less static
  const noise = (id) => {
    const sum = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (sum % 15) - 7; // range -7 to +7
  };

  const facilityNoise = noise(facility.id);

  const scorecard = {
    infrastructure: clamp(baseScorePercent * weights.infrastructure + facilityNoise),
    services: clamp(baseScorePercent * weights.services + (facilityNoise * -0.5)),
    staffTraining: clamp(baseScorePercent * weights.staffTraining + (facilityNoise * 0.8)),
    emergencyReadiness: clamp(baseScorePercent * weights.emergencyReadiness + (facilityNoise * -1.2))
  };

  // 4. Calculate overall confidence
  // Confidence is higher if we have more meta-data (categories, verified status, etc)
  let confidence = 50; // base confidence
  if (facility.verified) confidence += 20;
  confidence += Math.min(30, cats.length * 10);

  return {
    scorecard,
    confidence,
    isPredicted: true
  };
}

function clamp(val) {
  return Math.min(100, Math.max(0, Math.round(val)));
}
