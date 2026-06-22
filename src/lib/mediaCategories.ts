/**
 * Default media tabs always offered in the admin Category dropdown, even before
 * any media exists. Merged with whatever distinct categories are already in the
 * DB so the field is always a pick-list (prevents typo'd duplicate tabs).
 */
export const DEFAULT_MEDIA_CATEGORIES = ["Trailers", "Commercials"];

export function mergeCategories(dbCategories: string[]): string[] {
  return Array.from(new Set([...DEFAULT_MEDIA_CATEGORIES, ...dbCategories]));
}
