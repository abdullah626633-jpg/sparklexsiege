export interface DiscountCode {
  code: string;
  percentage: number;
  description: string;
}

export const DISCOUNT_CODES: Record<string, DiscountCode> = {
  // General Store Coupons
  SPARKLE10: {
    code: 'SPARKLE10',
    percentage: 10,
    description: '10% Welcome Discount',
  },
  VIP20: {
    code: 'VIP20',
    percentage: 20,
    description: '20% VIP Customer Discount',
  },
};

/**
 * Validate and resolve a discount code
 */
export const validateDiscountCode = (inputCode: string): { valid: boolean; discount?: DiscountCode; message: string } => {
  const normalized = inputCode.trim().toUpperCase().replace(/[\s-_]/g, '');

  if (!normalized) {
    return { valid: false, message: 'Please enter a discount code.' };
  }

  // Exact lookup in definitions or normalized key
  const matchKey = Object.keys(DISCOUNT_CODES).find(
    (key) => key.toUpperCase().replace(/[\s-_]/g, '') === normalized
  );

  if (matchKey && DISCOUNT_CODES[matchKey]) {
    const discount = DISCOUNT_CODES[matchKey];
    return {
      valid: true,
      discount,
      message: `Promo code ${discount.code} applied! (${discount.percentage}% OFF)`,
    };
  }

  return {
    valid: false,
    message: 'Invalid discount code.',
  };
};
