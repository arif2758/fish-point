// src/app/(main)/cart/CartPageClient.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  PackageX,
  CreditCard,
  Truck,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import { formatPrice, calculateTotalPrice } from "@/lib/priceUtils";
import QuantitySelector from "@/components/products/QuantitySelector";

export default function CartPageClient() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  const deliveryCharge = 30;
  const grandTotal = cart.total + deliveryCharge;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="size-24 mx-auto rounded-full bg-muted/50 backdrop-blur-[10px] flex items-center justify-center mb-6">
            <PackageX className="size-12 text-muted-foreground" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            আপনার কার্ট খালি
          </h1>
          <p className="text-muted-foreground mb-8">
            এখনো কোনো পণ্য যোগ করা হয়নি। তাজা মাছ কিনতে শুরু করুন!
          </p>

          <Link href="/products">
            <Button size="lg" className="rounded-full shadow-lg">
              <ShoppingBag className="mr-2 size-5" />
              কেনাকাটা শুরু করুন
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32 lg:pb-12">
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items */}
        <section className="lg:col-span-2 space-y-6" aria-label="কার্ট আইটেম">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-baseline gap-3">
              আপনার কার্ট
              <span className="text-lg font-medium text-muted-foreground">
                ({cart.items.length}টি পণ্য)
              </span>
            </h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-9 px-4"
            >
              <Trash2 className="mr-2 size-4" />
              সব মুছুন
            </Button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => {
              const itemTotal = calculateTotalPrice(
                item.product.salePrice,
                item.quantity
              );
              const isPackage = item.product.category === "Package";

              return (
                <article
                  key={item.product.productId}
                  className="group relative flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-[20px] hover:shadow-xl hover:border-border/60 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle Background Accent for Packages */}
                  {isPackage && (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                  )}

                  {/* Product Image */}
                  <Link
                    href={
                      isPackage
                        ? `/packages/${item.product.slug}`
                        : `/products/${item.product.slug}`
                    }
                    className="relative size-24 sm:size-32 shrink-0 overflow-hidden rounded-2xl bg-muted/30 aspect-square"
                  >
                    <Image
                      src={item.product.mainImage}
                      alt={item.product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 96px, 128px"
                    />
                    {item.product.discountPercentage > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 left-2 text-[10px] px-2 py-0.5 font-bold backdrop-blur-md bg-orange-600/90 border-none shadow-sm"
                      >
                        -{item.product.discountPercentage}%
                      </Badge>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isPackage ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-[10px] px-2 py-0 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Boxes className="size-3" />
                            সাবস্ক্রিপশন
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-border/60 text-muted-foreground"
                          >
                            {item.product.category}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="bg-green-500/10 text-green-600 border-none text-[10px]"
                        >
                          ইন স্টক
                        </Badge>
                      </div>

                      <Link
                        href={
                          isPackage
                            ? `/packages/${item.product.slug}`
                            : `/products/${item.product.slug}`
                        }
                      >
                        <h3 className="font-bold text-[13px] sm:text-lg leading-snug hover:text-primary transition-colors line-clamp-2 mb-1.5 sm:mb-2">
                          {item.product.title}
                        </h3>
                      </Link>

                      {/* Selected Options - Enhanced */}
                      {(item.selectedOptions.cuttingSize ||
                        item.selectedOptions.headCut ||
                        item.selectedOptions.cuttingStyle) && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.selectedOptions.cuttingSize && (
                            <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                              সাইজ:{" "}
                              <strong>
                                {item.selectedOptions.cuttingSize}
                              </strong>
                            </span>
                          )}
                          {item.selectedOptions.cuttingStyle &&
                            item.selectedOptions.cuttingStyle !== "none" && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                                কাটিং:{" "}
                                <strong>
                                  {item.selectedOptions.cuttingStyle}
                                </strong>
                              </span>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity Area */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mt-3 sm:mt-6">
                      <div className="flex flex-row sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                          <span className="text-lg sm:text-2xl font-black text-primary">
                            {formatPrice(item.product.salePrice)}
                          </span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                            /কেজি
                          </span>
                        </div>
                        {item.product.salePrice < item.product.basePrice && (
                          <span className="text-[9px] sm:text-xs text-muted-foreground line-through decoration-destructive/50">
                            {formatPrice(item.product.basePrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector Area - improved stacking for mobile */}
                      <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-2 mt-auto">
                        <QuantitySelector
                          quantity={item.quantity}
                          min={item.product.minOrderKg}
                          max={item.product.maxOrderKg}
                          setQuantity={(val) =>
                            updateQuantity(item.product.productId, val)
                          }
                          step={
                            item.product.minOrderKg >= 1
                              ? 1
                              : item.product.minOrderKg
                          }
                          variant="premium"
                          className="scale-[0.75] xs:scale-[0.85] sm:scale-100 origin-left"
                        />

                        {/* Mobile Only Total Area */}
                        <div className="sm:hidden flex flex-col items-end pl-2 border-l border-border/20 ml-auto shrink-0">
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight">
                            সাবটোটাল
                          </span>
                          <span className="text-sm font-black text-primary leading-none whitespace-nowrap">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Only Area */}
                  <div className="hidden sm:flex flex-col items-end justify-between pl-4 min-w-[120px] border-l border-border/20 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={() => removeItem(item.product.productId)}
                      aria-label={`${item.product.title} মুছুন`}
                    >
                      <Trash2 className="size-5" />
                    </Button>

                    <div className="text-right pb-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        সাবটোটাল
                      </p>
                      <p className="text-2xl font-black text-primary tracking-tight">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden absolute top-2 right-2 size-9 rounded-full text-muted-foreground/40 hover:text-destructive bg-card/20 backdrop-blur-sm"
                    onClick={() => removeItem(item.product.productId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </article>
              );
            })}
          </div>

          {/* Consolidation: Mobile Summary is now removed, the original aside below handles it for consistency. */}
        </section>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-1 space-y-4" aria-label="অর্ডার সারাংশ">
          <div className="lg:sticky lg:top-20 flex flex-col gap-4">
            {/* Summary Card */}
            <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-6 sm:p-8 shadow-xl relative overflow-hidden ring-1 ring-white/5">
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <h2 className="text-2xl font-black mb-8 border-b border-border/40 pb-4">
                অর্ডার সারাংশ
              </h2>

              <div className="space-y-4 mb-8">
                {/* Detailed Item List for Desktop Sidebar */}
                <div className="space-y-3 pb-5 border-b border-border/40 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.productId}
                      className="flex justify-between items-start gap-4"
                    >
                      <p className="text-xs font-medium text-muted-foreground flex-1">
                        {item.product.title}{" "}
                        <span className="text-primary font-bold">
                          x {item.quantity} কেজি
                        </span>
                      </p>
                      <span className="text-xs font-bold whitespace-nowrap">
                        {formatPrice(
                          calculateTotalPrice(
                            item.product.salePrice,
                            item.quantity
                          )
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted-foreground font-medium">
                    সাবটোটাল
                  </span>
                  <span className="font-bold">{formatPrice(cart.total)}</span>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted-foreground font-medium">
                    ডেলিভারি চার্জ
                  </span>
                  <span className="font-bold">
                    {formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex justify-between items-end">
                  <div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      সর্বমোট
                    </span>
                    <span className="text-3xl font-black text-primary tracking-tight">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group"
                >
                  চেকআউট করুন
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl">
                  <Truck className="size-4 text-primary shrink-0" />
                  <p>
                    ঢাকার ভেতরে{" "}
                    <span className="font-bold text-foreground">
                      ২০-৪০ মিনিটে
                    </span>{" "}
                    দ্রুত ডেলিভারি!
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges - Inside Sticky Container */}
            <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-md p-5 flex flex-col gap-4 shadow-sm">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                আমরা নিশ্চিত করছি
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold">তাজা গ্যারান্টি</p>
                    <p className="text-[9px] text-muted-foreground">
                      ১০০% ক্যাশব্যাক
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <CreditCard className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold">নিরাপদ পেমেন্ট</p>
                    <p className="text-[9px] text-muted-foreground">
                      SSL Secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar - Enhanced UX */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/90 backdrop-blur-2xl border-t border-primary/20 p-4 shadow-2xl safe-area-bottom">
        <div className="container mx-auto flex items-center justify-between gap-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              সর্বমোট
            </span>
            <span className="text-2xl font-black text-primary tracking-tight">
              {formatPrice(grandTotal)}
            </span>
          </div>

          <Link href="/checkout" className="flex-1">
            <Button
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 group"
            >
              চেকআউট
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
