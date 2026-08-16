/**
 * Formats a numeric price to Rs. format (e.g. Rs. 2,107)
 */
export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`;
}

/**
 * Returns the price for a product.
 */
export function getDiscountedPrice(originalPrice: number): number {
  return originalPrice;
}
