"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { IPackage } from "@/models/PackageCollection";
import { IProduct } from "@/types";

export default function PackageCard({ pkg }: { pkg: IPackage }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Treat package as a unique product for the cart
    const cartProduct: IProduct = {
      productId: pkg.packageId,
      title: pkg.name,
      name_en: pkg.slug,
      slug: pkg.slug || `package-${pkg.packageId}`,
      mainImage: pkg.image,
      galleryImages: [],
      salePrice: pkg.salePrice,
      basePrice: pkg.basePrice,
      discountPercentage: pkg.discountPercentage,
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
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden group",
        pkg.featured
          ? "border-primary/50 shadow-lg shadow-primary/10 bg-linear-to-br from-primary/10 via-card/50 to-background/50 ring-1 ring-primary/20"
          : "border-border/40 bg-card/40 backdrop-blur-xl hover:border-border/80 hover:shadow-xl"
      )}
    >
      {/* Featured Badge */}
      {pkg.featured && (
        <div className="absolute top-0 right-0 z-10">
          <Badge className="rounded-none rounded-bl-xl bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            সুপার ভ্যালু
          </Badge>
        </div>
      )}

      {/* Image Header - Clickable */}
      <Link
        href={`/packages/${pkg.slug}`}
        className="relative h-40 sm:h-48 w-full overflow-hidden block"
      >
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <Badge className="mb-1.5 bg-orange-500/90 backdrop-blur-md border-none text-[9px] sm:text-[10px]">
            {pkg.discountPercentage}% সেভিংস
          </Badge>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
            {pkg.name}
          </h3>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 space-y-3 sm:space-y-4">
        <Link href={`/packages/${pkg.slug}`} className="block group/link">
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            {pkg.description}
          </p>
        </Link>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">
              {formatPrice(pkg.salePrice)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(pkg.basePrice)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            {pkg.frequency === "weekly" ? "প্রতি সপ্তাহ" : "প্রতি মাস"}
          </p>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            প্যাকেজে যা থাকবে:
          </p>
          <ul className="space-y-1.5">
            {pkg.items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs">
                <div className="flex size-4 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="size-2.5" />
                </div>
                <span>
                  {item.name} ({item.defaultKg} কেজি)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action */}
      <div className="p-5 pt-0 mt-auto">
        <Button
          onClick={handleSubscribe}
          className={cn(
            "w-full rounded-full font-bold transition-all h-10 text-sm",
            isAdded ? "bg-green-600 hover:bg-green-600" : ""
          )}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 size-4" />
              যোগ হয়েছে
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 size-4" />
              সাবস্ক্রাইব করুন
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
