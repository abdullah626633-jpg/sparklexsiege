import emailjs from '@emailjs/browser';
import { CartItem } from '../types';
import { getDiscountedPrice } from '../utils/price';

const env = (import.meta as any).env || {};
const SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || 'service_46etuf1';
const TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || 'template_pjga6tg';
const PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || 'X3-kO1QScsx1CWrh8';

export interface OrderEmailParams {
  order_id: string;
  customer_name: string;
  customer_email: string;
  phone_number: string;
  alt_phone_number?: string;
  address: string;
  landmark?: string;
  city: string;
  state?: string;
  zip?: string;
  notes?: string;
  cartItems: CartItem[];
  subtotal: string;
  shipping: string;
  total_amount: string;
  payment_method: string;
}

export const sendOrderEmail = async (params: OrderEmailParams): Promise<{ success: boolean; error?: string }> => {
  const fullAddress = `${params.address}${params.landmark ? ` (Landmark: ${params.landmark})` : ''}, ${params.city}, ${params.state || 'Pakistan'}${params.zip ? ` ${params.zip}` : ''}`;
  const orderDateStr = new Date().toLocaleString('en-PK', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const cartItems = params.cartItems || [];
  const firstItem = cartItems[0];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Generate HTML table for order_items
  const orderItemsHtml = `
<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; margin: 12px 0;">
  <thead>
    <tr style="background-color: #f3f4f6; text-align: left; border-bottom: 2px solid #e5e7eb;">
      <th style="padding: 10px; border: 1px solid #e5e7eb;">Image</th>
      <th style="padding: 10px; border: 1px solid #e5e7eb;">Product Name</th>
      <th style="padding: 10px; border: 1px solid #e5e7eb;">Color</th>
      <th style="padding: 10px; border: 1px solid #e5e7eb;">Size</th>
      <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Qty</th>
      <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${cartItems.map((item) => {
      const discountedUnitPrice = getDiscountedPrice(item.product.price);
      const itemTotalPrice = discountedUnitPrice * item.quantity;
      const imageUrl = item.product.images[0] || '';
      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; vertical-align: middle;">
            ${imageUrl ? `<img src="${imageUrl}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; display: block; margin: 0 auto;" />` : 'N/A'}
          </td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; vertical-align: middle; font-weight: bold; color: #111827;">
            ${item.product.name}
            <div style="font-size: 11px; color: #6b7280; font-weight: normal; margin-top: 2px;">Category: ${item.product.category}</div>
          </td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; vertical-align: middle; color: #374151;">
            ${item.selectedColor || 'Standard'}
          </td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; vertical-align: middle; color: #374151;">
            ${item.selectedSize || 'Standard'}
          </td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; vertical-align: middle; text-align: center; font-weight: bold;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border: 1px solid #e5e7eb; vertical-align: middle; text-align: right; font-weight: bold; color: #111827;">
            Rs. ${itemTotalPrice.toLocaleString()}
          </td>
        </tr>
      `;
    }).join('')}
  </tbody>
</table>
`.trim();

  // Text summary fallback
  const orderDetailsText = cartItems
    .map(
      (item) =>
        `• ${item.product.name} (Qty: ${item.quantity}${
          item.selectedColor ? `, Color: ${item.selectedColor}` : ''
        }${item.selectedSize ? `, Size: ${item.selectedSize}` : ''}) - Rs. ${(getDiscountedPrice(item.product.price) * item.quantity).toLocaleString()}`
    )
    .join('\n');

  const messageContent = `
=== NEW ORDER RECEIVED #${params.order_id} ===

ORDER DATE: ${orderDateStr}

CUSTOMER DETAILS:
- Name: ${params.customer_name}
- Email: ${params.customer_email}
- Phone / WhatsApp: ${params.phone_number}

DELIVERY ADDRESS:
- Address: ${params.address}
- City: ${params.city}
- Special Notes: ${params.notes || 'None'}

ORDER ITEMS:
${orderDetailsText}

PAYMENT & TOTALS:
- Payment Method: ${params.payment_method}
- Subtotal: ${params.subtotal}
- Delivery Fee: ${params.shipping}
- Total Amount: ${params.total_amount}
`.trim();

  const templateParams = {
    // Exact requested variables:
    product_name: cartItems.map((i) => i.product.name).join(', ') || 'N/A',
    product_image: firstItem?.product.images[0] || '',
    category: cartItems.map((i) => i.product.category).filter((v, idx, a) => a.indexOf(v) === idx).join(', ') || 'Jewellery',
    color: cartItems.map((i) => i.selectedColor || 'Standard').join(', ') || 'Standard',
    size: cartItems.map((i) => i.selectedSize || 'Standard').join(', ') || 'Standard',
    quantity: totalQuantity > 0 ? totalQuantity.toString() : '1',
    price: firstItem ? `Rs. ${getDiscountedPrice(firstItem.product.price).toLocaleString()}` : params.subtotal,
    delivery_charges: params.shipping,
    total_amount: params.total_amount,
    payment_method: params.payment_method,
    customer_name: params.customer_name,
    phone: params.phone_number,
    email: params.customer_email,
    address: params.address,
    city: params.city,
    customer_note: params.notes || 'None',
    order_id: params.order_id,
    order_date: orderDateStr,
    order_items: orderItemsHtml,

    // Aliases for compatibility with other template key styles
    order_number: params.order_id,
    to_name: params.customer_name,
    to_email: params.customer_email,
    user_email: params.customer_email,
    reply_to: params.customer_email,
    company_email: 'Sparklezsiege@gmail.com',
    store_email: 'Sparklezsiege@gmail.com',
    customer_email: params.customer_email,
    customer_phone: params.phone_number,
    phone_number: params.phone_number,
    whatsapp: params.phone_number,
    shipping_address: fullAddress,
    full_address: fullAddress,
    state: params.state || 'Pakistan',
    zip: params.zip || '',
    notes: params.notes || 'None',
    delivery_instructions: params.notes || 'None',
    subtotal: params.subtotal,
    shipping: params.shipping,
    total: params.total_amount,
    items: orderDetailsText,
    order_details: orderDetailsText,
    message: messageContent,
  };

  try {
    const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('EmailJS email sent successfully:', res.status, res.text);
    return { success: true };
  } catch (sdkError: any) {
    console.warn('EmailJS SDK warning, attempting REST API fallback:', sdkError);
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: templateParams,
        }),
      });

      if (response.ok) {
        console.log('EmailJS email sent via REST API successfully');
        return { success: true };
      } else {
        const errText = await response.text();
        console.error('EmailJS REST API failed:', errText);
        return { success: false, error: errText };
      }
    } catch (restError: any) {
      console.error('EmailJS REST API error:', restError);
      return { success: false, error: restError?.message || 'Failed to send email' };
    }
  }
};
