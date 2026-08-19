export interface DiscountCode {
  code: string;
  percentage: number;
  description: string;
  isCieStudentCode?: boolean;
}

export const CIE_STUDENT_DISCOUNT_CODES: Record<string, DiscountCode> = {
  // 1: 10% Discount
  CIE10: {
    code: 'CIE10',
    percentage: 10,
    description: '10% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },
  STUDENT10: {
    code: 'CIE10',
    percentage: 10,
    description: '10% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },

  // 2: 15% Discount
  CIE15: {
    code: 'CIE15',
    percentage: 15,
    description: '15% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },
  STUDENT15: {
    code: 'CIE15',
    percentage: 15,
    description: '15% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },

  // 3: 30% Discount
  CIE30: {
    code: 'CIE30',
    percentage: 30,
    description: '30% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },
  STUDENT30: {
    code: 'CIE30',
    percentage: 30,
    description: '30% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },

  // 4: 40% Discount
  CIE40: {
    code: 'CIE40',
    percentage: 40,
    description: '40% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },
  STUDENT40: {
    code: 'CIE40',
    percentage: 40,
    description: '40% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },

  // 5: 50% Discount
  CIE50: {
    code: 'CIE50',
    percentage: 50,
    description: '50% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },
  STUDENT50: {
    code: 'CIE50',
    percentage: 50,
    description: '50% Student Discount (Valid with CIE Result)',
    isCieStudentCode: true,
  },

  // General Store Coupons
  SPARKLE10: {
    code: 'SPARKLE10',
    percentage: 10,
    description: '10% Welcome Discount',
    isCieStudentCode: false,
  },
  VIP20: {
    code: 'VIP20',
    percentage: 20,
    description: '20% VIP Customer Discount',
    isCieStudentCode: false,
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
  const matchKey = Object.keys(CIE_STUDENT_DISCOUNT_CODES).find(
    (key) => key.toUpperCase().replace(/[\s-_]/g, '') === normalized
  );

  if (matchKey && CIE_STUDENT_DISCOUNT_CODES[matchKey]) {
    const discount = CIE_STUDENT_DISCOUNT_CODES[matchKey];
    return {
      valid: true,
      discount,
      message: discount.isCieStudentCode
        ? `🎓 Student Discount ${discount.code} applied! (${discount.percentage}% OFF)`
        : `Promo code ${discount.code} applied! (${discount.percentage}% OFF)`,
    };
  }

  return {
    valid: false,
    message: 'Invalid discount code. For student discounts, enter your CIE code (e.g. CIE10, CIE15, CIE30, CIE40, CIE50).',
  };
};
