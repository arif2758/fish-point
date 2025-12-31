import { Metadata } from "next";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";
import OffersClient from "./OffersClient";
import CategoryNav from "@/components/navigation/CategoryNav";

export const metadata: Metadata = {
  title: "বিশেষ অফার | Fish Point - সেরা ডিসকাউন্ট",
  description:
    "Fish Point এর সকল অফার এবং ডিসকাউন্ট পণ্য দেখুন। সাশ্রয়ী দামে তাজা মাছ কিনুন।",
};

async function getOfferProducts() {
  await dbConnect();

  try {
    const products = await ProductCollectionModel.find({
      published: true,
      discountPercentage: { $gt: 0 }, // Only products with discount
    })
      .sort({ discountPercentage: -1, createdAt: -1 }) // Highest discount first
      .select("-__v")
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Offers fetch error:", error);
    return [];
  }
}

export default async function OffersPage() {
  const products = await getOfferProducts();

  return (
    <>
      <CategoryNav />
      <OffersClient products={products} />
    </>
  );
}
