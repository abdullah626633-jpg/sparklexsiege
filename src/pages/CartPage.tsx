import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, PageType } from '../types';
import { Trash2, ArrowLeft, ArrowRight, Tag, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { getDiscountedPrice } from '../utils/price';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string) => void;
  onNavigate?: (page: PageType) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);

  const originalSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getDiscountedPrice(item.product.price) * item.quantity,
    0
  );

  const azadiSavings = originalSubtotal - subtotal;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal === 0 ? 0 : 250;
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SPARKLE10') {
      setDiscountPercent(10);
      setCouponMessage({ text: 'Coupon SPARKLE10 applied! 10% off', error: false });
    } else if (couponCode.trim().toUpperCase() === 'VIP20') {
      setDiscountPercent(20);
      setCouponMessage({ text: 'VIP Coupon VIP20 applied! 20% off', error: false });
    } else {
      setCouponMessage({ text: 'Invalid coupon code. Try SPARKLE10 for 10% off.', error: true });
    }
  };

  const setCouponMessageWithReset = (msg: { text: string; error: boolean }) => {
    setCouponMessage(msg);
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-1">
            Shopping Bag
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900">
            Your Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100 max-w-xl mx-auto p-8">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#FF9F61] opacity-40" />
            <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-2">
              Your Shopping Bag is empty
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Explore our fine jewellery collection and add timeless gold and diamond pieces.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('shop');
                navigate('/shop');
              }}
              className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-semibold text-sm py-3 px-8 rounded-full transition-colors cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="hidden sm:grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-neutral-400 pb-3 border-b border-neutral-100 px-2">
                <span className="col-span-6">Product</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-3 text-right">Total</span>
              </div>

              {cartItems.map((item) => {
                const discountedUnitPrice = getDiscountedPrice(item.product.price);
                const itemTotal = discountedUnitPrice * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="p-4 sm:p-5 bg-neutral-50/60 rounded-2xl border border-neutral-100 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 transition-all hover:bg-neutral-50"
                  >
                    {/* Item Details */}
                    <div className="sm:col-span-6 flex items-center space-x-4 w-full">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl bg-white border border-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif-luxury text-base font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 capitalize mt-0.5">
                          {item.product.category} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                        </p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-sm font-bold text-neutral-800">
                            Rs. {discountedUnitPrice.toLocaleString()}
                          </span>
                          <span className="text-xs text-neutral-400 line-through">
                            Rs. {item.product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-white bg-[#01411C] px-1.5 py-0.5 rounded-xs">
                            14% OFF
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="sm:col-span-3 flex items-center justify-center space-x-3 w-full sm:w-auto">
                      <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1),
                              item.selectedSize
                            )
                          }
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize
                            )
                          }
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-3 text-right w-full sm:w-auto flex justify-between sm:block">
                      <span className="sm:hidden text-xs text-neutral-500 font-medium">Subtotal:</span>
                      <span className="text-base font-bold text-neutral-900">
                        Rs. {itemTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('shop');
                    navigate('/shop');
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-neutral-700 hover:text-[#FF9F61] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-100 sticky top-28">
                <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-6">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="mb-6">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Have a promo code?
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. SPARKLE10"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs uppercase focus:outline-hidden focus:border-[#FF9F61]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-semibold text-xs px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-xs mt-2 font-medium ${
                        couponMessage.error ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </form>

                {/* Breakdown */}
                <div className="space-y-3 text-xs border-t border-neutral-200/60 pt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Original Price</span>
                    <span className="font-medium text-neutral-400 line-through">Rs. {originalSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-[#01411C] font-bold bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/60">
                    <span className="flex items-center space-x-1">
                      <span>🇵🇰</span>
                      <span>Azadi Sale Savings (14% OFF)</span>
                    </span>
                    <span>-Rs. {azadiSavings.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Discounted Subtotal</span>
                    <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Charges (Pakistan)</span>
                    <span className="font-semibold text-neutral-900">
                      {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-neutral-900">Total</span>
                    <span className="text-2xl font-bold text-neutral-900">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('checkout');
                    navigate('/checkout');
                  }}
                  className="w-full mt-6 bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-base py-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Insured Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
