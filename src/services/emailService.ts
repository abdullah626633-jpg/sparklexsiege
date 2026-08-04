import emailjs from '@emailjs/browser';

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
  state: string;
  zip?: string;
  notes?: string;
  order_details: string;
  subtotal: string;
  shipping: string;
  total_amount: string;
  payment_method: string;
}

export const sendOrderEmail = async (params: OrderEmailParams): Promise<{ success: boolean; error?: string }> => {
  const fullAddress = `${params.address}${params.landmark ? ` (Landmark: ${params.landmark})` : ''}, ${params.city}, ${params.state}${params.zip ? ` ${params.zip}` : ''}`;

  const messageContent = `
=== NEW ORDER RECEIVED #${params.order_id} ===

CUSTOMER DETAILS:
- Name: ${params.customer_name}
- Email: ${params.customer_email}
- Phone / WhatsApp: ${params.phone_number}
${params.alt_phone_number ? `- Alternate Phone: ${params.alt_phone_number}\n` : ''}

DELIVERY ADDRESS:
- Address: ${params.address}
${params.landmark ? `- Landmark: ${params.landmark}\n` : ''}- City: ${params.city}
- Province/State: ${params.state}
${params.zip ? `- Postal Code: ${params.zip}\n` : ''}${params.notes ? `- Special Instructions: ${params.notes}\n` : ''}

ORDER SUMMARY:
${params.order_details}

PAYMENT & TOTALS:
- Payment Method: ${params.payment_method}
- Subtotal: ${params.subtotal}
- Delivery Fee: ${params.shipping}
- Total Amount: ${params.total_amount}
`.trim();

  const templateParams = {
    order_id: params.order_id,
    order_number: params.order_id,
    to_name: params.customer_name,
    to_email: params.customer_email,
    customer_name: params.customer_name,
    customer_email: params.customer_email,
    company_email: 'Sparklezsiege@gmail.com',
    store_email: 'Sparklezsiege@gmail.com',
    user_email: params.customer_email,
    reply_to: params.customer_email,
    
    // Phone numbers
    phone_number: params.phone_number,
    customer_phone: params.phone_number,
    phone: params.phone_number,
    whatsapp: params.phone_number,
    alt_phone_number: params.alt_phone_number || 'N/A',
    
    // Address fields
    shipping_address: fullAddress,
    full_address: fullAddress,
    address: params.address,
    landmark: params.landmark || '',
    city: params.city,
    state: params.state,
    zip: params.zip || '',
    notes: params.notes || 'None',
    delivery_instructions: params.notes || 'None',
    
    // Order details & pricing
    order_details: params.order_details,
    items: params.order_details,
    subtotal: params.subtotal,
    shipping: params.shipping,
    total_amount: params.total_amount,
    total: params.total_amount,
    payment_method: params.payment_method,
    
    // Full composite message
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
