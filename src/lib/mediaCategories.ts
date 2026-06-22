/**
 * Media sections shown as tabs on the public /media page.
 *
 * Video items use a free-pick category ("Trailers" / "Commercials" / custom).
 * Download & Wallpaper items are auto-filed under fixed section names so they
 * become their own tabs. The admin Category dropdown only offers the video
 * categories; the public page always shows the full ordered tab list.
 */
export const DEFAULT_VIDEO_CATEGORIES = ["Trailers", "Commercials"];

export const DOWNLOADS_CATEGORY = "Downloads";
export const WALLPAPER_CATEGORY = "Wallpaper/Artwork";

/** Category auto-assigned to a media item from its type. */
export function categoryForType(type: string, videoCategory: string): string {
  if (type === "download") return DOWNLOADS_CATEGORY;
  if (type === "wallpaper") return WALLPAPER_CATEGORY;
  return videoCategory;
}

/** Ordered, always-shown public tab list (defaults + any custom categories). */
export const SECTION_TABS = [
  ...DEFAULT_VIDEO_CATEGORIES,
  DOWNLOADS_CATEGORY,
  WALLPAPER_CATEGORY,
];

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

/** Video-category options for the admin dropdown. */
export function mergeVideoCategories(dbVideoCategories: string[]): string[] {
  return uniq([...DEFAULT_VIDEO_CATEGORIES, ...dbVideoCategories]);
}

/** Public tabs: fixed sections first, then any extra custom categories. */
export function mergeSections(dbCategories: string[]): string[] {
  return uniq([...SECTION_TABS, ...dbCategories]);
}
