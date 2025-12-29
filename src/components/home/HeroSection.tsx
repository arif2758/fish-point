// src\components\home\HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { IProduct } from "@/types";

interface HeroSectionProps {
  featuredProducts: IProduct[];
}

export default function HeroSection({ featuredProducts }: HeroSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: featuredProducts.length > 4,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        {/* Relative wrapper */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 md:h-10 md:w-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            {/* 🛠️ FIX: 'gap' সরিয়ে Negative margin ব্যবহার করা হয়েছে */}
            <div className="flex -ml-2 md:-ml-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.productId}
                  href={`/products/${product.slug}`}
                  className="flex-[0_0_40%] md:flex-[0_0_calc(25%)] min-w-0 pl-2 md:pl-4 group/card"
                >
                  {/* Card Container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    {/* Image */}
                    <Image
                      src={product.mainImage}
                      alt={product.title}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      priority={featuredProducts.indexOf(product) < 4}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity" />

                    {/* Content */}
                    <div className="absolute inset-0 p-2 md:p-3 flex flex-col justify-end">
                      <div className="flex items-end justify-between gap-1.5 md:gap-2">
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[10px] sm:text-sm md:text-lg font-bold text-white leading-tight mb-0.5 md:mb-1 line-clamp-1 drop-shadow-md">
                            {product.title}
                          </h3>
                          <p className="text-[8px] sm:text-[10px] md:text-sm text-gray-200 line-clamp-1 drop-shadow-sm">
                            {product.fishSize
                              ? `${product.fishSize} সাইজের`
                              : "তাজা মাছ"}
                          </p>
                        </div>

                        {/* Buy Button */}
                        <Button
                          size="sm"
                          className="shrink-0 h-6 w-6 md:h-9 md:w-auto md:px-4 rounded-full md:rounded-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform active:scale-95 p-0 md:p-2"
                        >
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                          <span className="hidden md:inline text-xs font-medium">
                            কিনুন
                          </span>
                        </Button>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-primary/90 backdrop-blur-md text-white text-[8px] md:text-xs font-bold px-1.5 py-0.5 rounded shadow-lg">
                      Hot
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        {featuredProducts.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
