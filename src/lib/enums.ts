// String-backed "enums" (SQLite has no native enum support; values are stored
// as String in Prisma). These constants + types are the single source of truth
// for allowed values across the app.

export const CodeStatus = {
  UNUSED: "UNUSED",
  VERIFIED: "VERIFIED",
  FLAGGED: "FLAGGED",
} as const;
export type CodeStatus = (typeof CodeStatus)[keyof typeof CodeStatus];

export const DeviceType = {
  IPHONE: "IPHONE",
  ANDROID: "ANDROID",
  DESKTOP: "DESKTOP",
  OTHER: "OTHER",
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];
