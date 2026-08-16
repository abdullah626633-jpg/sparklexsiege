import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, PageType, Product } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Check,
  Zap
} from 'lucide-react';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  onRemoveItem: (productId: string, selectedSize?: string, selectedColor?: string) => void;
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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

  const handleProceedToCheckout = () => {
    if (onNavigate) onNavigate('checkout');
    navigate('/checkout');
  };

  // Recommendations for bottom
  const cartProductIds = cartItems.map((i) => i.product.id);
  const suggestedProducts = PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 4);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-xl mx-auto text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF9F61] block mb-1">
            Review Your Items
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-neutral-900">
            Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200 max-w-lg mx-auto p-8 shadow-xs">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#FF9F61] opacity-40" />
            <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6">
              Discover our signature necklaces, bangles, bridal sets, and rings with Cash on Delivery nationwide.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('shop');
                navigate('/shop');
              }}
              className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="hidden sm:grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-100 px-2">
                <span className="col-span-6">Product</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-3 text-right">Item Total</span>
              </div>

              {cartItems.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                    className="p-4 sm:p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 transition-all hover:bg-neutral-50"
                  >
                    {/* Item Details */}
                    <div className="sm:col-span-6 flex items-center space-x-3.5 w-full">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-white border border-neutral-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
                          {item.product.category.replace(/-/g, ' ')}
                          {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                        </p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-xs sm:text-sm font-bold text-neutral-800">
                            Rs. {item.product.price.toLocaleString()}
                          </span>
                          {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                            <span className="text-[11px] text-neutral-400 line-through">
                              Rs. {item.product.compareAtPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="sm:col-span-3 flex items-center justify-center space-x-3 w-full sm:w-auto">
                      <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1),
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="px-2.5 py-1 text-neutral-700 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="px-2.5 py-1 text-neutral-700 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-3 text-right w-full sm:w-auto flex justify-between sm:block">
                      <span className="sm:hidden text-xs text-neutral-500 font-medium">Subtotal:</span>
                      <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                        Rs. {itemTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
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

            {/* Order Summary & Primary CTA (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-neutral-50 rounded-3xl p-5 sm:p-7 border border-neutral-200 sticky top-24 shadow-sm">
                <h2 className="font-serif-luxury text-xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  Order Summary
                </h2>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="mb-4">
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Have a Promo Code?
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. SPARKLE10"
                        className="w-full pl-8 pr-2 py-2 bg-white border border-neutral-200 rounded-xl text-xs uppercase focus:outline-hidden focus:border-[#FF9F61]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs px-3.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        couponMessage.error ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </form>

                {/* Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-neutral-200/80 pt-3">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
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
                    <span className="text-2xl font-extrabold text-neutral-900">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* PROCEED TO CHECKOUT PRIMARY CTA */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full mt-5 bg-[#FF9F61] hover:bg-[#f08f4f] active:scale-[0.99] text-neutral-950 font-extrabold text-base py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>PROCEED TO CHECKOUT</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-neutral-200 space-y-2 text-[11px] text-neutral-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">💵</span>
                    <span className="font-medium">Cash on Delivery Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-medium">7-Day Easy Exchange Policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-medium">Fast Tracked Nationwide Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF9F61] block mb-1 text-center">
              Complete Your Jewellery Box
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {suggestedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => navigate(`/product/${prod.slug || prod.id}`)}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="aspect-square bg-neutral-50 overflow-hidden relative">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-xs sm:text-sm font-bold text-neutral-900 truncate">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 capitalize">{prod.category.replace(/-/g, ' ')}</p>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
