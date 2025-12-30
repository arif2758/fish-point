"use client";

import { IProduct } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { Tag, TrendingDown, Percent } from "lucide-react";

interface OffersClientProps {
  products: IProduct[];
}

export default function OffersClient({ products }: OffersClientProps) {
  // Group products by discount range
  const highDiscounts = products.filter((p) => p.discountPercentage >= 20);
  const mediumDiscounts = products.filter(
    (p) => p.discountPercentage >= 10 && p.discountPercentage < 20
  );
  const lowDiscounts = products.filter((p) => p.discountPercentage < 10);

  return (
    <main className="container mx-auto px-4 py-8 pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-red-500">
            <Tag className="size-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">বিশেষ অফার</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          সীমিত সময়ের জন্য বিশেষ ছাড়! তাজা মাছ সাশ্রয়ী দামে কিনুন।
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="size-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-primary">{products.length}</p>
          <p className="text-xs text-muted-foreground">মোট অফার</p>
        </div>

        <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Percent className="size-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-primary">
            {highDiscounts.length > 0
              ? Math.max(...products.map((p) => p.discountPercentage))
              : 0}
            %
          </p>
          <p className="text-xs text-muted-foreground">সর্বোচ্চ ছাড়</p>
        </div>

        <div className="rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-4 text-center col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center mb-2">
            <Tag className="size-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-primary">
            {highDiscounts.length}
          </p>
          <p className="text-xs text-muted-foreground">২০%+ ছাড়</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Tag className="size-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">কোনো অফার নেই</h2>
          <p className="text-muted-foreground">
            এই মুহূর্তে কোনো বিশেষ অফার চলছে না। শীঘ্রই নতুন অফার আসবে!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* High Discounts (20%+) */}
          {highDiscounts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-orange-500">
                  <TrendingDown className="size-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">সুপার সেভিংস (২০%+ ছাড়)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {highDiscounts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Medium Discounts (10-19%) */}
          {mediumDiscounts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-yellow-500">
                  <Percent className="size-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">ভালো অফার (১০-১৯% ছাড়)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediumDiscounts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Low Discounts (<10%) */}
          {lowDiscounts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500">
                  <Tag className="size-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">অন্যান্য অফার</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lowDiscounts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
