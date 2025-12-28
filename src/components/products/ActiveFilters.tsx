"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";

interface ActiveFiltersProps {
  filters: {
    fishType: string[];
    fishSize: string[]; // ✅ fishSize
    cuttingSize: string[]; // ✅ cuttingSize
    source: string[];
    priceRange: [number, number];
    inStock: boolean;
  };
  defaultPriceRange: [number, number];
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  defaultPriceRange,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.fishType.length > 0 ||
    filters.fishSize.length > 0 || // ✅ fishSize
    filters.cuttingSize.length > 0 || // ✅ cuttingSize
    filters.source.length > 0 ||
    filters.inStock ||
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        সক্রিয় ফিল্টার:
      </span>

      {/* Fish Type */}
      {filters.fishType.map((type) => (
        <Badge key={type} variant="secondary" className="gap-1">
          {type}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("fishType", type)}
          />
        </Badge>
      ))}

      {/* Fish Size */}
      {filters.fishSize.map((size) => (
        <Badge key={size} variant="secondary" className="gap-1">
          {size}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("fishSize", size)}
          />
        </Badge>
      ))}

      {/* Cutting Size */}
      {filters.cuttingSize.map((size) => (
        <Badge key={size} variant="secondary" className="gap-1">
          {size}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("cuttingSize", size)}
          />
        </Badge>
      ))}

      {/* Source */}
      {filters.source.map((src) => (
        <Badge key={src} variant="secondary" className="gap-1">
          {src}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("source", src)}
          />
        </Badge>
      ))}

      {/* In Stock */}
      {filters.inStock && (
        <Badge variant="secondary" className="gap-1">
          স্টকে আছে
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("inStock")}
          />
        </Badge>
      )}

      {/* Price Range */}
      {(filters.priceRange[0] !== defaultPriceRange[0] ||
        filters.priceRange[1] !== defaultPriceRange[1]) && (
        <Badge variant="secondary" className="gap-1">
          ৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemove("priceRange")}
          />
        </Badge>
      )}

      {/* Reset All Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs"
      >
        <RotateCcw className="mr-1 h-3 w-3" />
        সব মুছুন
      </Button>
    </div>
  );
}