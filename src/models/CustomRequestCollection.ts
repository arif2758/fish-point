import { ICustomRequest } from "@/types";
import mongoose, { Schema, Document, Model } from "mongoose";

// Extend the Interface
// Note: We use Omit to avoid conflict with Document's _id
export interface ICustomRequestDocument
  extends Omit<ICustomRequest, "_id" | "userId">,
    Document {
  userId: mongoose.Types.ObjectId; // Backend strictly uses ObjectId
}

const CustomRequestSchema: Schema<ICustomRequestDocument> = new Schema(
  {
    requestId: {
      type: String,
      default: () => `REQ-${Date.now().toString().slice(-6)}`,
      unique: true,
    },
    // Reference to the User model we just created
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },

    requestedFishName: { type: String, required: true },
    preferredWeight: { type: String, required: true },
    budgetLimit: { type: Number },

    status: {
      type: String,
      enum: ["pending", "price_offered", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },

    adminOfferedPrice: { type: Number },
    adminNotes: { type: String },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const CustomRequestCollectionModel = (mongoose.models.CustomRequest ||
  mongoose.model<ICustomRequestDocument>(
    "CustomRequestCollection",
    CustomRequestSchema
  )) as Model<ICustomRequestDocument>;

export default CustomRequestCollectionModel;
