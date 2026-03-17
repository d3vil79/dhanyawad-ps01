/**
 * profileMatcher.js
 *
 * Computes how well a facility matches a user's accessibility needs profile.
 * Score: 0–100 (higher = better match).
 */

// Maps user need IDs → facility category IDs they relate to
export const NEED_TO_CATEGORIES = {
  wheelchair:  ['wheelchair'],
  visual:      ['visual'],
  hearing:     ['hearing'],
  mental:      ['mental'],
  motor:       ['wheelchair', 'motor'],
  chronic:     ['wheelchair', 'mental'],
  cognitive:   ['mental', 'cognitive'],
  autism:      ['mental', 'sensory'],
  braille:     ['visual'],
  speech:      ['hearing'],
  sensory:     ['mental', 'sensory'],
};

/**
 * Compute a 0–100 match score between a facility and user needs.
 *
 * Logic:
 *  - For each user need, check if the facility has ≥1 matching category.
 *  - Score = (needs covered / total needs) × 100
 *  - Bonus: +5 per extra matched category beyond the minimum.
 */
export function computeMatchScore(facility, userNeeds) {
  if (!userNeeds || userNeeds.length === 0) return 0;

  const facilityCategories = new Set(facility.categories || []);

  let covered = 0;
  let bonuses = 0;

  for (const need of userNeeds) {
    const relatedCats = NEED_TO_CATEGORIES[need] || [need];
    const matchedCats = relatedCats.filter(c => facilityCategories.has(c));
    if (matchedCats.length > 0) {
      covered += 1;
      bonuses += matchedCats.length - 1; // extra matched cats = bonus
    }
  }

  const baseScore = (covered / userNeeds.length) * 100;
  const bonusScore = Math.min(bonuses * 5, 15); // cap bonus at 15 pts
  return Math.min(Math.round(baseScore + bonusScore), 100);
}

/**
 * Return a copy of the array sorted by profile match (desc), then distance (asc).
 */
export function sortByProfileMatch(facilities, userNeeds) {
  return [...facilities].sort((a, b) => {
    const scoreA = computeMatchScore(a, userNeeds);
    const scoreB = computeMatchScore(b, userNeeds);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (a.distance ?? 0) - (b.distance ?? 0);
  });
}

/**
 * Returns a label and colour for a given match score.
 */
export function matchLabel(score) {
  if (score >= 75) return { label: 'Great Match',  color: '#16A34A', bg: '#DCFCE7' };
  if (score >= 50) return { label: 'Good Match',   color: '#D97706', bg: '#FEF3C7' };
  if (score >= 25) return { label: 'Partial Match', color: '#EA580C', bg: '#FFF7ED' };
  return              { label: 'Low Match',    color: '#DC2626', bg: '#FEF2F2' };
}
