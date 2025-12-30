import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import PackageCollectionModel from "@/models/PackageCollection";
import PackageDetailClient from "./PackageDetailClient";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPackageBySlug(slug: string) {
  await dbConnect();
  const pkg = await PackageCollectionModel.findOne({
    slug,
    published: true,
  }).lean();
  return pkg ? JSON.parse(JSON.stringify(pkg)) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) return { title: "Package Not Found" };

  return {
    title: `${pkg.name} | Fish Point`,
    description: pkg.description,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) notFound();

  return (
    <>
      <PackageDetailClient pkg={pkg} />
      <Footer />
    </>
  );
}
