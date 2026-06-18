import { z } from "zod";

// Optional text field that turns empty strings into undefined.
const optionalText = z
  .string()
  .trim()
  .max(5000)
  .optional()
  .transform((v) => (v ? v : undefined));

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL.")
  .optional()
  .or(z.literal("").transform(() => undefined));

// INDICA | SATIVA | HYBRID (or empty)
const optionalType = z
  .enum(["INDICA", "SATIVA", "HYBRID"])
  .optional()
  .or(z.literal("").transform(() => undefined));

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  slug: optionalText, // optional manual override; slugified server-side
  sku: optionalText,
  size: optionalText,
  strainName: optionalText,
  productType: optionalType,
  description: optionalText,
  ingredients: optionalText,
  warningText: optionalText,
  // Media: stored URLs (paths returned by the upload route, e.g. /uploads/x.png)
  productImageUrl: optionalText,
  artworkUrl: optionalText,
  videoUrl: optionalText,
  socialLinks: z
    .object({
      instagram: optionalUrl,
      x: optionalUrl,
      tiktok: optionalUrl,
      youtube: optionalUrl,
      website: optionalUrl,
    })
    .partial()
    .optional(),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductParsed = z.output<typeof productSchema>;

export const mediaSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  category: z.string().trim().min(1, "Category is required.").max(60),
  videoUrl: z.string().trim().min(1, "Video URL or upload is required.").max(2000),
  thumbnailUrl: optionalText,
  publishedAt: optionalText, // ISO date string from <input type=date>
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export type MediaInput = z.input<typeof mediaSchema>;

export const variantSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required.").max(120),
  strainName: optionalText,
  productType: optionalType,
  artworkUrl: optionalText,
  productImageUrl: optionalText,
  isActive: z.boolean().default(true),
});

export type VariantInput = z.input<typeof variantSchema>;
