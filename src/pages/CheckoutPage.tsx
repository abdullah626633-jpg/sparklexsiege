import React, { useState } from 'react';
import { CartItem, PageType } from '../types';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, Sparkles, ArrowLeft } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'klarna'>('card');

  // Form Fields
  const [email, setEmail] = useState('victoria.siege@sparklezsiege.com');
  const [firstName, setFirstName] = useState('Victoria');
  const [lastName, setLastName] = useState('Siege');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Beverly Hills');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('90210');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [exp, setExp] = useState('12/28');
  const [cvv, setCvv] = useState('888');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 250 || subtotal === 0 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `SKS-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrder(orderNum);
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
            Your order <span className="font-bold text-neutral-900">{placedOrder}</span> has been successfully placed. A confirmation email with live courier tracking details has been sent to <span className="font-semibold">{email}</span>.
          </p>

          <div className="p-4 bg-white rounded-2xl border border-neutral-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping To:</span>
              <span className="font-medium text-neutral-800">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Address:</span>
              <span className="font-medium text-neutral-800">{address}, {city}, {state} {zip}</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100">
              <span>Total Paid:</span>
              <span>${total.toLocaleString()}</span>
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
                      Email Address (for order tracking)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-4">
                  2. Shipping Address
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
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full py-2.5 px-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-[#FF9F61]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-4">
                  3. Payment Method
                </h2>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'border-[#FF9F61] bg-[#FF9F61]/10 text-[#FF9F61]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'apple'
                        ? 'border-[#FF9F61] bg-[#FF9F61]/10 text-[#FF9F61]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('klarna')}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      paymentMethod === 'klarna'
                        ? 'border-[#FF9F61] bg-[#FF9F61]/10 text-[#FF9F61]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Klarna 4x</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={exp}
                          onChange={(e) => setExp(e.target.value)}
                          className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          CVV Code
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-base py-4 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Lock className="w-5 h-5" />
                <span>Place Order (${total.toLocaleString()})</span>
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
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Insured Express Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Sales Tax (8%)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline font-bold text-neutral-900">
                  <span className="text-sm">Total Due</span>
                  <span className="text-2xl">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
