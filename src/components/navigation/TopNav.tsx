// src/components/navigation/TopNav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Menu,
  ShoppingCart,
  X,
  Home,
  Building2,
  Tag,
  Send,
  ChevronUp,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: Building2 },
  { label: "Offers", href: "/offers", icon: Tag },
  { label: "Packages", href: "/packages", icon: Boxes },
  { label: "Contact", href: "/contact", icon: Send },
];

export default function TopNav() {
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useCart();

  const cartItemCount = cart?.items?.length || 0;

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("offer=true"))
      return (
        pathname.includes("products") &&
        typeof window !== "undefined" &&
        window.location.search.includes("offer=true")
      );
    return pathname.startsWith(href);
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <nav className="bg-card/40 backdrop-blur-xl border-b border-border/40">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              aria-label="FishPoint Homepage"
            >
              <div className="flex size-8 items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="FishPoint logo"
                  width={28}
                  height={28}
                  priority
                />
              </div>
              <span className="text-lg font-bold tracking-tight">
                FishPoint
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center gap-2"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                      active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>

                    {/* Active Indicator */}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
              >
                {showSearch ? (
                  <X className="size-4" />
                ) : (
                  <Search className="size-4" />
                )}
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative shrink-0 h-9 w-9 rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
                  aria-label={`Cart with ${cartItemCount} items`}
                >
                  <ShoppingCart className="size-4" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 size-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold shadow-md bg-primary text-primary-foreground border-2 border-background/80 animate-in zoom-in duration-300">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User - Always Visible */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 flex rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
                aria-label="User account"
              >
                <User className="size-4" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 lg:hidden rounded-full hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Overlay - Moved out of <nav> to prevent backdrop-filter bugs */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-14 z-40 bg-black/60 animate-in fade-in duration-300 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu Content */}
            <div
              className="absolute top-14 left-0 right-0 z-50 lg:hidden border-b border-border/40 bg-popover/95 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300 shadow-2xl"
              style={{
                backdropFilter: "blur(30px) saturate(180%)",
              }}
            >
              <nav
                className="container mx-auto px-4 py-4 space-y-1.5"
                aria-label="Mobile navigation"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "text-primary bg-primary/10 shadow-inner"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-lg transition-colors",
                          active ? "bg-primary/20" : "bg-accent/50"
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}

        {/* Search Bar */}
        {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-20 right-4 z-40 h-11 w-11 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-5" />
        </Button>
      )}
    </>
  );
}
