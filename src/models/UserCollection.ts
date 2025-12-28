import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types";

// Extend interface for Mongoose Document
export interface IUserDocument extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: { type: String },
  },
  { timestamps: true }
);

// Prevent overwrite error during hot reload
const UserCollectionModel = (mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema)) as Model<IUserDocument>;

export default UserCollectionModel;
