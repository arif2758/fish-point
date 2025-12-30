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

  const productInCart = useCart().isInCart(pkg.id);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: pkg.name,
        text: pkg.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      // Optional: Add toast for "Link Copied"
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 md:py-10 pb-32 lg:pb-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 md:mb-10" aria-label="Breadcrumb">
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          সব প্যাকেজ ফিরে যান
        </Link>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left: Image */}
        <div className="space-y-6">
          <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-[2rem] overflow-hidden border border-border/40 bg-card/40 backdrop-blur-xl shadow-lg">
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-4 md:top-6 inset-x-4 md:inset-x-6 flex justify-between items-start pointer-events-none">
              <div className="flex flex-col gap-2">
                {pkg.featured && (
                  <Badge className="w-fit bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-1.5 rounded-full font-bold shadow-lg border-none text-xs">
                    সেরা ভ্যালু
                  </Badge>
                )}
                <Badge className="w-fit bg-orange-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-bold shadow-lg border-none text-xs">
                  {pkg.savings}% ছাড়
                </Badge>
              </div>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleShare}
                className="pointer-events-auto size-10 rounded-full shadow-lg backdrop-blur-md bg-white/20 hover:bg-white/40 border border-white/20 transition-all text-white"
                aria-label="Share"
              >
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Info Area */}
        <div className="flex flex-col justify-center">
          <header className="space-y-3 mb-6 md:mb-8 text-left">
            <div className="flex items-center gap-2 text-primary text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
              <Calendar className="size-3.5" />
              <span>
                {pkg.frequency === "weekly" ? "সাপ্তাহিক" : "মাসিক"} ডিল
              </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tight leading-[1.1]">
              {pkg.name}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {pkg.description}
            </p>
          </header>

          {/* Pricing Card */}
          <div className="mb-6 p-5 md:p-6 rounded-3xl border border-border/40 bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                  প্যাকেজ মূল্য
                </p>
                <div className="flex items-baseline gap-2 md:gap-3">
                  <span className="text-3xl md:text-4xl font-black text-primary">
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="text-lg md:text-xl text-muted-foreground/60 line-through">
                    {formatPrice(pkg.originalPrice)}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-1 text-[11px] md:text-sm font-bold shadow-xs">
                  সাশ্রয় {formatPrice(pkg.originalPrice - pkg.price)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {/* Package Items */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground/80 flex items-center gap-2">
                <Zap className="size-4 text-primary fill-primary" />
                প্যাকেজে যা যা পাচ্ছেন
              </h3>
              <ul className="space-y-3">
                {pkg.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Check className="size-3.5" />
                    </div>
                    <span className="font-semibold text-muted-foreground leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/60 shadow-sm">
                <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Truck className="size-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">ফ্রি ডেলিভারি</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    সাবস্ক্রিপশন গিফট
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/60 shadow-sm">
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">তাজা গ্যারান্টি</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    ১০০% ফ্রেশ মাছ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Subscription Button */}
          <div className="hidden lg:block">
            <Button
              onClick={handleSubscribe}
              size="lg"
              className={cn(
                "w-full h-16 rounded-[1.25rem] text-xl font-bold shadow-2xl transition-all active:scale-95",
                isAdded
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-primary hover:shadow-primary/20"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="mr-3 size-7" />
                  কার্টে যোগ হয়েছে
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-3 size-6" />
                  সাবস্ক্রিপশন শুরু করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription FAQ / Info */}
      <section className="mt-20 border-t border-border/40 pt-16">
        <h2 className="text-3xl font-black mb-12 text-center">
          সাবস্ক্রিপশন শুরু হবে{" "}
          <span className="text-primary">৩টি সহজ ধাপে</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-px bg-border/40 z-0" />
          {[
            {
              id: "১",
              title: "প্যাকেজ পছন্দ করুন",
              desc: "আপনার পরিবারের প্রয়োজন অনুযায়ী সেরা প্যাকেজটি বেছে নিন।",
            },
            {
              id: "২",
              title: "অর্ডার কনফার্ম করুন",
              desc: "ঠিকানা ও সময় কনফার্ম করে সাবস্ক্রিপশন শেষ করুন।",
            },
            {
              id: "৩",
              title: "ডেলিভারি বুঝে নিন",
              desc: "নির্দিষ্ট সময়ে তাজা মাছ সরাসরি আপনার ঘরে পৌঁছে যাবে।",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 text-center space-y-4 group"
            >
              <div className="size-12 rounded-full bg-primary flex items-center justify-center font-black text-primary-foreground mx-auto shadow-lg group-hover:scale-110 transition-transform">
                {step.id}
              </div>
              <h4 className="text-lg font-black">{step.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-[20px] border-t border-border/20 p-4 lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <div className="container mx-auto max-w-lg">
          <div className="flex gap-3">
            <Button
              onClick={handleSubscribe}
              size="lg"
              className={cn(
                "flex-1 h-14 rounded-2xl text-base font-bold shadow-lg transition-all active:scale-95 px-2",
                isAdded
                  ? "bg-green-600 hover:bg-green-600"
                  : "bg-primary shadow-primary/20"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {isAdded || productInCart ? (
                  <>
                    <Check className="size-5" />
                    <span>কার্টে যোগ হয়েছে</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-5" />
                    <span className="truncate text-sm sm:text-base">
                      সাবস্ক্রিপশন করুন
                    </span>
                  </>
                )}
              </div>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="h-14 w-14 rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm active:scale-95 shrink-0"
              aria-label="Share"
            >
              <Share2 className="size-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
