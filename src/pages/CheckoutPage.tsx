import React, { useState } from 'react';
import { CartItem, PageType } from '../types';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft, Loader2, MailCheck, Banknote, Truck } from 'lucide-react';
import { sendOrderEmail } from '../services/emailService';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onNavigate: (page: PageType) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onClearCart,
  onNavigate,
}) => {
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'sent' | 'failed' | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    const orderNum = `SKS-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderTotal = total;

    const itemSummary = cartItems
      .map(
        (item) =>
          `• ${item.product.name} (Qty: ${item.quantity}${
            item.selectedSize ? `, Size: ${item.selectedSize}` : ''
          }) - Rs. ${(item.product.price * item.quantity).toLocaleString()}`
      )
      .join('\n');

    const emailResult = await sendOrderEmail({
      order_id: orderNum,
      customer_name: `${firstName} ${lastName}`.trim(),
      customer_email: email,
      address,
      city,
      state,
      zip,
      order_details: itemSummary,
      subtotal: `Rs. ${subtotal.toLocaleString()}`,
      shipping: shipping === 0 ? 'FREE' : `Rs. ${shipping}`,
      total_amount: `Rs. ${orderTotal.toLocaleString()}`,
      payment_method: 'Cash on Delivery (COD)',
    });

    setConfirmedTotal(orderTotal);
    setEmailStatus(emailResult.success ? 'sent' : 'failed');
    setPlacedOrder(orderNum);
    setIsSubmitting(false);
    onClearCart();
  };

  if (placedOrder) {
    return (
      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-neutral-50 rounded-3xl p-8 border border-neutral-100 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block">
            Thank You For Your Order
          </span>

          <h1 className="font-serif-luxury text-3xl font-bold text-neutral-900">
            Order Confirmed!
          </h1>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Your Cash on Delivery order <span className="font-bold text-neutral-900">{placedOrder}</span> has been successfully placed.
          </p>

          {emailStatus === 'sent' ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-center space-x-2">
              <MailCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Order details sent via email notification to <strong>{email}</strong>!</span>
            </div>
          ) : (
            <div className="p-3 bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-2xl text-xs">
              Order confirmation recorded for <strong>{email}</strong>.
            </div>
          )}

          <div className="p-4 bg-white rounded-2xl border border-neutral-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping To:</span>
              <span className="font-medium text-neutral-800">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Address:</span>
              <span className="font-medium text-neutral-800">{address}, {city}, {state} {zip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Method:</span>
              <span className="font-bold text-emerald-700">Cash on Delivery (COD)</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>Amount Payable on Delivery:</span>
              <span>Rs. {confirmedTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-sm py-3.5 rounded-2xl transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('cart')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-neutral-600 hover:text-[#FF9F61] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-4">
                  1. Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address (for order tracking & confirmation)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@gmail.com"
                      className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-4">
                  2. Delivery Address in Pakistan
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Street Address / House No. / Area
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House #, Street, Block or Sector"
                      className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lahore, Karachi, Islamabad"
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Province / State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Punjab, Sindh, KPK"
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="e.g. 54000"
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method - COD Only */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-4">
                  3. Payment Method
                </h2>

                <div className="p-5 bg-gradient-to-r from-[#002D2F] to-[#003B3E] rounded-2xl text-white border border-[#FF9F61]/30 shadow-md space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF9F61] text-neutral-950 flex items-center justify-center font-bold shrink-0">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                        <span>Cash on Delivery (COD)</span>
                        <span className="bg-[#FF9F61]/20 text-[#FF9F61] border border-[#FF9F61]/40 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                          Only Method Offered
                        </span>
                      </h3>
                      <p className="text-xs text-emerald-100/80 mt-0.5">
                        Pay in cash to the rider when your package is delivered anywhere in Pakistan.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/60 text-[11px] text-emerald-200/90 flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#FF9F61] shrink-0" />
                    <span>No upfront online payment required. Pay Rs. {total.toLocaleString()} upon receipt.</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-base py-4 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
                    <span>Processing Order & Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Place Cash on Delivery Order (Rs. {total.toLocaleString()})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-100 sticky top-28">
              <h2 className="font-serif-luxury text-xl font-bold text-neutral-900 mb-4">
                In Your Order
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex items-center space-x-3 text-xs py-2 border-b border-neutral-200/50 last:border-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-white border border-neutral-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{item.product.name}</p>
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-neutral-900">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charges (Pakistan)</span>
                  <span className="font-semibold text-neutral-900">
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline font-bold text-neutral-900">
                  <span className="text-sm">Total Due</span>
                  <span className="text-2xl">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
