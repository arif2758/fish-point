// src/lib/priceUtils.ts

/**
 * Calculate total price based on quantity
 */
export function calculateTotalPrice(pricePerKg: number, quantity: number): number {
  return pricePerKg * quantity;
}

/**
 * Format price in Bangladeshi Taka
 */
export function formatPrice(price: number): string {
  return `৳${Math.round(price)}`;
}

/**
 * Format price with decimal
 */
export function formatPriceWithDecimal(price: number): string {
  return `৳${price.toFixed(2)}`;
}

/**
 * Calculate discount amount
 */
export function calculateDiscountAmount(
  basePrice: number, 
  discountPercentage: number
): number {
  return (basePrice * discountPercentage) / 100;
}

/**
 * Calculate sale price from base price and discount
 */
export function calculateSalePrice(
  basePrice: number, 
  discountPercentage: number
): number {
  const discount = calculateDiscountAmount(basePrice, discountPercentage);
  return basePrice - discount;
}

/**
 * Calculate savings amount
 */
export function calculateSavings(
  basePrice: number, 
  salePrice: number
): number {
  return basePrice - salePrice;
}

/**
 * Get price display with discount
 */
export function getPriceDisplay(product: {
  basePrice: number;
  salePrice: number;
  discountPercentage: number;
}) {
  return {
    current: formatPrice(product.salePrice),
    original: formatPrice(product.basePrice),
    savings: formatPrice(calculateSavings(product.basePrice, product.salePrice)),
    hasDiscount: product.discountPercentage > 0,
  };
}

/**
 * Calculate total with quantity
 */
export function calculateOrderTotal(
  pricePerKg: number, 
  quantity: number, 
  discountPercentage: number = 0
): {
  subtotal: number;
  discount: number;
  total: number;
} {
  const subtotal = calculateTotalPrice(pricePerKg, quantity);
  const discount = calculateDiscountAmount(subtotal, discountPercentage);
  const total = subtotal - discount;

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    total: Math.round(total),
  };
}