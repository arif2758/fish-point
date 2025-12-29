// src\app\(main)\HomeClient.tsx
"use client";

import { IProduct } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import HomeProductCard from "@/components/products/ProductCard";

interface HomeClientProps {
  products: IProduct[];
}

export default function HomeClient({ products }: HomeClientProps) {
  // Client side এ filter করে নিলাম
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);

  return (
    <div className="min-h-screen pb-20">
      <main className="space-y-8">
        <HeroSection featuredProducts={featuredProducts} />

        {/* Product Grid - Liquid Glass Style */}
        <section className="container mx-auto px-4">
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