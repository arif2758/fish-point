"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { IProduct } from "@/types";
import HomeProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

interface ProductsPageClientProps {
  products: IProduct[];
}

export default function ProductsPageClient({
  products,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const fishType = searchParams.get("fishType");
  const search = searchParams.get("search");
  const isOffer = searchParams.get("offer") === "true";

  // ✅ Case-insensitive filtering
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Fish Type Filter (case-insensitive exact match)
    if (fishType && fishType !== "all") {
      filtered = filtered.filter(
        (p) => p.fishType.toLowerCase() === fishType.toLowerCase()
      );
    }

    // 2. Offer Filter
    if (isOffer) {
      filtered = filtered.filter((p) => p.discountPercentage > 0);
    }

    // 3. Multi-field Search (case-insensitive partial match)
    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const fields = [p.title, p.name_en, p.slug, p.fishType];
        return fields.some((field) =>
          field.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [products, fishType, search, isOffer]);

  const handleReset = () => {
    window.location.href = "/products";
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-4">
        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <HomeProductCard key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State - Glass Card */
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center space-y-4 max-w-md mx-auto rounded-2xl border border-border/40 bg-card/40 backdrop-blur-[20px] p-8 sm:p-12 shadow-lg">
              <div className="mx-auto h-20 w-20 rounded-full bg-muted/50 backdrop-blur-[10px] flex items-center justify-center mb-4">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                কোনো পণ্য পাওয়া যায়নি
              </h3>

              <p className="text-sm text-muted-foreground">
                {search
                  ? `"${search}" এর জন্য কোনো ফলাফল নেই`
                  : fishType
                  ? `"${fishType}" ক্যাটাগরিতে কোনো পণ্য নেই`
                  : "অন্য ক্যাটাগরি থেকে দেখুন"}
              </p>

              <Button
                variant="default"
                size="sm"
                onClick={handleReset}
                className="mt-4 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                সব পণ্য দেখুন
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
