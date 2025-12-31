import { Metadata } from "next";
import PackagesClient from "./PackagesClient";

import dbConnect from "@/lib/dbConnect";
import PackageCollectionModel, { IPackage } from "@/models/PackageCollection";

export const metadata: Metadata = {
  title: "সাপ্তাহিক ও মাসিক বাজার প্যাকেজ | Fish Point",
  description:
    "সাশ্রয়ী দামে সাপ্তাহিক এবং মাসিক মাছের প্যাকেজ সাবস্ক্রাইব করুন। তাজা মাছ সরাসরি আপনার বাসায়।",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPackages() {
  await dbConnect();

  // Find all PUBLISHED packages
  let packages = await PackageCollectionModel.find({ published: true }).lean();

  const weeklyCount = packages.filter((p) => p.frequency === "weekly").length;
  const monthlyCount = packages.filter((p) => p.frequency === "monthly").length;

  // RE-SEED CHECK: If anything is missing, Nuke once and re-seed
  if (packages.length === 0 || weeklyCount < 2 || monthlyCount < 2) {
    await PackageCollectionModel.deleteMany({});

    const initialPackages: IPackage[] = [
      {
        packageId: "nx-w1",
        name: "সাস্রয়ী সাপ্তাহিক বাজার",
        slug: "weekly-eco-nx",
        basePrice: 1500,
        discountPercentage: 16.6,
        salePrice: 1250,
        description:
          "৩-৪ জনের একটি ছোট পরিবারের সপ্তাহের মাছের চাহিদা মেটাতে সেরা বাজেট প্যাকেজ।",
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
        published: true,
        stockStatus: "available",
        items: [
          {
            productId: "P001",
            name: "রুই মাছ",
            defaultKg: 1,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P005",
            name: "তেলাপিয়া",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P006",
            name: "সিং মাছ",
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
      },
      {
        packageId: "nx-w2",
        name: "ফ্যামিলি ফিষ্ট",
        slug: "family-feast-nx",
        basePrice: 3200,
        discountPercentage: 18.75,
        salePrice: 2600,
        description:
          "সব ধরণের ফ্রেশ মাছের কম্বিনেশনে আপনার পুরো সপ্তাহের মাছের বাজার।",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
        featured: true,
        published: true,
        stockStatus: "available",
        items: [
          {
            productId: "P002",
            name: "কাতলা মাছ",
            defaultKg: 1.5,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P003",
            name: "চিংড়ি (বাগদা)",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P004",
            name: "চিংড়ি (গলদা)",
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P008",
            name: "ইলিশ মাছ",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
      },
      {
        packageId: "nx-m1",
        name: "মাসিক সাশ্রয় বাজার",
        slug: "monthly-eco-nx",
        basePrice: 5500,
        discountPercentage: 18.2,
        salePrice: 4500,
        description:
          "পুরো মাসের মাছের ঝামেলা থেকে মুক্তি পেতে স্মার্ট পরিবারের জন্য সাশ্রয়ী প্যাকেজ।",
        image:
          "https://images.unsplash.com/photo-1553659971-f01207815844?q=80&w=800&auto=format&fit=crop",
        frequency: "monthly",
        published: true,
        stockStatus: "available",
        items: [
          {
            productId: "P001",
            name: "রুই মাছ",
            defaultKg: 4,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P002",
            name: "কাতলা মাছ",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P005",
            name: "তেলাপিয়া",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
      },
      {
        packageId: "nx-m2",
        name: "আল্টিমেট মাসিক বাজার",
        slug: "ultimate-bazar-nx",
        basePrice: 12000,
        discountPercentage: 20.8,
        salePrice: 9500,
        description:
          "সব ধরণের প্রিমিয়াম মাছের সমাহারে আমাদের সবচেয়ে বড় এবং সেরা মাসিক প্যাকেজ।",
        image:
          "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800&auto=format&fit=crop",
        frequency: "monthly",
        featured: true,
        published: true,
        stockStatus: "available",
        items: [
          {
            productId: "P001",
            name: "রুই বড়",
            defaultKg: 5,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P003",
            name: "বাগদা চিংড়ি",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P008",
            name: "বড় ইলিশ",
            defaultKg: 3,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
      },
    ];

    await PackageCollectionModel.insertMany(initialPackages);
    packages = await PackageCollectionModel.find({ published: true }).lean();
  }

  console.log(`>>> [DEBUG] Returning ${packages.length} packages to client.`);
  return JSON.parse(JSON.stringify(packages));
}

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <>
      <PackagesClient packages={packages} />
    </>
  );
}
