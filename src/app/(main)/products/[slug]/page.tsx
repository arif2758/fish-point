import { notFound } from "next/navigation";
import { Metadata } from "next";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";
import ProductDetailClient from "./ProductDetailClient";

// ✅ Correct Type Definition for Next.js 15+
interface Props {
  params: Promise<{ slug: string }>;
}

// SEO Metadata Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ Await params before accessing properties
  const { slug } = await params;

  await dbConnect();
  const product = await ProductCollectionModel.findOne({ slug }).lean();
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | Fish Point`,
    description: product.shortDescription,
    openGraph: {
      images: [product.mainImage],
    },
  };
}

async function getProduct(slug: string) {
  await dbConnect();
  const product = await ProductCollectionModel.findOne({ slug, published: true }).lean();
  // MongoDB Object ID এবং Date অবজেক্টগুলোকে সিরিয়ালাইজ করার জন্য
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductDetailPage({ params }: Props) {
  // ✅ Await params here as well
  const { slug } = await params;
  
  const product = await getProduct(slug);
  
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}