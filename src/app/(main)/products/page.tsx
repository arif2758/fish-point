import { Metadata } from "next";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";
import { IProduct } from "@/types";
import ProductsPageClient from "./ProductsPageClient";
import CategoryNav from "@/components/navigation/CategoryNav";

export const metadata: Metadata = {
  title: "তাজা মাছ | সকালে তাজা কাটিং | 20 মিনিটে ডেলিভারি",
  description:
    "প্রিমিয়াম কোয়ালিটির তাজা মাছ কিনুন। পাঙ্গাস, তেলাপিয়া, চিংড়ি সহ সব ধরনের মাছ। সকালে তাজা কাটিং, 20 মিনিটে ডেলিভারি।",
};

async function getAllProducts(): Promise<IProduct[]> {
  await dbConnect();
  try {
    const products = await ProductCollectionModel.find({ published: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .select("-__v")
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <CategoryNav />
      <ProductsPageClient products={products} />
    </>
  );
}