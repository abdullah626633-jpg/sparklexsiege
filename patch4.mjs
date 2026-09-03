import fs from 'fs';

let content = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf8');

// 1. Remove import
content = content.replace(/import \{ validateDiscountCode, DiscountCode \} from '\.\.\/data\/discountCodes';\n/, '');

// 2. Remove confirmedDiscount states
content = content.replace(/const \[confirmedDiscountAmount, setConfirmedDiscountAmount\] = useState<number>\(0\);\n/g, '');
content = content.replace(/const \[confirmedDiscountCode, setConfirmedDiscountCode\] = useState<string \| null>\(null\);\n/g, '');

// 3. Remove Discount code state
content = content.replace(/\/\/ Discount code state\s*const \[discountInput, setDiscountInput\] = useState\(''\);\s*const \[appliedDiscount, setAppliedDiscount\] = useState<DiscountCode \| null>\(null\);\s*const \[discountMessage, setDiscountMessage\] = useState<\{ text: string; error: boolean \} \| null>\(null\);\s*/, '');

// 4. Remove session storage restore useEffect
content = content.replace(/\/\/ Restore coupon from session if set in Cart\s*useEffect\(\(\) => \{\s*try \{\s*const savedCode = sessionStorage\.getItem\('sparklez_discount_code'\);\s*if \(savedCode\) \{\s*const result = validateDiscountCode\(savedCode\);\s*if \(result\.valid && result\.discount\) \{\s*setAppliedDiscount\(result\.discount\);\s*setDiscountInput\(result\.discount\.code\);\s*setDiscountMessage\(\{ text: result\.message, error: false \}\);\s*\}\s*\}\s*\} catch \{\}\s*\}, \[\]\);\s*/, '');

// 5. Remove discount calculations
content = content.replace(/const discountPercent = appliedDiscount \? appliedDiscount\.percentage : 0;\s*const discountAmount = Math\.round\(\(subtotal \* discountPercent\) \/ 100\);\s*const discountedSubtotal = Math\.max\(0, subtotal - discountAmount\);\s*/, '');
content = content.replace(/const total = discountedSubtotal \+ shipping;/g, 'const total = subtotal + shipping;');

// 6. Remove handlers
content = content.replace(/const handleApplyDiscount = \(e: React\.FormEvent\) => \{[\s\S]*?\};\s*const handleRemoveDiscount = \(\) => \{[\s\S]*?\};\s*/, '');

// 7. Remove from email payload
content = content.replace(/discount: discountAmount > 0 \? `Rs\. \$\{discountAmount\.toLocaleString\(\)\} \(\$\{appliedDiscount\?\.code\} • \$\{discountPercent\}% OFF\)` : undefined,\s*/g, '');
content = content.replace(/discount_code: appliedDiscount \? appliedDiscount\.code : undefined,\s*/g, '');

// 8. Remove confirmed sets
content = content.replace(/setConfirmedDiscountAmount\(discountAmount\);\s*/g, '');
content = content.replace(/setConfirmedDiscountCode\(appliedDiscount \? appliedDiscount\.code : null\);\s*/g, '');

// 9. Remove from WhatsApp checkout tracking text
// Note: WhatsApp text no longer has discount, so skip unless it does. Wait, in previous step I already removed discount from WhatsApp message? Let me check.
// In patch3 I replaced the whatsapp logic with one that didn't have discount.

// 10. Remove from onClearCart
content = content.replace(/try \{\s*sessionStorage\.removeItem\('sparklez_discount_code'\);\s*\} catch \{\}\s*/g, '');

// 11. Remove from Success view
const successDiscountRegex = /\{\s*confirmedDiscountAmount\s*>\s*0\s*&&\s*\([\s\S]*?<\/[a-z]+>\s*\)\s*\}/;
content = content.replace(successDiscountRegex, '');

// 12. Remove from Cart Breakdown
const breakdownDiscountRegex = /\{\s*discountAmount\s*>\s*0\s*&&\s*\([\s\S]*?<\/[a-z]+>\s*\)\s*\}/;
content = content.replace(breakdownDiscountRegex, '');

// 13. Remove Discount UI Section
const uiDiscountRegex = /\{\/\*\s*Discount Section\s*\*\/\}.*?\{\/\*\s*6\. PAYMENT METHOD: SELECTABLE BANK TRANSFER \(FREE DELIVERY\) OR COD\s*\*\/\}/s;
content = content.replace(uiDiscountRegex, "{/* 6. PAYMENT METHOD: SELECTABLE BANK TRANSFER (FREE DELIVERY) OR COD */}");
content = content.replace(/\{\/\*\s*Discount Section moved below\s*\*\/\}/, '');

fs.writeFileSync('src/pages/CheckoutPage.tsx', content);

