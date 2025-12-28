// src/app/(main)/cart/CartPageClient.tsx
"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  PackageX,
} from "lucide-react";
import { formatPrice, calculateTotalPrice } from "@/lib/priceUtils";
import QuantitySelector from "@/components/products/QuantitySelector";

export default function CartPageClient() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

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
    <div className="container mx-auto px-4 py-8 pb-32 lg:pb-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <section className="lg:col-span-2 space-y-4" aria-label="কার্ট আইটেম">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              আপনার কার্ট
              <Badge variant="secondary" className="ml-3 text-sm">
                {cart.items.length} আইটেম
              </Badge>
            </h1>

            {cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <Trash2 className="mr-2 size-4" />
                সব মুছুন
              </Button>
            )}
          </div>

          {cart.items.map((item) => {
            const itemTotal = calculateTotalPrice(
              item.product.salePrice,
              item.quantity
            );

            return (
              <article
                key={item.product.productId}
                className="group relative flex gap-4 p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] hover:shadow-lg hover:border-border/60 transition-all duration-300"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${item.product.slug}`}
                  className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl bg-muted/30"
                >
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="112px"
                  />
                  {item.product.discountPercentage > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5"
                    >
                      -{item.product.discountPercentage}%
                    </Badge>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1 hover:text-primary transition-colors line-clamp-2">
                      {item.product.title}
                    </h3>
                  </Link>

                  {/* Selected Options */}
                  {(item.selectedOptions.cuttingSize ||
                    item.selectedOptions.headCut ||
                    item.selectedOptions.cuttingStyle) && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.selectedOptions.cuttingSize && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5"
                        >
                          {item.selectedOptions.cuttingSize}
                        </Badge>
                      )}
                      {item.selectedOptions.headCut && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5"
                        >
                          {item.selectedOptions.headCut} টুকরা
                        </Badge>
                      )}
                      {item.selectedOptions.cuttingStyle &&
                        item.selectedOptions.cuttingStyle !== "none" && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5"
                          >
                            {item.selectedOptions.cuttingStyle}
                          </Badge>
                        )}
                    </div>
                  )}

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {formatPrice(item.product.salePrice)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /কেজি
                      </span>
                    </div>

                    {/* Quantity Controls - Desktop */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            Math.max(
                              item.product.minOrderKg,
                              item.quantity - item.product.minOrderKg
                            )
                          )
                        }
                        disabled={item.quantity <= item.product.minOrderKg}
                      >
                        <Minus className="size-3" />
                      </Button>

                      <span className="font-semibold min-w-12 text-center">
                        {item.quantity} কেজি
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8 rounded-full"
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            Math.min(
                              item.product.maxOrderKg,
                              item.quantity + item.product.minOrderKg
                            )
                          )
                        }
                        disabled={item.quantity >= item.product.maxOrderKg}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Quantity + Total */}
                  <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 rounded-full"
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            Math.max(
                              item.product.minOrderKg,
                              item.quantity - item.product.minOrderKg
                            )
                          )
                        }
                        disabled={item.quantity <= item.product.minOrderKg}
                      >
                        <Minus className="size-3" />
                      </Button>

                      <span className="font-semibold text-sm min-w-10 text-center">
                        {item.quantity} কেজি
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7 rounded-full"
                        onClick={() =>
                          updateQuantity(
                            item.product.productId,
                            Math.min(
                              item.product.maxOrderKg,
                              item.quantity + item.product.minOrderKg
                            )
                          )
                        }
                        disabled={item.quantity >= item.product.maxOrderKg}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>

                    <span className="text-base font-bold text-primary">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                </div>

                {/* Desktop Total Price */}
                <div className="hidden sm:flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.product.productId)}
                    aria-label={`${item.product.title} মুছুন`}
                  >
                    <Trash2 className="size-4" />
                  </Button>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">মোট</p>
                    <p className="text-xl font-bold text-primary">
                      {formatPrice(itemTotal)}
                    </p>
                  </div>
                </div>

                {/* Mobile Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden absolute top-2 right-2 size-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.product.productId)}
                  aria-label={`${item.product.title} মুছুন`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </article>
            );
          })}
        </section>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-1" aria-label="অর্ডার সারাংশ">
          <div className="sticky top-20 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">অর্ডার সারাংশ</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">সাবটোটাল</span>
                <span className="font-semibold">{formatPrice(cart.total)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                <span className="font-semibold text-green-600">ফ্রি</span>
              </div>

              <Separator className="bg-border/40" />

              <div className="flex justify-between text-base">
                <span className="font-semibold">সর্বমোট</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button
                size="lg"
                className="w-full rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                চেকআউট করুন
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground text-center mt-4">
              ২০-৩০ মিনিটে ডেলিভারি
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <span className="text-muted-foreground">তাজা গ্যারান্টি</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="text-blue-600">✓</span>
                </div>
                <span className="text-muted-foreground">নিরাপদ পেমেন্ট</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/80 backdrop-blur-[30px] border-t border-border/40 p-3 shadow-2xl">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">সর্বমোট</p>
            <p className="text-xl font-bold text-primary">
              {formatPrice(cart.total)}
            </p>
          </div>

          <Link href="/checkout" className="flex-1 max-w-xs">
            <Button size="lg" className="w-full rounded-full shadow-lg">
              চেকআউট করুন
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
