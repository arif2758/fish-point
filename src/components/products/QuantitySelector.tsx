"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (value: number) => void;
  min: number;
  max: number;
  className?: string;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
  min,
  max,
  className,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      setQuantity(Math.max(min, quantity - 1));
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      setQuantity(Math.min(max, quantity + 1));
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/40 backdrop-blur-[10px] p-1 shadow-sm",
        className
      )}
      style={{
        borderRadius: "1rem", // 16px - Outer radius
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 p-0 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:scale-100 transition-all"
        style={{
          borderRadius: "0.75rem", // 12px = 16px - 4px (padding)
        }}
        onClick={handleDecrease}
        disabled={quantity <= min}
        aria-label="কমান"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <span className="min-w-8 text-center text-sm font-bold tabular-nums select-none px-1">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 p-0 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:scale-100 transition-all"
        style={{
          borderRadius: "0.75rem", // 12px = 16px - 4px (padding)
        }}
        onClick={handleIncrease}
        disabled={quantity >= max}
        aria-label="বাড়ান"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
