import { DeviceType } from "@/lib/enums";

/** Best-effort device classification from a User-Agent string. */
export function detectDevice(ua: string | null | undefined): DeviceType {
  const s = (ua || "").toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return DeviceType.IPHONE;
  if (/android/.test(s)) return DeviceType.ANDROID;
  if (/windows|macintosh|mac os|linux|x11|cros/.test(s)) return DeviceType.DESKTOP;
  return DeviceType.OTHER;
}
