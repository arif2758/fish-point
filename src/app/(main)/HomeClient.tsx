"use client";

import { IProduct } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import HomeProductCard from "@/components/products/ProductCard";

export default function HomeClient({ products }: { products: IProduct[] }) {
  return (
    <div className="min-h-screen pb-20">
      <main className="space-y-8">
        <HeroSection />

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
