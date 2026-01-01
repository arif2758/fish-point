// src/components/products/HomeProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { cn } from "@/lib/utils";
import { IProduct } from "@/types";
import QuantitySelector from "./QuantitySelector";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({ product }: { product: IProduct }) {
  const [quantity, setQuantity] = useState(product.minOrderKg);
  const { addToCart, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, quantity);

    // Show "Added" feedback
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const productInCart = isInCart(product.productId);
 
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] transition-all duration-300 hover:shadow-xl hover:border-border/60 hover:bg-card/60">
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-muted/30"
      >
        <Image
          src={product.mainImage}
          alt={`${product.title} - ${product.name_en}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge */}
        <Badge className="absolute left-2 top-2 text-xs text-white px-2 py-0.5 backdrop-blur-lg bg-orange-600/90 dark:bg-orange-700/95">
          -{product.discountPercentage}%
        </Badge>

        {/* Stock Indicator */}
        {product.stockKg === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[20px]">
            <Badge variant="destructive" className="text-xs shadow-lg">
              স্টক নেই
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title + Fish Size */}
        <Link href={`/products/${product.slug}`} className="mb-5 block">
          <h3 className="text-base sm:text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.title}
            {product.fishSize && (
              <span className="text-xs sm:text-[11px] font-normal text-muted-foreground ml-1">
                {product.fishSize} কেজি সাইজের
              </span>
            )}
          </h3>
        </Link>

        {/* Price + Quantity */}
        <div className="mb-5 flex items-center justify-between gap-2">
          {/* Left: Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-xl font-black text-primary leading-none">
              {formatPrice(product.salePrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
            <span className="text-xs sm:text-[10px] text-muted-foreground leading-none">
              /কেজি
            </span>
          </div>

          {/* Right: Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            min={product.minOrderKg}
            max={product.maxOrderKg}
            className="h-8 "
          />
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          className={cn(
            "w-full h-10 sm:h-9 rounded-full text-sm sm:text-xs font-semibold shadow-md hover:shadow-lg transition-all mt-auto backdrop-blur-md",
            product.stockKg === 0 && "opacity-50 cursor-not-allowed",
            justAdded && "bg-green-600 hover:bg-green-600"
          )}
          onClick={handleAddToCart}
          disabled={product.stockKg === 0}
        >
          {justAdded ? (
            <>
              <Check className="mr-1.5 size-4 sm:size-3.5" />
              যোগ হয়েছে
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 size-4 sm:size-3.5" />
              {product.stockKg > 0
                ? productInCart
                  ? "আরও যোগ করুন"
                  : "কার্টে যোগ করুন"
                : "স্টক নেই"}
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
