"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  ShoppingCart,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Calendar,
  Zap,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { IPackage } from "@/models/PackageCollection";
import { IProduct } from "@/types";

interface PackageDetailClientProps {
  pkg: IPackage;
}

export default function PackageDetailClient({ pkg }: PackageDetailClientProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleSubscribe = () => {
    // Treat package as a unique product for the cart
    const cartProduct: IProduct = {
      productId: pkg.id,
      title: pkg.name,
      name_en: pkg.slug,
      slug: pkg.slug,
      mainImage: pkg.image,
      galleryImages: [],
      salePrice: pkg.price,
      basePrice: pkg.originalPrice,
      discountPercentage: pkg.savings,
      priceLastUpdatedDate: new Date(),
      shortDescription: pkg.description,
      description: pkg.description,
      minOrderKg: 1,
      maxOrderKg: 1,
      stockKg: 99,
      isOutOfStock: false,
      category: "Package",
      fishType: "Mixed",
      published: true,
      isFeatured: pkg.featured || false,
      isHeadAvailable: false,
      isWildCaught: false,
      cuttingSizes: [],
      cuttingStyles: [],
      headCutOptions: [],
      availableSource: "Subscription",
      quality: "Premium",
      packagingType: "Vaccum Seal",
      isFragile: false,
      estimatedProcessingTime: 24,
      minPreOrderNoticeHours: 12,
      suitableFor: ["Subscription"],
      cookDifficulty: "সহজ",
      texture: "নরম",
      fatContent: "মাঝারি",
      smellIntensity: "সাধারণ গন্ধ",
      averageRating: 0,
      totalReviews: 0,
      unitsSold: 0,
      tags: ["Package", pkg.frequency],
      shelfLifeDays: 7,
    };

    addToCart(cartProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="container mx-auto px-4 py-6 pb-20">
      {/* Breadcrumbs / Back button */}
      <div className="mb-6">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          সব প্যাকেজ ফিরে যান
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-3xl overflow-hidden border border-border/40 bg-card/40 backdrop-blur-xl">
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover"
              priority
            />
            {pkg.featured && (
              <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold shadow-lg">
                সেরা ভ্যালু
              </Badge>
            )}
            <Badge className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg">
              {pkg.savings}% ছাড়
            </Badge>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
              <Calendar className="size-4" />
              {pkg.frequency === "weekly" ? "সাপ্তাহিক" : "মাসিক"} ডিল
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              {pkg.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {pkg.description}
            </p>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-black text-primary">
                {formatPrice(pkg.price)}
              </span>
              <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                {formatPrice(pkg.originalPrice)}
              </span>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5"
              >
                সেভিংস {formatPrice(pkg.originalPrice - pkg.price)}
              </Badge>
            </div>
          </div>

          {/* Package Contents */}
          <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="size-5 text-yellow-500 fill-yellow-500" />
              প্যাকেজে যা যা পাচ্ছেন
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {pkg.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3.5" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20">
              <Truck className="size-5 text-primary" />
              <div className="text-[10px] sm:text-xs">
                <p className="font-bold">ফ্রি ডেলিভারি</p>
                <p className="text-muted-foreground text-[10px]">
                  সব সাবস্ক্রিপশনে
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-secondary/20">
              <ShieldCheck className="size-5 text-primary" />
              <div className="text-[10px] sm:text-xs">
                <p className="font-bold">কোয়ালিটি গ্যারান্টি</p>
                <p className="text-muted-foreground text-[10px]">
                  ১০০% ফ্রেশ মাছ
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="sticky bottom-4 lg:relative lg:bottom-0 z-10 flex gap-4 mt-auto">
            <Button
              onClick={handleSubscribe}
              size="lg"
              className={cn(
                "flex-1 h-16 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95",
                isAdded ? "bg-green-600 hover:bg-green-600" : ""
              )}
            >
              {isAdded ? (
                <>
                  <Check className="mr-3 size-6" />
                  কার্টে যোগ হয়েছে
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-3 size-6" />
                  প্যাকেজ সাবস্ক্রিপশন করুন
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-2xl border-border/40 bg-card/40 backdrop-blur-xl shrink-0"
            >
              <Share2 className="size-6 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription FAQ / Info */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">
          সাবস্ক্রিপশন কিভাবে কাজ করে?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              ১
            </div>
            <h4 className="font-bold">প্যাকেজ পছন্দ করুন</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              আপনার পরিবারের আকার অনুযায়ী সাপ্তাহিক বা মাসিক প্যাকেজ সিলেক্ট
              করুন।
            </p>
          </div>
          <div className="space-y-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              ২
            </div>
            <h4 className="font-bold">অর্ডার কনফার্ম করুন</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              চেকআউট পেজে গিয়ে আপনার ডেলিভারি ঠিকান ও সময় কনফার্ম করুন।
            </p>
          </div>
          <div className="space-y-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              ৩
            </div>
            <h4 className="font-bold">ডেলিভারি বুঝে নিন</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              নির্দিষ্ট দিনে আমাদের প্রতিনিধি তাজা মাছ আপনার দোরগোড়ায় পৌঁছে
              দেবে।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
