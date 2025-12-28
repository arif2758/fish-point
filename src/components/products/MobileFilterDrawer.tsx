"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

interface MobileFilterDrawerProps {
  filters: {
    fishTypes: string[];
    fishSizes: string[]; // ✅ fishSizes
    cuttingSizes: string[];
    sources: string[];
    priceRange: { min: number; max: number };
  };
  activeFilters: {
    fishType: string[];
    fishSize: string[]; // ✅ fishSize
    cuttingSize: string[]; // ✅ cuttingSize
    source: string[];
    priceRange: [number, number];
    inStock: boolean;
  };
  onFilterChange: (
    key: string,
    value: string[] | [number, number] | boolean
  ) => void;
  onResetFilters: () => void;
}

export default function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          ফিল্টার
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>ফিল্টার করুন</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}