import { Metadata } from "next";
import HomeClient from "./HomeClient";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";
import CategoryNav from "@/components/navigation/CategoryNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fish Point - সেরা তাজা মাছের বাজার",
  description: "অনলাইনে অর্ডার করুন তাজা মাছ। ২০ মিনিটে হোম ডেলিভারি।",
};

async function getProducts() {
  await dbConnect();
  try {
    const products = await ProductCollectionModel.find({ published: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(10)
      .select("-__v")
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Home fetch error:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <CategoryNav />
      <HomeClient products={products} />
      <Footer />
    </>
  );
}
