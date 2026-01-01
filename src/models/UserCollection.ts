import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types";
import bcrypt from "bcryptjs";

// Extend interface for Mongoose Document
export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    userId: { type: String, unique: true, sparse: true }, // Custom ID, sparse allows null for some
    fullname: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    alternatePhone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String }, // Hashed
    image: { type: String }, // For Auth.js
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Address & Geography
    address: { type: String },
    district: { type: String },
    area: { type: String },

    // Loyalty & Subscription
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    isSubscriber: { type: Boolean, default: false },

    // Auth & Status
    provider: { type: String, default: "credentials" },
    emailVerified: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    orders: { type: [Schema.Types.ObjectId], ref: "Order", default: [] },
  },
  { timestamps: true }
);

// Pre-save Hook for Password Hashing
UserSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
});

// Prevent overwrite error during hot reload
const UserCollectionModel = (mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema)) as Model<IUserDocument>;

export default UserCollectionModel;
