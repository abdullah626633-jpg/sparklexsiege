import emailjs from '@emailjs/browser';
import { CartItem } from '../types';

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
  {
    serviceId: env.VITE_EMAILJS_SERVICE_ID_3 || 'service_8p2pqx9',
    templateId: env.VITE_EMAILJS_TEMPLATE_ID_3 || 'template_8ukbrgc',
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY_3 || 'X3-kO1QScsx1CWrh8',
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
  discount?: string;
  discount_code?: string;
  shipping: string;
  total_amount: string;
  payment_method: string;
}

/**
 * Converts local or relative image paths (e.g. '/IMG_4185.png') into
 * full absolute public URLs (e.g. 'https://domain.com/IMG_4185.png')
 * so email clients like Gmail & Outlook render the actual product image.
 */
const getFullImageUrl = (imgPath?: string): string => {
  if (!imgPath) return '';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : (env.APP_URL || '');
  const cleanOrigin = origin.replace(/\/$/, '');
  const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
  return cleanOrigin ? `${cleanOrigin}${cleanPath}` : cleanPath;
};

const sendToSingleEmailJS = async (
  serviceId: string,
  templateId: string,
  publicKey: string,
  templateParams: Record<string, any>
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Register public key with EmailJS SDK v4
    emailjs.init({ publicKey });

    const res = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey: publicKey,
    });
    console.log(`✅ EmailJS [${serviceId} / ${templateId}] sent successfully:`, res.status, res.text);
    return { success: true };
  } catch (sdkError: any) {
    const sdkErrText = typeof sdkError === 'object' && sdkError !== null
      ? (sdkError.text || sdkError.message || JSON.stringify(sdkError))
      : String(sdkError);
    console.warn(`⚠️ EmailJS [${serviceId} / ${templateId}] SDK error:`, sdkErrText, '- Attempting REST API fallback...');

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
        console.log(`✅ EmailJS [${serviceId} / ${templateId}] REST API sent successfully`);
        return { success: true };
      } else {
        const errText = await response.text();
        console.error(`❌ EmailJS [${serviceId} / ${templateId}] REST API failed (${response.status}):`, errText);
        return { success: false, error: `SDK: ${sdkErrText} | REST (${response.status}): ${errText}` };
      }
    } catch (restError: any) {
      console.error(`❌ EmailJS [${serviceId} / ${templateId}] REST API exception:`, restError);
      return { success: false, error: `SDK: ${sdkErrText} | REST: ${restError?.message || 'Failed'}` };
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

  const firstItemFullImageUrl = getFullImageUrl(firstItem?.product.images[0]);

  // 1. Clean Plain-Text Order Items List with absolute public image URLs
  const orderItemsPlainText = cartItems
    .map((item, index) => {
      const unitPrice = item.product.price;
      const itemTotal = unitPrice * item.quantity;
      const fullImgUrl = getFullImageUrl(item.product.images[0]);
      return `${index + 1}. ${item.product.name}
   - Category: ${item.product.category}
   - Color: ${item.selectedColor || 'Standard'} | Size: ${item.selectedSize || 'Standard'}
   - Qty: ${item.quantity} x Rs. ${unitPrice.toLocaleString()} = Rs. ${itemTotal.toLocaleString()}
   ${fullImgUrl ? `- Product Image: ${fullImgUrl}` : ''}`;
    })
    .join('\n\n');

  // 2. HTML Table string with absolute public image URLs in <img src="..." />
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
        const unitPrice = item.product.price;
        const itemTotal = unitPrice * item.quantity;
        const fullImgUrl = getFullImageUrl(item.product.images[0]);
        return `
        <tr>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:center; vertical-align:middle;">
            ${fullImgUrl ? `<img src="${fullImgUrl}" alt="${item.product.name}" width="50" height="50" style="width:50px; height:50px; object-fit:cover; border-radius:4px; display:block; margin:0 auto;" />` : 'N/A'}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; font-weight:bold; color:#111827; vertical-align:middle;">
            ${item.product.name}
            <div style="font-size:11px; color:#6b7280; font-weight:normal;">${item.product.category}</div>
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; color:#374151; vertical-align:middle;">
            Color: ${item.selectedColor || 'Standard'}<br/>Size: ${item.selectedSize || 'Standard'}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:center; font-weight:bold; vertical-align:middle;">
            ${item.quantity}
          </td>
          <td style="padding:8px; border:1px solid #e5e7eb; text-align:right; font-weight:bold; color:#111827; vertical-align:middle;">
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
- Subtotal: ${params.subtotal}${params.discount ? `\n- Discount (${params.discount_code || 'Promo'}): -${params.discount}` : ''}
- Delivery Fee: ${params.shipping}
- Total Amount: ${params.total_amount}
`.trim();

  const templateParams = {
    // 1. Recipient & customer email variations
    email: params.customer_email,
    to_email: params.customer_email,
    user_email: params.customer_email,
    customer_email: params.customer_email,
    recipient_email: params.customer_email,
    to: params.customer_email,
    reply_to: params.customer_email,

    // 2. Store Owner / Merchant destination email variations
    company_email: 'Sparklezsiege@gmail.com',
    store_email: 'Sparklezsiege@gmail.com',
    admin_email: 'Sparklezsiege@gmail.com',
    owner_email: 'Sparklezsiege@gmail.com',
    merchant_email: 'Sparklezsiege@gmail.com',
    to_store_email: 'Sparklezsiege@gmail.com',

    // 3. Name variations
    to_name: params.customer_name,
    customer_name: params.customer_name,
    from_name: params.customer_name,
    name: params.customer_name,
    user_name: params.customer_name,

    // 4. Contact & Phone
    phone: params.phone_number,
    phone_number: params.phone_number,
    customer_phone: params.phone_number,
    whatsapp: params.phone_number,

    // 5. Delivery Address & City
    address: params.address,
    shipping_address: fullAddress,
    full_address: fullAddress,
    city: params.city,
    state: params.state || 'Pakistan',
    zip: params.zip || '',
    notes: params.notes || 'None',
    customer_note: params.notes || 'None',
    delivery_instructions: params.notes || 'None',

    // 6. Order Identifiers & Dates
    order_id: params.order_id,
    order_number: params.order_id,
    order_date: orderDateStr,
    date: orderDateStr,

    // 7. Pricing & Totals
    subtotal: params.subtotal,
    discount: params.discount || 'Rs. 0',
    discount_code: params.discount_code || '',
    discount_amount: params.discount || 'Rs. 0',
    coupon_code: params.discount_code || '',
    shipping: params.shipping,
    delivery_charges: params.shipping,
    total: params.total_amount,
    total_amount: params.total_amount,
    price: firstItem ? `Rs. ${firstItem.product.price.toLocaleString()}` : params.subtotal,
    payment_method: params.payment_method,

    // 8. Product details (single & list)
    product_name: cartItems.map((i) => i.product.name).join(', ') || 'N/A',
    product_image: firstItemFullImageUrl,
    product_image_url: firstItemFullImageUrl,
    product_image_src: firstItemFullImageUrl,
    product_image_tag: firstItemFullImageUrl ? `<img src="${firstItemFullImageUrl}" alt="${firstItem?.product.name || 'Product'}" width="150" style="max-width:150px; height:auto; border-radius:6px; display:block;" />` : '',
    category: cartItems.map((i) => i.product.category).filter((v, idx, a) => a.indexOf(v) === idx).join(', ') || 'Jewellery',
    color: cartItems.map((i) => i.selectedColor || 'Standard').join(', ') || 'Standard',
    size: cartItems.map((i) => i.selectedSize || 'Standard').join(', ') || 'Standard',
    quantity: totalQuantity > 0 ? totalQuantity.toString() : '1',

    // 9. Order summary lists (Plain text & HTML)
    order_items: orderItemsPlainText,
    order_details: orderItemsPlainText,
    items: orderItemsPlainText,
    message: messageContent,

    order_items_html: orderItemsHtml,
    order_details_html: orderItemsHtml,
    items_html: orderItemsHtml,
  };

  console.log('Sending order email via EmailJS with params:', templateParams);

  // Dispatch to all EmailJS targets
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
    const errorDetails = results
      .map((res, idx) => {
        if (res.status === 'fulfilled' && !res.value.success) {
          return `Target ${idx + 1} [${EMAIL_CONFIGS[idx].serviceId} / ${EMAIL_CONFIGS[idx].templateId}]: ${res.value.error}`;
        } else if (res.status === 'rejected') {
          return `Target ${idx + 1} Rejected: ${res.reason}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(' | ');

    console.error('All EmailJS targets failed:', errorDetails);

    return {
      success: false,
      error: errorDetails || 'Failed to dispatch email to EmailJS services.',
    };
  }
};
