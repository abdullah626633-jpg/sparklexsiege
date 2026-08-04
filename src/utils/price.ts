export const AZADI_DISCOUNT_PERCENT = 14;

/**
 * Calculates the 14% Azadi sale discounted price from the original price.
 */
export function getDiscountedPrice(originalPrice: number): number {
  return Math.round(originalPrice * (1 - AZADI_DISCOUNT_PERCENT / 100));
}

/**
 * Formats a numeric price to Rs. format (e.g. Rs. 2,107)
 */
export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`;
}
