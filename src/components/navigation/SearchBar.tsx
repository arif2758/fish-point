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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose?.();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 top-14 z-40 bg-black/40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className="absolute top-14 left-0 right-0 z-50 bg-popover/95 transition-all duration-300 border-b border-border/40 shadow-2xl"
        style={{ backdropFilter: "blur(30px) saturate(180%)" }}
      >
        <div className="container mx-auto px-4 h-14 flex items-center">
          <form
            onSubmit={handleSubmit}
            role="search"
            className="w-full relative"
          >
            <div className="relative group flex items-center">
              <Search
                className={`absolute left-3 h-4 w-4 transition-colors duration-200 ${
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
                h-10 w-full pl-10 pr-10 text-sm rounded-full
                border-none transition-all duration-300
                bg-accent/30 backdrop-blur-[15px]
                ${
                  isFocused
                    ? "bg-accent/50 ring-2 ring-primary/20 shadow-inner"
                    : "hover:bg-accent/40"
                }
              `}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Trending Searches - Floating below */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-popover/98 backdrop-blur-3xl border border-border/40 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 flex-wrap">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    জনপ্রিয়:
                  </span>
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTrendingClick(term)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-secondary/40 hover:bg-primary hover:text-primary-foreground border border-border/30 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
