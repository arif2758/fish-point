// src/components/navigation/TopNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

import SearchBar from "./SearchBar";
import Image from "next/image";
// import SearchBar from "./SearchBar"; // যদি থাকে

export default function TopNav() {
  const [showSearch, setShowSearch] = useState(false);

  // ✅ Context থেকে সরাসরি কার্ট ডেটা নিন
  // আমাদের CartContext নিজে থেকেই মাউন্টিং হ্যান্ডেল করে, তাই এখানে আলাদা useEffect দরকার নেই
  const { cart } = useCart();

  // সরাসরি কার্ট লেন্থ ব্যবহার করুন.
  
  // শুরুতে এটি 0 থাকবে (Server & Client match), পরে ডেটা লোড হলে আপডেট হবে
  const cartItemCount = cart?.items?.length || 0;

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="bg-card/40 backdrop-blur-[30px] backdrop-saturate-180 border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            aria-label="FishPoint Homepage"
          >
            <div className="flex size-9 items-center justify-center transition-shadow hover:shadow-xl">
              <Image
                src="/logo.svg"
                alt="FishPoint logo"
                width={32}
                height={32}
                priority
              />
            </div>

            <span className="text-xl font-bold tracking-tight">FishPoint</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <X className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
            </Button>

            {/* Cart Icon with Dynamic Badge */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative shrink-0 rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="size-5" />

                {/* Badge Logic */}
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 size-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold shadow-md bg-primary text-primary-foreground border-2 border-background/80 animate-in zoom-in duration-300">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hidden lg:flex rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
            >
              <User className="size-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
    </div>
  );
}
