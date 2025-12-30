import { Metadata } from "next";
import PackagesClient from "./PackagesClient";
import Footer from "@/components/Footer";
import dbConnect from "@/lib/dbConnect";
import PackageCollectionModel from "@/models/PackageCollection";

export const metadata: Metadata = {
  title: "সাপ্তাহিক ও মাসিক বাজার প্যাকেজ | Fish Point",
  description:
    "সাশ্রয়ী দামে সাপ্তাহিক এবং মাসিক মাছের প্যাকেজ সাবস্ক্রাইব করুন। তাজা মাছ সরাসরি আপনার বাসায়।",
};

async function getPackages() {
  await dbConnect();

  let packages = await PackageCollectionModel.find({ published: true }).lean();

  // If no packages in DB, seed initial data for demonstration
  if (packages.length === 0) {
    const initialPackages = [
      {
        id: "pw-1",
        name: "সাপ্তাহিক বাজার (ছোট পরিবার)",
        slug: "weekly-small-family",
        price: 1250,
        originalPrice: 1500,
        savings: 16,
        description:
          "৩-৪ জনের একটি ছোট পরিবারের সপ্তাহের মাছের চাহিদা মেটাতে সেরা প্যাকেজ।",
        items: [
          "১ কেজি রুই মাছ",
          "৫০০ গ্রাম তেলাপিয়া",
          "২৫০ গ্রাম সিং মাছ",
          "৫০০ গ্রাম ইলিশ মাছ",
        ],
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
      },
      {
        id: "pw-2",
        name: "ফ্যামিলি ফিষ্ট (সাপ্তাহিক)",
        slug: "family-feast-weekly",
        price: 2400,
        originalPrice: 2900,
        savings: 17,
        description:
          "সব ধরণের ফ্রেশ মাছের কম্বিনেশনে আপনার পুরো সপ্তাহের মাছের বাজার।",
        items: [
          "১.৫ কেজি রুই/কাতলা",
          "১ কেজি চিংড়ি (বাগদা)",
          "৫০০ গ্রাম পাবদা",
          "১ কেজি সামুদ্রিক কদমা",
        ],
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop",
        frequency: "weekly",
        featured: true,
      },
      {
        id: "pm-1",
        name: "মাসিক সাশ্রয় প্যাকেজ",
        slug: "monthly-savings-pack",
        price: 4900,
        originalPrice: 6000,
        savings: 18,
        description:
          "পুরো মাসের ঝক্কি এড়াতে মাসিক প্যাকেজে পাচ্ছেন সব মাছ একসাথে।",
        items: [
          "৪ কেজি রুই/কাতলা",
          "২ কেজি তেলাপিয়া",
          "১ কেজি চিংড়ি",
          "২ কেজি ইলিশ",
          "৫০০ গ্রাম শোল",
        ],
        image:
          "https://images.unsplash.com/photo-1553659971-f01207815844?q=80&w=800&auto=format&fit=crop",
        frequency: "monthly",
      },
      {
        id: "pm-2",
        name: "প্রিমিয়াম মাসিক প্যাকেজ",
        slug: "premium-monthly-pack",
        price: 8500,
        originalPrice: 10500,
        savings: 19,
        description:
          "বিলাসবহুল এবং সবধরণের প্রিমিয়াম মাছ নিয়ে আমাদের সেরা মাসিক প্যাকেজ।",
        items: [
          "৫ কেজি রুই বড়",
          "২ কেজি গলদা চিংড়ি",
          "৩ কেজি বড় ইলিশ",
          "১ কেজি সুরমা",
          "১ কেজি কোরাল",
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
      <Footer />
    </>
  );
}
