"use client";

import { IProduct } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import HomeProductCard from "@/components/products/ProductCard";

interface HomeClientProps {
  products: IProduct[];
}

export default function HomeClient({ products }: HomeClientProps) {
  // Client side এ filter করে নিলাম
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <div className="min-h-screen pb-20">
      <main className="space-y-8">
        <HeroSection featuredProducts={featuredProducts} />

        {/* Product Grid - Liquid Glass Style */}
        <section className="container mx-auto px-4">
          {/* Section Header - Compact Liquid Glass */}
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-linear-to-br from-primary/5 via-background/40 to-primary/5 px-4 py-2 backdrop-blur-xl shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/30">
              <span className="text-lg sm:xl">✨</span>
              <h2 className="bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                জনপ্রিয় মাছ
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <HomeProductCard key={product.productId} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
