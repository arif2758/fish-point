import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import PackageCollectionModel, {
  IPackage,
  IPackageItem,
} from "@/models/PackageCollection";
import ProductCollectionModel from "@/models/ProductCollection";
import PackageDetailClient from "./PackageDetailClient";
import Footer from "@/components/Footer";
import { IProduct } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPackageBySlug(slug: string) {
  await dbConnect();
  const pkg = (await PackageCollectionModel.findOne({
    slug,
    published: true,
  }).lean()) as IPackage | null;

  if (!pkg) return null;

  // Fetch products associated with the package items
  const itemProductIds = pkg.items.map((item: IPackageItem) => item.productId);
  const products = await ProductCollectionModel.find({
    productId: { $in: itemProductIds },
  }).lean();

  return {
    pkg: JSON.parse(JSON.stringify(pkg)) as IPackage,
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPackageBySlug(slug);

  if (!data) return { title: "Package Not Found" };

  return {
    title: `${data.pkg.name} | Fish Point`,
    description: data.pkg.description,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getPackageBySlug(slug);

  if (!data) notFound();

  // Fetch all published packages to show in the "Other Packages" section
  const allPackages = await PackageCollectionModel.find({
    published: true,
    slug: { $ne: slug },
  })
    .lean()
    .limit(4);

  return (
    <>
      <PackageDetailClient
        pkg={data.pkg}
        products={data.products}
        allPackages={JSON.parse(JSON.stringify(allPackages))}
      />
      <Footer />
    </>
  );
}
