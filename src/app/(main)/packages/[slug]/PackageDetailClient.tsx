"use client";

import { useState, useRef } from "react";
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
  products: IProduct[];
  allPackages: IPackage[];
}

export default function PackageDetailClient({
  pkg,
  products,
  allPackages,
}: PackageDetailClientProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // --- 1. Selection & Quantity State ---
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    pkg.items.reduce(
      (acc, item) => ({ ...acc, [item.productId]: item.selectedByDefault }),
      {}
    )
  );

  const [quantities, setQuantities] = useState<Record<string, number>>(
    pkg.items.reduce(
      (acc, item) => ({ ...acc, [item.productId]: item.defaultKg }),
      {}
    )
  );

  // --- 2. Dynamic Price Calculation ---
  const calculateTotal = () => {
    let baseTotal = 0;
    pkg.items.forEach((item) => {
      if (selectedItems[item.productId]) {
        const product = products.find((p) => p.productId === item.productId);
        const qty = quantities[item.productId] || item.defaultKg || 0;

        if (product && typeof product.basePrice === "number") {
          baseTotal += product.basePrice * qty;
        } else {
          // Fallback if product not found or basePrice missing
          // Distribute the package's base price across its items as a fallback
          const fallbackPrice = (pkg.basePrice || 0) / (pkg.items.length || 1);
          baseTotal += fallbackPrice * qty;
        }
      }
    });

    const discount = pkg.discountPercentage || 0;
    const saleTotal = baseTotal * (1 - discount / 100);

    return {
      base: Math.max(0, baseTotal),
      sale: Math.max(0, saleTotal),
      savings: Math.max(0, baseTotal - saleTotal),
    };
  };

  const totals = calculateTotal();

  // --- 3. Customization Handlers ---
  const toggleItem = (productId: string) => {
    const itemConfig = pkg.items.find((i) => i.productId === productId);
    if (itemConfig?.isOptional) {
      setSelectedItems((prev) => ({ ...prev, [productId]: !prev[productId] }));
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0.25, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  // --- 4. Tier Selection (Smart UX) ---
  const customIdCounter = useRef(0);

  const applyTier = (tier: "essential" | "standard" | "ultimate") => {
    const newSelection: Record<string, boolean> = {};
    const newQuantities: Record<string, number> = {};

    pkg.items.forEach((item) => {
      if (tier === "essential") {
        newSelection[item.productId] = !item.isOptional;
      } else if (tier === "standard") {
        newSelection[item.productId] = item.selectedByDefault;
      } else {
        newSelection[item.productId] = true;
      }
      newQuantities[item.productId] = item.defaultKg;
    });

    setSelectedItems(newSelection);
    setQuantities(newQuantities);
  };

  // Check if current config matches predefined tiers
  const currentTier = () => {
    const isUltimate = pkg.items.every(
      (item) =>
        selectedItems[item.productId] &&
        quantities[item.productId] === item.defaultKg
    );
    if (isUltimate) return "ultimate";

    const isStandard = pkg.items.every(
      (item) =>
        selectedItems[item.productId] === item.selectedByDefault &&
        quantities[item.productId] === item.defaultKg
    );
    if (isStandard) return "standard";

    const isEssential = pkg.items.every((item) => {
      const selectionMatch = item.isOptional
        ? !selectedItems[item.productId]
        : selectedItems[item.productId];
      return selectionMatch && quantities[item.productId] === item.defaultKg;
    });
    if (isEssential) return "essential";

    return "custom";
  };

  const activeTier = currentTier();

  // --- 5. Cart Integration ---
  const handleSubscribe = () => {
    customIdCounter.current += 1;
    // We create a customized package string for the cart description
    const selectedList = pkg.items
      .filter((i) => selectedItems[i.productId])
      .map((i) => `${i.name} (${quantities[i.productId]}kg)`)
      .join(", ");

    const cartProduct: IProduct = {
      productId: `${pkg.packageId}-custom-${customIdCounter.current}`, // unique per customization
      title: `${pkg.name} (Custom)`,
      name_en: pkg.slug,
      slug: pkg.slug,
      mainImage: pkg.image,
      galleryImages: [],
      salePrice: totals.sale,
      basePrice: totals.base,
      discountPercentage: pkg.discountPercentage,
      priceLastUpdatedDate: new Date(),
      shortDescription: `Customization: ${selectedList}`,
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
      tags: ["Package", pkg.frequency, "Customized"],
      shelfLifeDays: 7,
    };

    addToCart(cartProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: pkg.name,
        text: pkg.description,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
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
          সব প্যাকেজ
        </Link>
      </nav>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Col: Image & Plan Tiers */}
        <div className="lg:col-span-4 space-y-8">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border/40 bg-card/40 backdrop-blur-xl shadow-lg">
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
              <Button
                size="icon"
                variant="secondary"
                onClick={handleShare}
                className="size-10 rounded-full shadow-lg backdrop-blur-md bg-white/20 hover:bg-white/40 border border-white/20 transition-all text-white"
              >
                <Share2 className="size-5" />
              </Button>
            </div>
          </div>

          {/* Quick Choice Tiers */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
              <Zap className="size-4 text-primary fill-primary" />
              প্ল্যান বেছে নিন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                {
                  id: "essential" as const,
                  label: "প্রয়োজনীয় (Essential)",
                  desc: "শুধু আবশ্যিক আইটেম",
                },
                {
                  id: "standard" as const,
                  label: "জনপ্রিয় (Standard)",
                  desc: "সেরা ভ্যালু কম্বিনেশন",
                },
                {
                  id: "ultimate" as const,
                  label: "ফুল প্যাক (Ultimate)",
                  desc: "সব আইটেম একসাথে",
                },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => applyTier(tier.id)}
                  className={cn(
                    "flex flex-col items-center lg:items-start p-4 rounded-2xl border text-center lg:text-left transition-all duration-300",
                    activeTier === tier.id
                      ? "bg-primary/10 border-primary shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] ring-1 ring-primary/20"
                      : "bg-card/40 border-border/40 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={cn(
                        "text-sm font-bold w-full lg:w-auto",
                        activeTier === tier.id ? "text-primary" : ""
                      )}
                    >
                      {tier.label}
                    </span>
                    {activeTier === tier.id && (
                      <div className="hidden lg:flex size-5 rounded-full bg-primary items-center justify-center shrink-0">
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {tier.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Col: Customization List */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-3 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-3 lg:gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]">
                {pkg.name}
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest h-fit">
                {pkg.frequency === "weekly" ? "সাপ্তাহিক" : "মাসিক"}
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              প্যাকেজের আইটেমগুলো আপনার ইচ্ছেমতো সাজিয়ে নিন। ওজনের ডানে/বামে
              ক্লিক করে পরিমাণ পরিবর্তন করুন।
            </p>
          </header>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
            {pkg.items.map((item) => {
              const product = products.find(
                (p) => p.productId === item.productId
              );
              const isSelected = selectedItems[item.productId];
              const qty = quantities[item.productId];

              return (
                <div
                  key={item.productId}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-300",
                    isSelected
                      ? "bg-card/60 border-primary/20 shadow-sm"
                      : "bg-background/40 border-border/20 opacity-60 grayscale-[0.5]"
                  )}
                >
                  {/* Item Image */}
                  <div className="relative size-14 sm:size-20 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner bg-muted shrink-0">
                    <Image
                      src={product?.mainImage || pkg.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0 mr-1">
                    <p className="text-xs sm:text-base font-bold truncate">
                      {item.name}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground font-medium uppercase truncate">
                      {item.isOptional ? "ঐচ্ছিক আইটেম" : "আবশ্যিক আইটেম"}
                    </p>
                  </div>

                  {/* Qty Handler */}
                  <div className="flex items-center gap-1 sm:gap-3 bg-background/50 backdrop-blur-md rounded-xl sm:rounded-2xl p-0.5 sm:p-1 border border-border/40 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, -0.25)}
                      disabled={!isSelected || qty <= 0.25}
                      className="size-6 sm:size-8 rounded-lg sm:rounded-xl hover:bg-primary/10 flex items-center justify-center font-bold text-xs sm:text-lg transition-colors disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-9 sm:w-12 text-center text-[10px] sm:text-sm font-black">
                      {qty}
                      <span className="text-[8px] sm:text-[10px] ml-0.5">
                        কেজি
                      </span>
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 0.25)}
                      disabled={!isSelected}
                      className="size-6 sm:size-8 rounded-lg sm:rounded-xl hover:bg-primary/10 flex items-center justify-center font-bold text-xs sm:text-lg transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Select Toggle */}
                  <button
                    onClick={() => toggleItem(item.productId)}
                    disabled={!item.isOptional}
                    className={cn(
                      "size-7 sm:size-10 rounded-lg sm:rounded-2xl flex items-center justify-center transition-all duration-300 border shrink-0",
                      isSelected
                        ? "bg-primary/90 text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-background/50 text-muted-foreground border-border/40"
                    )}
                  >
                    {isSelected ? (
                      <Check className="size-3.5 sm:size-5" />
                    ) : (
                      <div className="size-1 sm:size-2 rounded-full bg-border" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-12 border-t border-border/40">
        {[
          {
            icon: Truck,
            color: "text-orange-500",
            label: "ফ্রি ডেলিভারি",
            sub: "আপনার ঠিকানায়",
          },
          {
            icon: ShieldCheck,
            color: "text-emerald-500",
            label: "তাজা গ্যারান্টি",
            sub: "সেরা মানের ফ্রেশ মাছ",
          },
          {
            icon: Calendar,
            color: "text-blue-500",
            label: "সহজ বিলিং",
            sub: "পছন্দের শিডিউলে",
          },
          {
            icon: Zap,
            color: "text-yellow-500",
            label: "স্মার্ট সেভিংস",
            sub: "বাজার মূল্যের চেয়ে কম",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-card/40 border border-border/40 group hover:border-primary/30 transition-all text-center sm:text-left"
          >
            <div
              className={cn(
                "size-8 sm:size-12 rounded-lg sm:rounded-2xl bg-muted/40 flex items-center justify-center shrink-0",
                feat.color
              )}
            >
              <feat.icon className="size-4 sm:size-6" />
            </div>
            <div>
              <p className="font-bold text-[10px] sm:text-sm tracking-tight">
                {feat.label}
              </p>
              <p className="hidden xs:block text-[8px] sm:text-[10px] text-muted-foreground font-medium uppercase">
                {feat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Price Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 animate-in slide-in-from-bottom-5 duration-500">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card/95 backdrop-blur-3xl border border-primary/20 rounded-xl sm:rounded-[2rem] p-2.5 sm:p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-6">
              <div>
                <p className="text-[8px] sm:text-[10px] font-black uppercase text-muted-foreground opacity-70 tracking-widest mb-0.5 sm:mb-1 items-center flex gap-1">
                  <Zap className="size-2 sm:size-3 text-primary fill-primary" />
                  <span className="hidden xs:inline">আপনার </span>প্যাক
                </p>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span className="text-lg sm:text-2xl md:text-3xl font-black text-primary">
                    {formatPrice(totals.sale)}
                  </span>
                  <span className="hidden sm:inline text-xs sm:text-sm md:text-base text-muted-foreground/60 line-through">
                    {formatPrice(totals.base)}
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-3 py-1.5 rounded-xl font-black text-xs">
                  সাশ্রয় {formatPrice(totals.savings)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={handleSubscribe}
                size="lg"
                className={cn(
                  "h-10 sm:h-14 px-4 sm:px-8 md:px-12 rounded-lg sm:rounded-2xl text-[11px] sm:text-base font-black shadow-xl transition-all active:scale-95",
                  isAdded
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-primary shadow-primary/20"
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="mr-1 sm:mr-2 size-3.5 sm:size-5" /> যোগ
                    হয়েছে
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-1 sm:mr-2 size-3.5 sm:size-5" />
                    <span className="xs:inline"> সাবস্ক্রাইব</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* More Packages Section */}
      {allPackages && allPackages.length > 0 && (
        <div className="mt-20 pt-16 border-t border-border/40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 text-center md:text-left">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                সব প্যাকেজ দেখুন
              </h2>
              <p className="text-sm text-muted-foreground">
                সাপ্তাহিক ও মাসিক বাজারের আরও সাশ্রয়ী প্যাকেজ আমাদের কাছে আছে।
              </p>
            </div>
            <Link href="/packages">
              <Button
                variant="outline"
                className="rounded-xl font-bold h-11 border-primary text-primary hover:bg-primary/10"
              >
                সব প্যাকেজ ও কাস্টম প্যাক
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPackages.map((other) => (
              <div key={other.packageId} className="group outline-none">
                <Link
                  href={`/packages/${other.slug}`}
                  className="block relative aspect-video rounded-2xl overflow-hidden border border-border/20 mb-3"
                >
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-500/90 border-none text-[9px] font-bold">
                      {other.discountPercentage}% সাশ্রয়
                    </Badge>
                  </div>
                </Link>
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="text-[9px] uppercase tracking-widest border-primary/20 text-primary h-fit px-1.5 font-bold"
                  >
                    {other.frequency === "weekly" ? "সাপ্তাহিক" : "মাসিক"}
                  </Badge>
                  <Link
                    href={`/packages/${other.slug}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="font-bold text-sm line-clamp-1">
                      {other.name}
                    </h4>
                  </Link>
                  <p className="text-xs font-black text-primary">
                    {formatPrice(other.salePrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
