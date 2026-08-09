declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackViewContent = (product: { id: string; name: string; price: number; category?: string }) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category || 'Jewellery',
      value: product.price,
      currency: 'PKR',
    });
  }
};

export const trackAddToCart = (product: { id: string; name: string; price: number }, quantity: number = 1) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price * quantity,
      currency: 'PKR',
    });
  }
};

export const trackInitiateCheckout = (totalValue: number, numItems: number) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: totalValue,
      currency: 'PKR',
      num_items: numItems,
    });
  }
};

export const trackPurchase = (orderId: string, totalValue: number, currency = 'PKR') => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_type: 'product',
      value: totalValue,
      currency: currency,
      order_id: orderId,
    });
  }
};
