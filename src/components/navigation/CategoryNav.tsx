"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  const pathname = usePathname();
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

  const isCategoryActive = (categoryValue: string) => {
    if (categoryValue === "all") {
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
    <nav className="bg-card/40 backdrop-blur-xl border-b border-border/40 relative overflow-hidden">
      {/* Left Gradient Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-linear-to-r from-card/80 via-card/40 to-transparent z-10 pointer-events-none" />

      {/* Left Arrow */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-card/90 backdrop-blur-md hover:bg-card shadow-lg border border-border/40 transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
      >
        <div className="flex items-center gap-2 py-3 px-3 sm:px-16">
          {CATEGORIES.map((cat) => {
            const isActive = isCategoryActive(cat.value);

            return (
              <Button
                key={cat.value}
                variant="ghost"
                size="sm"
                className={`
                  rounded-full px-4 sm:px-5 text-xs h-8 sm:h-9
                  transition-all duration-300 font-medium shrink-0 whitespace-nowrap
                  backdrop-blur-md
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg border border-primary/20"
                      : "bg-secondary/60 text-foreground border border-border/40 hover:bg-secondary/80 hover:border-border/60 shadow-sm hover:shadow-md"
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

      {/* Right Gradient Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-linear-to-l from-card/80 via-card/40 to-transparent z-10 pointer-events-none" />

      {/* Right Arrow */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-card/90 backdrop-blur-md hover:bg-card shadow-lg border border-border/40 transition-all duration-200 hover:scale-105"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}
