/**
 * Format a numeric price as a whole-dollar string (e.g. "$42").
 * Pass two values to show a range when they differ (e.g. "$42 – $60").
 */
export function formatPrice(min: number, max?: number): string {
  if (max !== undefined && max !== min) {
    return `$${min.toFixed(0)} – $${max.toFixed(0)}`;
  }
  return `$${min.toFixed(0)}`;
}
