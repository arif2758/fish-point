// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  User,
  Menu,
  ShoppingCart,
  X,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useCart } from "@/contexts/CartContext";

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

const TRENDING_SEARCHES = ["পাঙ্গাস", "চিংড়ি", "ইলিশ", "ready to cook"];

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart } = useCart(); // ✅ Get cart from context
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const currentFishType = searchParams.get("fishType");
  const currentSearch = searchParams.get("search");
  const isOffer = searchParams.get("offer") === "true";

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(debouncedSearch.trim())}`
      );
    } else if (searchQuery === "" && currentSearch) {
      router.push("/products");
    }
  }, [debouncedSearch, router, currentSearch, searchQuery]);

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
    setShowSearch(false);
    setSearchQuery("");
    setMobileMenuOpen(false);

    if (categoryValue === "all") {
      router.push("/products");
    } else if (categoryValue === "offer") {
      router.push("/products?offer=true");
    } else {
      router.push(`/products?fishType=${categoryValue}`);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
      setIsFocused(false);
    }
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    setShowSearch(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (currentSearch) {
      router.push("/products");
    }
  };

  const isCategoryActive = (categoryValue: string) => {
    if (categoryValue === "all") {
      return !currentFishType && !currentSearch && !isOffer;
    }
    if (categoryValue === "offer") {
      return isOffer;
    }
    return currentFishType === categoryValue;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      {/* Main Header */}
      <nav
        className="container mx-auto flex h-14 items-center justify-between px-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
          aria-label="FishPoint Homepage"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/20">
            FP
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/70">
            FishPoint
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-primary/10 transition-colors"
            onClick={handleSearchToggle}
            aria-label={showSearch ? "বন্ধ করুন" : "সার্চ করুন"}
          >
            {showSearch ? (
              <X className="size-5" />
            ) : (
              <Search className="size-5" />
            )}
          </Button>

          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative shrink-0 rounded-full hover:bg-primary/10"
              aria-label={`কার্ট - ${cart.itemCount} আইটেম`}
            >
              <ShoppingCart className="size-5" />
              {cart.itemCount > 0 && (
                <Badge className="absolute -right-1 -top-1 size-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] shadow-sm bg-primary border-2 border-background">
                  {cart.itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hidden lg:flex rounded-full hover:bg-primary/10"
            aria-label="প্রোফাইল"
          >
            <User className="size-5" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden rounded-full hover:bg-primary/10"
                aria-label="মেনু"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-75 p-0 border-l border-white/20 bg-white/70 backdrop-blur-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
            >
              <SheetHeader className="p-6 pb-2 text-left">
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-xl shadow-primary/20">
                    FP
                  </div>
                  <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                    FishPoint
                  </span>
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-80px)] px-4">
                <nav
                  className="py-6 space-y-3 pr-2"
                  aria-label="Mobile categories"
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = isCategoryActive(cat.value);

                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`
                          group relative w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ease-out
                          ${
                            isActive
                              ? "bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 text-primary font-semibold translate-x-1"
                              : "hover:bg-white/40 hover:shadow-sm text-muted-foreground border border-transparent hover:border-white/30"
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/80 to-transparent pointer-events-none" />
                        )}

                        <span className="relative z-10 flex items-center gap-3">
                          <span
                            className={`size-2 rounded-full transition-all duration-300 ${
                              isActive
                                ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                : "bg-muted-foreground/30"
                            }`}
                          />
                          {cat.label}
                        </span>

                        <ChevronRight
                          className={`size-4 transition-transform duration-300 ${
                            isActive
                              ? "text-primary translate-x-0"
                              : "text-transparent -translate-x-4 group-hover:text-muted-foreground/50 group-hover:translate-x-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Search Bar */}
      {showSearch && (
        <div className="border-t border-white/20 bg-white/60 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(
                    `/products?search=${encodeURIComponent(searchQuery.trim())}`
                  );
                  setShowSearch(false);
                }
              }}
              role="search"
            >
              <div className="relative group">
                <Search
                  className={`absolute left-4 top-1/2 size-5 -translate-y-1/2 transition-colors duration-200 ${
                    isFocused ? "text-primary" : "text-muted-foreground"
                  }`}
                />

                <Input
                  type="text"
                  placeholder="মাছের নাম লিখুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`
                    h-12 sm:h-14 pl-12 pr-12 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300
                    bg-white/50 backdrop-blur-sm
                    ${
                      isFocused
                        ? "border-primary/50 shadow-[0_0_20px_rgba(0,0,0,0.05)] ring-4 ring-primary/5"
                        : "border-transparent shadow-sm hover:bg-white/80"
                    }
                  `}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />

                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 size-8 -translate-y-1/2 rounded-xl p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleClearSearch}
                    aria-label="সার্চ মুছুন"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>

              <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
                <TrendingUp className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  জনপ্রিয়:
                </span>
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleTrendingClick(term)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/50 hover:bg-primary hover:text-white border border-white/20 hover:border-primary transition-all duration-300 shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Ticker */}
      <aside className="bg-linear-to-r from-destructive/10 via-destructive/5 to-destructive/10 px-4 py-1.5 text-xs font-medium text-destructive backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-center sm:justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex size-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
            </span>
            <span className="hidden xs:inline">লাইভ স্টক: </span>পাঙ্গাস এখন ২০%
            ছাড়ে!
          </span>
          <a
            href="tel:01700000000"
            className="hidden sm:inline-block font-bold hover:underline"
          >
            অর্ডার করুন: 01700-000000
          </a>
        </div>
      </aside>

      {/* Categories - All Devices */}
      <nav className="border-t border-white/20 bg-white/40 backdrop-blur-md">
        <div className="container mx-auto relative">
          {/* Left Fade Gradient */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white/80 via-white/40 to-transparent z-20 pointer-events-none hidden sm:block" />
          )}

          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 size-7 sm:size-8 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 border border-white/50 hidden sm:flex transition-all duration-300"
              aria-label="বামে স্ক্রল করুন"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            <div className="flex space-x-2 sm:space-x-3 p-2 sm:p-3 px-2 sm:px-12">
              {CATEGORIES.map((cat) => {
                const isActive = isCategoryActive(cat.value);

                return (
                  <Button
                    key={cat.value}
                    variant="ghost"
                    size="sm"
                    className={`
                      rounded-full px-3 sm:px-5 text-xs h-8 sm:h-9 transition-all duration-300 font-medium shrink-0 whitespace-nowrap
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:text-primary-foreground"
                          : "bg-white shadow-md text-muted-foreground border border-white/50 hover:shadow-lg hover:border-primary/30"
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

          {/* Right Fade Gradient */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white/80 via-white/40 to-transparent z-20 pointer-events-none hidden sm:block" />
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 size-7 sm:size-8 rounded-full bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 border border-white/50 hidden sm:flex transition-all duration-300"
              aria-label="ডানে স্ক্রল করুন"
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
