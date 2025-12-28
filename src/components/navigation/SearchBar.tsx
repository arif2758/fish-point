"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";

const TRENDING_SEARCHES = ["পাঙ্গাস", "চিংড়ি", "ইলিশ", "ready to cook"];

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(debouncedSearch.trim())}`
      );
    }
  }, [debouncedSearch, router]);

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    onClose?.();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    router.push("/products");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
      onClose?.();
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-[30px] backdrop-saturate-180 animate-in slide-in-from-top-2 duration-300 border-b border-border/40">
      <div className="container mx-auto px-4 pt-1 pb-4">
        <form onSubmit={handleSubmit} role="search">
          <div className="relative group">
            <Search
              className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-200 ${
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
                h-12 sm:h-14 pl-12 pr-12 text-sm sm:text-base rounded-2xl 
                border-2 transition-all duration-300
                bg-background/30 backdrop-blur-[15px]
                ${
                  isFocused
                    ? "border-primary/50 shadow-[0_0_20px_rgba(0,0,0,0.08)] ring-4 ring-primary/10"
                    : "border-border/40 shadow-sm hover:bg-background/50 hover:border-border/60"
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
                className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-xl p-0 hover:bg-destructive/10 hover:text-destructive transition-all"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              জনপ্রিয়:
            </span>
            {TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleTrendingClick(term)}
                className="text-xs px-3 py-1.5 rounded-xl bg-secondary/40 hover:bg-primary hover:text-primary-foreground border border-border/30 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-[10px]"
              >
                {term}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}