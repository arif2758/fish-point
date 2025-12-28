"use client";

import { IProduct } from "@/types";
import HomeProductCard from "@/components/products/ProductCard"; // Use your updated card
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  products: IProduct[];
  view: "grid" | "list";
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function ProductGrid({
  products,
  view,
  isLoading,
  hasMore,
  onLoadMore,
}: ProductGridProps) {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center border rounded-xl bg-muted/10">
        <p className="text-lg font-medium text-muted-foreground">
          দুঃখিত! কোনো পণ্য পাওয়া যায়নি
        </p>
        <p className="text-sm text-muted-foreground">
          অনুগ্রহ করে ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
        </p>
      </div>
    );
  }
 
  return (
    <div className="space-y-8">
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" // Adjusted for sidebar space
            : "flex flex-col gap-4"
        }
      >
        {products.map((product) => (
          <HomeProductCard key={product.productId} product={product} />
        ))}
      </div>

      {/* Loading & Load More */}
      <div className="flex justify-center pt-4 pb-8">
        {isLoading ? (
          <Button disabled variant="outline" className="gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            লোড হচ্ছে...
          </Button>
        ) : hasMore ? (
          <Button
            onClick={onLoadMore}
            size="lg"
            variant="secondary"
            className="px-8"
          >
            আরও দেখুন
          </Button>
        ) : products.length > 0 ? (
          <p className="text-sm text-muted-foreground">আর কোনো পণ্য নেই</p>
        ) : null}
      </div>
    </div>
  );
}
