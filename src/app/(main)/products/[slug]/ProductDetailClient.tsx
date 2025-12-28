// src/app/(main)/products/[slug]/ProductDetailClient.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  ChevronRight,
  Home,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";
import QuantitySelector from "@/components/products/QuantitySelector";
import { calculateTotalPrice, formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/contexts/CartContext";
import type { CartItem } from "@/types/cart";

export default function ProductDetailClient({
  product,
}: {
  product: IProduct;
}) {
  const [mainImage, setMainImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(product.minOrderKg);

  const [selectedCuttingSize, setSelectedCuttingSize] = useState(
    product.cuttingSizes[0] || ""
  );
  const [selectedHeadCut, setSelectedHeadCut] = useState(
    product.headCutOptions[0]?.toString() || ""
  );
  const [selectedCuttingStyle, setSelectedCuttingStyle] =
    useState<string>("none");

  const { addToCart, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(product.salePrice, quantity);
  }, [product.salePrice, quantity]);

  const productInCart = isInCart(product.productId);

  const handleAddToCart = () => {
    const options: CartItem["selectedOptions"] = {};

    if (selectedCuttingSize) {
      options.cuttingSize = selectedCuttingSize;
    }
    if (selectedHeadCut) {
      options.headCut = parseInt(selectedHeadCut);
    }
    if (selectedCuttingStyle && selectedCuttingStyle !== "none") {
      options.cuttingStyle = selectedCuttingStyle;
    }

    addToCart(product, quantity, options);

    // Show feedback
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `${product.title} - ${formatPrice(
        product.salePrice
      )}/কেজি\n${product?.description?.substring(0, 100)}...`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("লিংক কপি হয়েছে!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="border-b border-border/40" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center text-sm text-muted-foreground gap-2">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                <Home className="size-4" />
              </Link>
            </li>
            <ChevronRight className="size-3.5" />
            <li>
              <Link
                href="/products"
                className="hover:text-primary transition-colors"
              >
                মাছ
              </Link>
            </li>
            <ChevronRight className="size-3.5" />
            <li className="font-medium text-foreground truncate max-w-50">
              {product.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-28 lg:pb-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 pt-6">
          {/* LEFT: Image Gallery + Customization */}
          <div className="space-y-4">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted/30 backdrop-blur-[10px] mb-3 border border-border/40">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="destructive"
                      className="text-xs text-black px-2.5 py-0.5 shadow-lg backdrop-blur-[15px] bg-secondary"
                    >
                      -{product.discountPercentage}%
                    </Badge>
                  </div>
                )}

                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleShare}
                  className="absolute top-4 right-4 size-9 rounded-full shadow-lg backdrop-blur-[15px] bg-secondary/60 hover:bg-primary-foreground border border-border/40 transition-all hover:scale-105 active:scale-95"
                  aria-label="শেয়ার করুন"
                >
                  <Share2 className="size-4" />
                </Button>
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1">
                {[product.mainImage, ...product.galleryImages].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={cn(
                      "relative size-16 shrink-0 overflow-hidden rounded-xl transition-all border backdrop-blur-[10px]",
                      mainImage === img
                        ? "ring-2 ring-primary border-primary/50 bg-card/60 "
                        : "opacity-60 hover:opacity-100 border-border/40 bg-card/30"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-4 pt-2 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-4 shadow-sm">
              <h3 className="font-semibold text-sm">কাস্টমাইজ করুন</h3>

              {/* Desktop: 3 Column Grid */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-3">
                {product.cuttingSizes.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      কাটিং সাইজ
                    </label>
                    <Select
                      value={selectedCuttingSize}
                      onValueChange={setSelectedCuttingSize}
                    >
                      <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                        <SelectValue placeholder="সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.cuttingSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {product.isHeadAvailable &&
                  product.headCutOptions.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        মাথা কাটিং
                      </label>
                      <Select
                        value={selectedHeadCut}
                        onValueChange={setSelectedHeadCut}
                      >
                        <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.headCutOptions.map((pieces) => (
                            <SelectItem key={pieces} value={pieces.toString()}>
                              {pieces} টুকরা
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                {product.cuttingStyles.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      অতিরিক্ত সেবা
                    </label>
                    <Select
                      value={selectedCuttingStyle}
                      onValueChange={setSelectedCuttingStyle}
                    >
                      <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                        <SelectValue placeholder="ঐচ্ছিক" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">কোনোটি না</SelectItem>
                        {product.cuttingStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Mobile: 2 Column Grid */}
              <div className="lg:hidden grid grid-cols-2 gap-3">
                {product.cuttingSizes.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      কাটিং সাইজ
                    </label>
                    <Select
                      value={selectedCuttingSize}
                      onValueChange={setSelectedCuttingSize}
                    >
                      <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                        <SelectValue placeholder="সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.cuttingSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {product.isHeadAvailable &&
                  product.headCutOptions.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        মাথা কাটিং
                      </label>
                      <Select
                        value={selectedHeadCut}
                        onValueChange={setSelectedHeadCut}
                      >
                        <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.headCutOptions.map((pieces) => (
                            <SelectItem key={pieces} value={pieces.toString()}>
                              {pieces} টুকরা
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                {product.cuttingStyles.length > 0 && (
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      অতিরিক্ত সেবা
                    </label>
                    <Select
                      value={selectedCuttingStyle}
                      onValueChange={setSelectedCuttingStyle}
                    >
                      <SelectTrigger className="h-10 bg-background/50 backdrop-blur-[10px] border-border/40">
                        <SelectValue placeholder="ঐচ্ছিক" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">কোনোটি না</SelectItem>
                        {product.cuttingStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight flex-1">
                  {product.title}
                </h1>

                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-[10px] shrink-0",
                    product.stockKg > 0
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                  )}
                >
                  <div
                    className={cn(
                      "size-1.5 rounded-full",
                      product.stockKg > 0
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    )}
                  />
                  {product.stockKg > 0 ? (
                    <>
                      স্টক আছে
                      {product.stockKg < 10 && (
                        <span className="opacity-70 hidden sm:inline">
                          ({product.stockKg} কেজি)
                        </span>
                      )}
                    </>
                  ) : (
                    "স্টক নেই"
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-border/40">
                <Badge
                  variant="secondary"
                  className="text-xs backdrop-blur-[10px] pointer-events-none"
                >
                  {product.fishType}
                </Badge>

                {product.fishSize && (
                  <Badge
                    variant="secondary"
                    className="text-xs backdrop-blur-[10px] pointer-events-none"
                  >
                    {product.fishSize} কেজি সাইজের
                  </Badge>
                )}

                <Badge
                  variant="secondary"
                  className="text-xs backdrop-blur-[10px] pointer-events-none"
                >
                  {product.quality}
                </Badge>

                {product.isFeatured && (
                  <Badge
                    variant="secondary"
                    className="text-xs backdrop-blur-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 pointer-events-none"
                  >
                    বেস্ট সেলার
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-5 shadow-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-muted-foreground text-sm">/কেজি</span>
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ছাড়ের আগে:{" "}
                  <span className="line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                </p>
              )}
            </div>

            {/* Quantity + CTA (Desktop) */}
            <div className="hidden lg:block rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">পরিমাণ (কেজি)</label>
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  min={product.minOrderKg}
                  max={product.maxOrderKg}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border/40">
                <span className="font-semibold">মোট</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Button
                size="lg"
                className={cn(
                  "w-full h-11 rounded-full font-semibold shadow-md hover:shadow-lg transition-all",
                  justAdded && "bg-green-600 hover:bg-green-600"
                )}
                disabled={product.stockKg === 0}
                onClick={handleAddToCart}
              >
                {justAdded ? (
                  <>
                    <Check className="mr-2 size-5" />
                    কার্টে যোগ হয়েছে
                  </>
                ) : product.stockKg > 0 ? (
                  productInCart ? (
                    "আরও যোগ করুন"
                  ) : (
                    "কার্টে যোগ করুন"
                  )
                ) : (
                  "স্টক নেই"
                )}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Truck className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">দ্রুত ডেলিভারি</p>
                    <p className="text-[10px] text-muted-foreground">
                      ২০-৩০ মিনিট
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">তাজা গ্যারান্টি</p>
                    <p className="text-[10px] text-muted-foreground">
                      ১০০% নিরাপদ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">উৎস</span>
                  <span className="font-medium">{product.availableSource}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">মান</span>
                  <span className="font-medium">{product.quality}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">টেক্সচার</span>
                  <span className="font-medium">{product.texture}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">চর্বি</span>
                  <span className="font-medium">{product.fatContent}</span>
                </div>
              </div>

              {/* Description */}
              <details className="group border-t border-border/40 pt-4">
                <summary className="flex items-center gap-1 cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                  বিস্তারিত বিবরণ
                  <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="pt-3 space-y-3 text-sm text-muted-foreground">
                  <p className="leading-relaxed">{product.description}</p>

                  {product.suitableFor.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground mb-2 text-xs">
                        উপযুক্ত রান্না
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {product.suitableFor.map((dish) => (
                          <Badge
                            key={dish}
                            variant="secondary"
                            className="text-xs backdrop-blur-[10px]"
                          >
                            {dish}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.bakingInstruction && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-[10px]">
                      <p className="font-medium text-blue-600 dark:text-blue-400 mb-1 text-xs">
                        বেকিং নির্দেশনা
                      </p>
                      <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                        {product.bakingInstruction}
                      </p>
                    </div>
                  )}

                  {product.storageInstruction && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl backdrop-blur-[10px]">
                      <p className="font-medium text-amber-600 dark:text-amber-400 mb-1 text-xs">
                        সংরক্ষণ
                      </p>
                      <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                        {product.storageInstruction}
                      </p>
                      <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-1">
                        শেলফ লাইফ: {product.shelfLifeDays} দিন
                      </p>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-[30px] border-t border-border/40 p-3 lg:hidden shadow-2xl">
        <div className="container mx-auto flex items-center gap-2">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            min={product.minOrderKg}
            max={product.maxOrderKg}
            className="w-24 h-10"
          />
          <Button
            size="lg"
            className={cn(
              "flex-1 h-10 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all",
              justAdded && "bg-green-600 hover:bg-green-600"
            )}
            disabled={product.stockKg === 0}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <>
                <Check className="mr-2 size-4" />
                যোগ হয়েছে
              </>
            ) : product.stockKg > 0 ? (
              `অর্ডার করুন · ${formatPrice(totalPrice)}`
            ) : (
              "স্টক নেই"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
