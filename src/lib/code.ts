import { randomBytes } from "node:crypto";

// Crockford base32 minus ambiguous characters (no I, L, O, U, 0, 1).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const CODE_LEN = 10;
const PREFIX = "HT-";

/** Generate a unique-ish, non-ambiguous code string, e.g. "HT-9F2AB7C1KD". */
export function generateCodeString(): string {
  const bytes = randomBytes(CODE_LEN);
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return PREFIX + out;
}

/**
 * A code scanned from more than this many DISTINCT IPs is auto-flagged as a
 * likely clone (the same code copied onto many counterfeit units). A single
 * owner re-checking from one network won't trip it.
 */
export const FLAG_DISTINCT_IP_THRESHOLD = 5;

/** The public verification URL a QR/scan resolves to (page built in Module 4). */
export function verifyUrl(code: string, base?: string): string {
  const origin = (base || process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
  return `${origin}/verify/${code}`;
}
