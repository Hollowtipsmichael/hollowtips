// The Product.socialLinks column is a JSON string (SQLite has no Json type).
// These helpers convert between the stored string and a typed object.

export const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/hollowtips" },
  { key: "x", label: "X / Twitter", placeholder: "https://x.com/hollowtips" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@hollowtips" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@hollowtips" },
  { key: "website", label: "Website", placeholder: "https://hollowtips.com" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["key"];
export type SocialLinks = Partial<Record<SocialPlatform, string>>;

const KEYS = SOCIAL_PLATFORMS.map((p) => p.key) as SocialPlatform[];

export function parseSocialLinks(json?: string | null): SocialLinks {
  if (!json) return {};
  try {
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== "object") return {};
    const out: SocialLinks = {};
    for (const key of KEYS) {
      const value = obj[key];
      if (typeof value === "string" && value.trim()) out[key] = value.trim();
    }
    return out;
  } catch {
    return {};
  }
}

/** Serialize to a compact JSON string, or null when no links are set. */
export function serializeSocialLinks(links: SocialLinks): string | null {
  const cleaned: SocialLinks = {};
  for (const key of KEYS) {
    const value = links[key];
    if (typeof value === "string" && value.trim()) cleaned[key] = value.trim();
  }
  return Object.keys(cleaned).length ? JSON.stringify(cleaned) : null;
}
