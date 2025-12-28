// src/components/navigation/CategoryNav.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation"; // ✅ usePathname যুক্ত করা হয়েছে
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { label: "সব", value: "all" },
  { label: "পাঙ্গাস", value: "pangas" },
  { label: "তেলাপিয়া", value: "tilapia" },
  { label: "চিংড়ি", value: "prawn" },
  { label: "ইলিশ", value: "hilsa" },
  { label: "রুই-কাতলা", value: "rohu" },
  { label: "শিং", value: "shing" },
  { label: "পাবদা", value: "pabda" },
  { label: "কই", value: "koi" },
  { label: "ট্যাংড়া", value: "tangra" },
  { label: "বাইম", value: "baim" },
  { label: "গুলশা", value: "gulsha" },
  { label: "পোয়া", value: "poa" },
  { label: "শোল", value: "shol" },
  { label: "সুরমা", value: "surma" },
  { label: "চিতল", value: "chitol" },
  { label: "সামুদ্রিক", value: "sea-fish" },
  { label: "ছোট মাছ", value: "small-fish" },
  { label: "Ready to Cook", value: "ready-to-cook" },
  { label: "অফার", value: "offer" },
];

export default function CategoryNav() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ বর্তমান পাথ পাওয়ার জন্য
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const currentFishType = searchParams.get("fishType");
  const currentSearch = searchParams.get("search");
  const isOffer = searchParams.get("offer") === "true";

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);

    const container = scrollContainerRef.current;
    const handleScroll = () => checkScroll();
    const handleResize = () => checkScroll();

    if (container) {
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (categoryValue: string) => {
    if (categoryValue === "all") {
      router.push("/products");
    } else if (categoryValue === "offer") {
      router.push("/products?offer=true");
    } else {
      router.push(`/products?fishType=${categoryValue}`);
    }
  };

  // ✅ লজিক আপডেট করা হয়েছে
  const isCategoryActive = (categoryValue: string) => {
    if (categoryValue === "all") {
      // শুধুমাত্র তখনই Active হবে যখন ইউজার '/products' পেজে আছে এবং অন্য কোনো ফিল্টার নেই
      return (
        pathname === "/products" &&
        !currentFishType &&
        !currentSearch &&
        !isOffer
      );
    }
    if (categoryValue === "offer") {
      return isOffer;
    }
    return currentFishType === categoryValue;
  };

  return (
    <nav className="bg-card/30 backdrop-blur-[25px] backdrop-saturate-150 relative overflow-hidden">
      {/* Left Mask */}
      <div className="absolute left-0 top-0 bottom-0 w-14 sm:w-16 bg-card/30 backdrop-blur-[25px] backdrop-saturate-150 z-10 pointer-events-none hidden sm:block" />

      {/* Left Arrow */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card backdrop-blur-[30px] hover:bg-card/95 shadow-xl hover:shadow-2xl border-2 border-border/60 hidden sm:flex transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        <div className="flex space-x-2 sm:space-x-3 p-2 sm:p-3 px-4 sm:px-20">
          {CATEGORIES.map((cat) => {
            const isActive = isCategoryActive(cat.value);

            return (
              <Button
                key={cat.value}
                variant="ghost"
                size="sm"
                className={`
                  rounded-full px-3 sm:px-5 text-xs h-8 sm:h-9 
                  transition-all duration-300 font-medium shrink-0 whitespace-nowrap
                  backdrop-blur-md
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 border-primary/20 hover:text-primary-foreground"
                      : "bg-secondary/60 shadow-md text-foreground border border-border/40 hover:shadow-lg hover:border-border/60 hover:bg-secondary/80"
                  }
                `}
                onClick={() => handleCategoryClick(cat.value)}
              >
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Right Mask */}
      <div className="absolute right-0 top-0 bottom-0 w-14 sm:w-16 bg-card/30 backdrop-blur-[25px] backdrop-saturate-150 z-10 pointer-events-none hidden sm:block" />

      {/* Right Arrow */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-card backdrop-blur-[30px] hover:bg-card/95 shadow-xl hover:shadow-2xl border-2 border-border/60 hidden sm:flex transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </nav>
  );
}
