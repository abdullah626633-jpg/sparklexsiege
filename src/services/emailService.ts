import emailjs from '@emailjs/browser';

const env = (import.meta as any).env || {};
const SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || 'service_46etuf1';
const TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || 'template_pjga6tg';
const PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || 'X3-kO1QScsx1CWrh8';

export interface OrderEmailParams {
  order_id: string;
  customer_name: string;
  customer_email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  order_details: string;
  subtotal: string;
  shipping: string;
  total_amount: string;
  payment_method: string;
}

export const sendOrderEmail = async (params: OrderEmailParams): Promise<{ success: boolean; error?: string }> => {
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
    shipping_address: `${params.address}, ${params.city}, ${params.state} ${params.zip}`,
    address: params.address,
    city: params.city,
    state: params.state,
    zip: params.zip,
    order_details: params.order_details,
    items: params.order_details,
    subtotal: params.subtotal,
    shipping: params.shipping,
    total_amount: params.total_amount,
    total: params.total_amount,
    payment_method: params.payment_method,
    message: `New Order #${params.order_id} placed by ${params.customer_name} (${params.customer_email}).\nTotal Amount: ${params.total_amount}\nItems Ordered:\n${params.order_details}\nShipping Address:\n${params.address}, ${params.city}, ${params.state} ${params.zip}`
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
