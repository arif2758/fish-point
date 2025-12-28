"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    fishTypes: string[];
    fishSizes: string[];
    cuttingSizes: string[];
    sources: string[];
    priceRange: { min: number; max: number };
  };
  activeFilters: {
    fishType: string[];
    fishSize: string[]; // ✅ Changed from fishSizeKg to fishSize
    cuttingSize: string[];
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

const CUTTING_SIZE_LABELS: Record<string, string> = {
  xs: "ছোট",
  md: "নরমাল",
  lg: "বড়",
  xl: "এক্সট্রা বড়",
  "2xl": "এক পিস",
};

export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    activeFilters.priceRange
  );

  const handleCheckboxChange = (
    key: keyof Pick<
      typeof activeFilters,
      "fishType" | "fishSize" | "cuttingSize" | "source" // ✅ Changed fishSizeKg to fishSize
    >,
    value: string,
    checked: boolean
  ) => {
    const current = activeFilters[key];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    onFilterChange(key, updated);
  };

  return (
    <aside className="w-64 shrink-0 space-y-6 pr-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ফিল্টার</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 text-xs"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          রিসেট
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">মূল্য (৳/কেজি)</Label>
        <Slider
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          step={50}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={(value) =>
            onFilterChange("priceRange", value as [number, number])
          }
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>৳{priceRange[0]}</span>
          <span>৳{priceRange[1]}</span>
        </div>
      </div>

      {/* Fish Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">মাছের ধরন</Label>
        <div className="space-y-2">
          {filters.fishTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`fish-${type}`}
                checked={activeFilters.fishType.includes(type)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("fishType", type, checked as boolean)
                }
              />
              <label
                htmlFor={`fish-${type}`}
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fish Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">মাছের সাইজ</Label>
        <div className="space-y-2">
          {filters.fishSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={activeFilters.fishSize.includes(size)}
                onCheckedChange={
                  (checked) =>
                    handleCheckboxChange("fishSize", size, checked as boolean) // ✅ Changed key
                }
              />
              <label
                htmlFor={`size-${size}`}
                className="cursor-pointer text-sm leading-none"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Cutting Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">কাটিং সাইজ</Label>
        <div className="space-y-2">
          {filters.cuttingSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`cut-${size}`}
                checked={activeFilters.cuttingSize.includes(size)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("cuttingSize", size, checked as boolean)
                }
              />
              <label
                htmlFor={`cut-${size}`}
                className="cursor-pointer text-sm leading-none"
              >
                {CUTTING_SIZE_LABELS[size] || size}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">উৎস</Label>
        <div className="space-y-2">
          {filters.sources.map((src) => (
            <div key={src} className="flex items-center space-x-2">
              <Checkbox
                id={`source-${src}`}
                checked={activeFilters.source.includes(src)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("source", src, checked as boolean)
                }
              />
              <label
                htmlFor={`source-${src}`}
                className="cursor-pointer text-sm leading-none"
              >
                {src}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={activeFilters.inStock}
            onCheckedChange={(checked) =>
              onFilterChange("inStock", checked as boolean)
            }
          />
          <label
            htmlFor="in-stock"
            className="cursor-pointer text-sm leading-none"
          >
            শুধুমাত্র স্টকে আছে
          </label>
        </div>
      </div>
    </aside>
  );
}
