import { isPrivateIp } from "@/lib/ip";

export interface GeoResult {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Look up approximate location for an IP via the free ip-api.com service.
 * Returns {} for private/localhost IPs or on any failure (never throws).
 * Free tier is HTTP-only and rate-limited (~45 req/min) — fine for scan volume.
 */
export async function lookupGeo(ip: string | null | undefined): Promise<GeoResult> {
  if (isPrivateIp(ip)) return {};
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`,
      { cache: "no-store" },
    );
    if (!res.ok) return {};
    const j = await res.json();
    if (j.status !== "success") return {};
    return {
      country: j.country ?? undefined,
      region: j.regionName ?? undefined,
      city: j.city ?? undefined,
      latitude: typeof j.lat === "number" ? j.lat : undefined,
      longitude: typeof j.lon === "number" ? j.lon : undefined,
    };
  } catch {
    return {};
  }
}
