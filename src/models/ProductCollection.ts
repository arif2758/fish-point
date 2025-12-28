import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "@/types";

// 1. Extend the Interface
export interface IProductDocument extends IProduct, Document {}

// 2. Main Product Schema
const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    // 1. Basic & Meta Data
    productId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    name_en: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },

    // 2. Pricing
    basePrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    salePrice: { type: Number, required: true, min: 0 },
    priceLastUpdatedDate: { type: Date, default: Date.now },

    // 3. Simplified Options (Arrays)
    fishSize: {
      type: String,
      trim: true,
      // Optional field - only for products with size variants
    },
    cuttingSizes: { type: [String], default: [] },
    cuttingStyles: { type: [String], default: [] },
    headCutOptions: { type: [Number], default: [] },

    // 4. Source & Attributes
    availableSource: { type: String, required: true },
    fishType: { type: String, required: true },
    isWildCaught: { type: Boolean, default: false },
    quality: { type: String, required: true },

    // 5. Inventory
    stockKg: { type: Number, default: 0, min: 0 },
    isOutOfStock: { type: Boolean, default: false },
    minOrderKg: { type: Number, required: true, min: 0.5 },
    maxOrderKg: { type: Number, required: true, min: 0.5 },
    minPreOrderNoticeHours: { type: Number, default: 0 },

    // 6. Details
    shortDescription: { type: String },
    description: { type: String },
    published: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isHeadAvailable: { type: Boolean, default: true },

    // 7. Media
    mainImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },

    // 8. Logistics
    packagingType: {
      type: String,
      enum: ["Vaccum Seal", "Airtight Box", "Poly Bag"],
      default: "Poly Bag",
    },
    isFragile: { type: Boolean, default: false },
    deliveryConstraint: { type: String },
    estimatedProcessingTime: { type: Number, default: 45 },

    // 9. Cooking Info
    suitableFor: { type: [String], default: [] },
    cookDifficulty: { type: String, enum: ["সহজ", "মাঝারি", "কঠিন"] },
    texture: { type: String, enum: ["নরম", "শক্ত"] },
    fatContent: {
      type: String,
      enum: ["বেশি চর্বিযুক্ত", "মাঝারি", "চর্বি কম"],
    },
    smellIntensity: { type: String, enum: ["স্বল্প গন্ধ", "সাধারণ গন্ধ"] },
    bakingInstruction: { type: String },

    // 10. Reviews & Stats
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },

    // 11. SEO & Compliance
    seoTitle: { type: String },
    seoDescription: { type: String },
    tags: { type: [String], default: [] },
    complianceCert: { type: String },
    allergenInfo: { type: [String] },
    shelfLifeDays: { type: Number, default: 2 },
    storageInstruction: { type: String },
  },
  { timestamps: true }
);

// Text Indexing
ProductSchema.index({
  title: "text",
  name_en: "text",
  category: "text",
  tags: "text",
});

// Pre-save Hook for Price Calculation
ProductSchema.pre("save", async function (this: IProductDocument) {
  if (this.isModified("basePrice") || this.isModified("discountPercentage")) {
    this.salePrice = this.basePrice * (1 - this.discountPercentage / 100);
  }
});

const ProductCollectionModel = (mongoose.models.ProductCollection ||
  mongoose.model<IProductDocument>(
    "ProductCollection",
    ProductSchema
  )) as Model<IProductDocument>;

export default ProductCollectionModel;
 