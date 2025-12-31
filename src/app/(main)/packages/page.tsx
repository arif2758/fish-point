import { Metadata } from "next";
import PackagesClient from "./PackagesClient";

import dbConnect from "@/lib/dbConnect";
import PackageCollectionModel, { IPackage } from "@/models/PackageCollection";

export const metadata: Metadata = {
  title: "সাপ্তাহিক ও মাসিক বাজার প্যাকেজ | Fish Point",
  description:
    "সাশ্রয়ী দামে সাপ্তাহিক এবং মাসিক মাছের প্যাকেজ সাবস্ক্রাইব করুন। তাজা মাছ সরাসরি আপনার বাসায়।",
};

async function getPackages() {
  await dbConnect();

  let packages = await PackageCollectionModel.find({ published: true }).lean();

  // STALE DATA CHECK: If we have packages but they missing new fields (like basePrice), clear them
  if (packages.length > 0 && !(packages[0] as unknown as IPackage).basePrice) {
    console.log("Stale package data detected. Refreshing collection...");
    await PackageCollectionModel.deleteMany({});
    packages = [];
  }

  // If no packages in DB, seed initial data for demonstration
  if (packages.length === 0) {
    const initialPackages = [
      {
        packageId: "pw-1",
        name: "সাপ্তাহিক বাজার (ছোট পরিবার)",
        slug: "weekly-small-family",
        basePrice: 1500,
        discountPercentage: 16.6,
        salePrice: 1250,
        description:
          "৩-৪ জনের একটি ছোট পরিবারের সপ্তাহের মাছের চাহিদা মেটাতে সেরা প্যাকেজ।",
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
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P006",
            name: "সিং মাছ",
            defaultKg: 0.25,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P008",
            name: "ইলিশ মাছ",
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
      },
      {
        packageId: "pw-2",
        name: "ফ্যামিলি ফিষ্ট (সাপ্তাহিক)",
        slug: "family-feast-weekly",
        basePrice: 2900,
        discountPercentage: 17.2,
        salePrice: 2400,
        description:
          "সব ধরণের ফ্রেশ মাছের কম্বিনেশনে আপনার পুরো সপ্তাহের মাছের বাজার।",
        items: [
          {
            productId: "P002",
            name: "রুই/কাতলা",
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
            productId: "P007",
            name: "পাবদা",
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P010",
            name: "সামুদ্রিক কদমা",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
        featured: true,
      },
      {
        packageId: "pm-1",
        name: "মাসিক সাশ্রয় প্যাকেজ",
        slug: "monthly-savings-pack",
        basePrice: 6000,
        discountPercentage: 18.3,
        salePrice: 4900,
        description:
          "পুরো মাসের ঝক্কি এড়াতে মাসিক প্যাকেজে পাচ্ছেন সব মাছ একসাথে।",
        items: [
          {
            productId: "P002",
            name: "رুই/কাতলা",
            defaultKg: 4,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P005",
            name: "তেলাপিয়া",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P004",
            name: "চিংড়ি",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P008",
            name: "ইলিশ",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P009",
            name: "শোল",
            defaultKg: 0.5,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
        image:
          "https://images.unsplash.com/photo-1553659971-f01207815844?q=80&w=800&auto=format&fit=crop",
        frequency: "monthly",
      },
      {
        packageId: "pm-2",
        name: "প্রিমিয়াম মাসিক প্যাকেজ",
        slug: "premium-monthly-pack",
        basePrice: 10500,
        discountPercentage: 19,
        salePrice: 8500,
        description:
          "বিলাসবহুল এবং সবধরণের প্রিমিয়াম মাছ নিয়ে আমাদের সেরা মাসিক প্যাকেজ।",
        items: [
          {
            productId: "P011",
            name: "রুই বড়",
            defaultKg: 5,
            isOptional: false,
            selectedByDefault: true,
          },
          {
            productId: "P012",
            name: "গলদা চিংড়ি",
            defaultKg: 2,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P013",
            name: "বড় ইলিশ",
            defaultKg: 3,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P014",
            name: "সুরমা",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
          {
            productId: "P015",
            name: "কোরাল",
            defaultKg: 1,
            isOptional: true,
            selectedByDefault: true,
          },
        ],
        image:
          "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=800&auto=format&fit=crop",
        frequency: "monthly",
        featured: true,
      },
    ];

    await PackageCollectionModel.insertMany(initialPackages);
    packages = await PackageCollectionModel.find({ published: true }).lean();
  }

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
