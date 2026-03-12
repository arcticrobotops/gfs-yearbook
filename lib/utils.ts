/**
 * Format a numeric price as a whole-dollar string (e.g. "$42").
 * Pass two values to show a range when they differ (e.g. "$42 – $60").
 * Returns "$0" for NaN or invalid values.
 */
export function formatPrice(min: number, max?: number): string {
  const safeMin = Number.isFinite(min) ? min : 0;
  if (max !== undefined && Number.isFinite(max) && max !== safeMin) {
    return `$${safeMin.toFixed(0)} – $${max.toFixed(0)}`;
  }
  return `$${safeMin.toFixed(0)}`;
}
