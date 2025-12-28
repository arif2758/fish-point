import { z } from "zod"

// ✅ Improved Schema with Proper Optional Handling
export const productSchema = z.object({
  // Basic Info
  title: z.string().min(2, "Name must be at least 2 characters"),
  name_en: z.string().min(2, "English name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  category: z.string().min(1, "Category is required"),
  
  // Pricing
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  
  // Inventory
  stockKg: z.coerce.number().min(0, "Stock cannot be negative"),
  minOrderKg: z.coerce.number().min(0.5, "Minimum order 0.5 kg"),
  maxOrderKg: z.coerce.number().min(1, "Max order must be > min order"),
  
  // Attributes
  fishType: z.string().min(1, "Fish type is required"),
  availableSource: z.string().min(1, "Source is required"),
  quality: z.string().min(1, "Quality is required"),
  
  // Boolean Flags
  isWildCaught: z.boolean().default(false), 
  published: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHeadAvailable: z.boolean().default(true),
  isFragile: z.boolean().default(false),

  // ✅ Fixed Optional Fields - use transform instead of 'or'
  fishSize: z.string().optional().transform(val => val || undefined),
  cuttingSizes: z.string().optional().transform(val => val || undefined),
  cuttingStyles: z.string().optional().transform(val => val || undefined),
  headCutOptions: z.string().optional().transform(val => val || undefined),
  
  // Details
  description: z.string().optional().transform(val => val || undefined),
  shortDescription: z.string().optional().transform(val => val || undefined),
  
  // Media
  mainImage: z.string().url("Valid image URL is required"),
  
  // Logistics & Cooking (Enums)
  packagingType: z.enum(["Vaccum Seal", "Airtight Box", "Poly Bag"]),
  cookDifficulty: z.enum(["সহজ", "মাঝারি", "কঠিন"]),
  texture: z.enum(["নরম", "শক্ত"]),
  fatContent: z.enum(["বেশি চর্বিযুক্ত", "মাঝারি", "চর্বি কম"]),
  smellIntensity: z.enum(["স্বল্প গন্ধ", "সাধারণ গন্ধ"]),
})

export type ProductFormValues = z.infer<typeof productSchema>