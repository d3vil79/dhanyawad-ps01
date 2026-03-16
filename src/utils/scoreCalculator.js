/**
 * Returns a color string based on accessible score (1–10).
 */
export function scoreColor(score) {
  if (score >= 8) return '#059669'; // great - green
  if (score >= 6) return '#D97706'; // ok - amber
  return '#DC2626';                  // poor - red
}

export function scoreLabel(score) {
  if (score >= 8) return 'Great';
  if (score >= 6) return 'Okay';
  return 'Limited';
}

/**
 * Calculate a weighted 1–10 accessibility score from a feature map.
 * Each category is worth a portion of the total.
 */
export function calculateScore(features) {
  const categories = Object.values(features);
  if (!categories.length) return 0;

  const totals = categories.map(cat => {
    const items = cat.items || [];
    const available = items.filter(i => i.available).length;
    return items.length > 0 ? available / items.length : 0;
  });

  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  return Math.round(avg * 100) / 10;
}
