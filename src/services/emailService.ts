import emailjs from '@emailjs/browser';
import { CartItem } from '../types';
import { getDiscountedPrice } from '../utils/price';

const env = (import.meta as any).env || {};

const EMAIL_CONFIGS = [
  {
    serviceId: env.VITE_EMAILJS_SERVICE_ID || 'service_46etuf1',
    templateId: env.VITE_EMAILJS_TEMPLATE_ID || 'template_pjga6tg',
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY || 'X3-kO1QScsx1CWrh8',
  },
  {
    serviceId: env.VITE_EMAILJS_SERVICE_ID_2 || 'service_8p2pqx9',
    templateId: env.VITE_EMAILJS_TEMPLATE_ID_2 || 'template_o90g9wb',
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY_2 || 'X3-kO1QScsx1CWrh8',
  },
];

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

const sendToSingleEmailJS = async (
  serviceId: string,
  templateId: string,
  publicKey: string,
  templateParams: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log(`EmailJS [${serviceId} / ${templateId}] sent successfully:`, res.status, res.text);
    return { success: true };
  } catch (sdkError: any) {
    console.warn(`EmailJS [${serviceId} / ${templateId}] SDK warning, attempting REST API fallback:`, sdkError);
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (response.ok) {
        console.log(`EmailJS [${serviceId} / ${templateId}] REST API sent successfully`);
        return { success: true };
      } else {
        const errText = await response.text();
        console.error(`EmailJS [${serviceId} / ${templateId}] REST API failed:`, errText);
        return { success: false, error: errText };
      }
    } catch (restError: any) {
      console.error(`EmailJS [${serviceId} / ${templateId}] REST API error:`, restError);
      return { success: false, error: restError?.message || 'Failed to send email' };
    }
  }
};

export const sendOrderEmail = async (params: OrderEmailParams): Promise<{ success: boolean; error?: string }> => {
  const fullAddress = `${params.address}${params.landmark ? ` (Landmark: ${params.landmark})` : ''}, ${params.city}, ${params.state || 'Pakistan'}${params.zip ? ` ${params.zip}` : ''}`;
  const orderDateStr = new Date().toLocaleString('en-PK', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const cartItems = params.cartItems || [];
  const firstItem = cartItems[0];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Clean Plain-Text Order Items List
  const orderItemsPlainText = cartItems
    .map((item, index) => {
      const discountedPrice = getDiscountedPrice(item.product.price);
      const itemTotal = discountedPrice * item.quantity;
      const imageUrl = item.product.images[0] || '';
      return `${index + 1}. ${item.product.name}
   - Category: ${item.product.category}
   - Color: ${item.selectedColor || 'Standard'} | Size: ${item.selectedSize || 'Standard'}
   - Qty: ${item.quantity} x Rs. ${discountedPrice.toLocaleString()} = Rs. ${itemTotal.toLocaleString()}
   ${imageUrl ? `- Image: ${imageUrl}` : ''}`;
    })
    .join('\n\n');

  // 2. HTML Table string
  const orderItemsHtml = `
<table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:13px; margin:10px 0;">
  <thead>
    <tr style="background-color:#f3f4f6; text-align:left; border-bottom:2px solid #e5e7eb;">
      <th style="padding:8px; border:1px solid #e5e7eb;">Image</th>
      <th style="padding:8px; border:1px solid #e5e7eb;">Product</th>
      <th style="padding:8px; border:1px solid #e5e7eb;">Color / Size</th>
      <th style="padding:8px; border:1px solid #e5e7eb; text-align:center;">Qty</th>
      <th style="padding:8px; border:1px solid #e5e7eb; text-align:right;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${cartItems
      .map((item) => {
        const discountedPrice = getDiscountedPrice(item.product.price);
        const itemTotal = discountedPrice * item.quantity;
        const imageUrl = item.product.images[0] || '';
        return `
        <tr>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:center;">
            ${imageUrl ? `<img src="${imageUrl}" alt="${item.product.name}" style="width:48px; height:48px; object-fit:cover; border-radius:4px;" />` : 'N/A'}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold; color:#111827;">
            ${item.product.name}
            <div style="font-size:11px; color:#6b7280; font-weight:normal;">${item.product.category}</div>
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; color:#374151;">
            Color: ${item.selectedColor || 'Standard'}<br/>Size: ${item.selectedSize || 'Standard'}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:center; font-weight:bold;">
            ${item.quantity}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:right; font-weight:bold; color:#111827;">
            Rs. ${itemTotal.toLocaleString()}
          </td>
        </tr>`;
      })
      .join('')}
  </tbody>
</table>`.trim();

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
${orderItemsPlainText}

PAYMENT & TOTALS:
- Payment Method: ${params.payment_method}
- Subtotal: ${params.subtotal}
- Delivery Fee: ${params.shipping}
- Total Amount: ${params.total_amount}
`.trim();

  const templateParams = {
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

    order_items: orderItemsPlainText,
    order_details: orderItemsPlainText,
    items: orderItemsPlainText,

    order_items_html: orderItemsHtml,
    order_details_html: orderItemsHtml,

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
    message: messageContent,
  };

  // Dispatch to both EmailJS targets simultaneously
  const results = await Promise.allSettled(
    EMAIL_CONFIGS.map((cfg) =>
      sendToSingleEmailJS(cfg.serviceId, cfg.templateId, cfg.publicKey, templateParams)
    )
  );

  const successes = results.filter(
    (res) => res.status === 'fulfilled' && res.value.success
  );

  if (successes.length > 0) {
    console.log(`Order email sent successfully to ${successes.length} EmailJS target(s).`);
    return { success: true };
  } else {
    const lastError = results.find(
      (res) => res.status === 'fulfilled' && !res.value.success
    ) as PromiseFulfilledResult<{ success: boolean; error?: string }> | undefined;

    return {
      success: false,
      error: lastError?.value?.error || 'Failed to dispatch email to EmailJS services.',
    };
  }
};
