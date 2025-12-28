import { Types } from "mongoose";

// ১. ইউজার ইন্টারফেস (নতুন যোগ করা হলো)
export interface IUser {
  _id: string; // Frontend uses string ID
  name: string;
  phone: string;
  email?: string;
  role: "customer" | "admin";
  address?: string;
  createdAt?: Date;
}

// ২. মেইন প্রোডাক্ট ইন্টারফেস
export interface IProduct {
  // Basic & Meta Data
  productId: string;
  title: string;
  name_en: string;
  slug: string;
  category: string;

  // Pricing
  basePrice: number; // Regular Price
  discountPercentage: number;
  salePrice: number; // Auto-calculated (basePrice - discount)
  priceLastUpdatedDate: Date;

  // Inventory 
  stockKg: number;
  isOutOfStock: boolean;
  minOrderKg: number;
  maxOrderKg: number;

  // Product Options (Simplified Arrays for Select Dropdowns)
  fishSize?: string;
  cuttingSizes: string[]; // e.g. ["Medium", "Large", "Fry Cut"]
  cuttingStyles: string[]; // e.g. ["Skin On", "Skin Off", "Fillet"]
  headCutOptions: number[]; // e.g. [2, 4, 6] - Changed to number[] for better typing

  // Source & Attributes
  availableSource: string; // Single source e.g. "River"
  fishType: string; // e.g. "Pangas"
  isWildCaught: boolean;
  quality: string; // e.g. "Premium"

  // Details
  shortDescription?: string;
  description?: string;
  published: boolean;
  isFeatured: boolean;

  // Flags for UI Control
  isHeadAvailable: boolean; // Show/Hide Head Cut Option

  // Media
  mainImage: string;
  galleryImages: string[];

  // Delivery & Logistics
  packagingType: "Vaccum Seal" | "Airtight Box" | "Poly Bag";
  isFragile: boolean;
  deliveryConstraint?: string;
  estimatedProcessingTime: number; 
  minPreOrderNoticeHours: number;

  // Cooking Info
  suitableFor: string[];
  cookDifficulty: "সহজ" | "মাঝারি" | "কঠিন";
  texture: "নরম" | "শক্ত";
  fatContent: "বেশি চর্বিযুক্ত" | "মাঝারি" | "চর্বি কম";
  smellIntensity: "স্বল্প গন্ধ" | "সাধারণ গন্ধ";
  bakingInstruction?: string;

  // Reviews & Stats
  averageRating: number;
  totalReviews: number;
  unitsSold: number;

  // SEO & Compliance
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  complianceCert?: string;
  allergenInfo?: string[];
  shelfLifeDays: number;
  storageInstruction?: string;
}

// ৩. কাস্টম রিকোয়েস্ট ইন্টারফেস (আপডেট করা হলো)
export interface ICustomRequest {
  _id?: string; // Optional for frontend key usage
  requestId: string;
  // userId can be ObjectId (backend ref) or Populated User Object (frontend display)
  userId: string | Types.ObjectId | IUser; 
  requestedFishName: string;
  preferredWeight: string;
  budgetLimit?: number;
  status: "pending" | "price_offered" | "confirmed" | "delivered" | "cancelled";
  adminOfferedPrice?: number;
  adminNotes?: string;
  images: string[];
  createdAt?: string | Date; // Frontend friendly date string
}