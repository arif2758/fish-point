import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  description: string;
  items: string[];
  image: string;
  frequency: "weekly" | "monthly";
  savings: number;
  featured?: boolean;
  published: boolean;
  stockStatus: "available" | "unavailable";
}

export interface IPackageDocument extends IPackage, Document {}

const PackageSchema: Schema<IPackageDocument> = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    items: { type: [String], default: [] },
    image: { type: String, required: true },
    frequency: { type: String, enum: ["weekly", "monthly"], required: true },
    savings: { type: Number, default: 0 },
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

const PackageCollectionModel = (mongoose.models.PackageCollection ||
  mongoose.model<IPackageDocument>(
    "PackageCollection",
    PackageSchema
  )) as Model<IPackageDocument>;

export default PackageCollectionModel;
