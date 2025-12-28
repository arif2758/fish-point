"use server";

import { productSchema, ProductFormValues } from "@/lib/validations/product";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";
import { revalidatePath } from "next/cache";

export async function createProduct(data: ProductFormValues) {
  try {
    // 1. Validate data on server side
    const validatedFields = productSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid fields. Please check inputs.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 2. Process Data (Convert comma separated strings to arrays)
    const productData = {
      ...validatedFields.data,
      productId: `PROD-${Date.now()}`, // Simple ID generation
      salePrice:
        validatedFields.data.basePrice *
        (1 - validatedFields.data.discountPercentage / 100),
      cuttingSizes: validatedFields.data.cuttingSizes
        ? validatedFields.data.cuttingSizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      cuttingStyles: validatedFields.data.cuttingStyles
        ? validatedFields.data.cuttingStyles
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      headCutOptions: validatedFields.data.headCutOptions
        ? validatedFields.data.headCutOptions
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !isNaN(n))
        : [],
    };

    // 3. Save to DB
    await dbConnect();
    await ProductCollectionModel.create(productData);

    // 4. Revalidate Cache
    revalidatePath("/dashboard/products");

    return { status: "success", message: "Product created successfully!" };
  } catch (error) {
    console.error("Create Product Error:", error);
    return {
      status: "error",
      message: "Database Error: Failed to create product.",
    };
  }
}

// ✅ Fetch Product by ID (Server Side)
export async function getProductById(id: string) {
  try {
    await dbConnect();
    const product = await ProductCollectionModel.findOne({
      productId: id,
    }).lean();

    if (!product) return null;

    // Convert MongoDB document to plain object & handle arrays
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return null;
  }
}

// ✅ Update Product Action
export async function updateProduct(id: string, data: ProductFormValues) {
  try {
    const validatedFields = productSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid fields.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const updateData = {
      ...validatedFields.data,
      salePrice:
        validatedFields.data.basePrice *
        (1 - validatedFields.data.discountPercentage / 100),
      cuttingSizes: validatedFields.data.cuttingSizes
        ? validatedFields.data.cuttingSizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      cuttingStyles: validatedFields.data.cuttingStyles
        ? validatedFields.data.cuttingStyles
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      headCutOptions: validatedFields.data.headCutOptions
        ? validatedFields.data.headCutOptions
            .split(",")
            .map((n) => Number(n.trim()))
            .filter((n) => !isNaN(n))
        : [],
    };

    await dbConnect();
    const updatedProduct = await ProductCollectionModel.findOneAndUpdate(
      { productId: id },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return { status: "error", message: "Product not found." };
    }

    revalidatePath("/dashboard/products");
    return { status: "success", message: "Product updated successfully!" };
  } catch (error) {
    console.error("Update Error:", error);
    return {
      status: "error",
      message: "Database Error: Failed to update product.",
    };
  }
}
