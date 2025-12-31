import mongoose, { Schema, Document, } from "mongoose";

export interface IPackageItem {
  productId: string;
  name: string; // fallback or display name
  defaultKg: number;
  isOptional: boolean;
  selectedByDefault: boolean;
}

export interface IPackage {
  packageId: string;
  name: string;
  slug: string;
  basePrice: number;
  discountPercentage: number;
  salePrice: number;
  description: string;
  items: IPackageItem[];
  image: string;
  frequency: "weekly" | "monthly";
  featured?: boolean;
  published: boolean;
  stockStatus: "available" | "unavailable";
}

export interface IPackageDocument extends IPackage, Document {}

const PackageItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  defaultKg: { type: Number, required: true, min: 0 },
  isOptional: { type: Boolean, default: false },
  selectedByDefault: { type: Boolean, default: true },
});

const PackageSchema: Schema<IPackageDocument> = new Schema(
  {
    packageId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    salePrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    items: { type: [PackageItemSchema], default: [] },
    image: { type: String, required: true },
    frequency: { type: String, enum: ["weekly", "monthly"], required: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    stockStatus: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Pre-save Hook for Price Calculation
PackageSchema.pre("save", async function (this: IPackageDocument) {
  if (this.isModified("basePrice") || this.isModified("discountPercentage")) {
    this.salePrice = this.basePrice * (1 - this.discountPercentage / 100);
  }
});

// Force a refresh of the model if the schema has changed significantly
if (mongoose.models.PackageCollection) {
  delete mongoose.models.PackageCollection;
}

const PackageCollectionModel = mongoose.model<IPackageDocument>(
  "PackageCollection",
  PackageSchema
);

export default PackageCollectionModel;
