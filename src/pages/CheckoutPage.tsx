import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, PageType } from '../types';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  MailCheck, 
  Phone, 
  MapPin, 
  User, 
  Mail, 
  Truck, 
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { sendOrderEmail } from '../services/emailService';
import { getDiscountedPrice } from '../utils/price';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onNavigate?: (page: PageType) => void;
}

const COMMON_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Jhelum',
  'Gujrat',
  'Other City',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  onClearCart,
  onNavigate,
}) => {
  const navigate = useNavigate();

  // Success screen state
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(true);

  // Simple customer form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [notes, setNotes] = useState('');

  // Simple validation error strings
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const originalSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getDiscountedPrice(item.product.price) * item.quantity,
    0
  );

  const azadiSavings = originalSubtotal - subtotal;
  const shipping = subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic quick validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid phone/WhatsApp number (e.g. 03001234567).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your delivery street address.');
      return;
    }
    if (city === 'Other City' && !customCity.trim()) {
      setErrorMsg('Please type your city name.');
      return;
    }

    setIsSubmitting(true);
    const orderNum = `SKS-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCity = city === 'Other City' ? customCity.trim() : city;

    const itemSummary = cartItems
      .map(
        (item) =>
          `• ${item.product.name} (Qty: ${item.quantity}${
            item.selectedSize ? `, Size: ${item.selectedSize}` : ''
          }${item.selectedColor ? `, Color: ${item.selectedColor}` : ''}) - Rs. ${(getDiscountedPrice(item.product.price) * item.quantity).toLocaleString()}`
      )
      .join('\n');

    const paymentLabel = 'Cash on Delivery (COD)';

    const emailRes = await sendOrderEmail({
      order_id: orderNum,
      customer_name: fullName.trim(),
      customer_email: email.trim(),
      phone_number: phone.trim(),
      address: address.trim(),
      city: finalCity,
      state: 'Pakistan',
      notes: notes.trim() || undefined,
      cartItems: cartItems,
      subtotal: `Rs. ${subtotal.toLocaleString()}`,
      shipping: shipping === 0 ? 'FREE' : `Rs. ${shipping}`,
      total_amount: `Rs. ${total.toLocaleString()}`,
      payment_method: paymentLabel,
    });

    setConfirmedTotal(total);
    setEmailSentSuccess(emailRes.success);
    setPlacedOrder(orderNum);
    setIsSubmitting(false);
    onClearCart();
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    const finalCity = city === 'Other City' ? customCity : city;

    return (
      <div className="bg-neutral-50 min-h-screen py-10 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9F61]">
              Order Placed Successfully
            </span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Thank You, {fullName}!
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Order #{placedOrder} has been recorded.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left text-xs space-y-1.5 text-emerald-900">
            <p className="font-bold">What happens next?</p>
            <p>Our rider will call or message you on <strong>{phone}</strong> before delivering your parcel in <strong>{finalCity}</strong>.</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span className="text-neutral-500">Order Total:</span>
              <span className="font-bold text-[#FF9F61] text-sm">Rs. {confirmedTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment:</span>
              <span className="font-semibold text-neutral-900">
                Cash on Delivery (COD)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Address:</span>
              <span className="font-semibold text-neutral-900 text-right max-w-[200px] truncate">
                {address}, {finalCity}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/923000000000?text=Hi!%20I%20placed%20Order%20%23${placedOrder}%20for%20${encodeURIComponent(fullName)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Track / Ask Question on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('shop');
                navigate('/shop');
              }}
              className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SIMPLE CHECKOUT FORM VIEW
  return (
    <div className="bg-neutral-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Link */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate('cart');
            navigate('/cart');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 hover:text-[#FF9F61] mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Simple Checkout
        </h1>
        <p className="text-xs text-neutral-500 mb-6">
          Enter your delivery information below to complete your order instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Form Column */}
          <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full py-2.5 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white"
                  />
                </div>
              </div>

              {/* 2. Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full py-2.5 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* 3. Email */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full py-2.5 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white"
                  />
                </div>
              </div>

              {/* 4. Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #, Street #, Sector / Area"
                    className="w-full py-2.5 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white"
                  />
                </div>
              </div>

              {/* 5. City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white cursor-pointer"
                  >
                    {COMMON_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {city === 'Other City' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      City Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Type city name"
                      className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Special Note for Courier (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before coming"
                  className="w-full py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#FF9F61] focus:bg-white"
                />
              </div>

              {/* Payment Method - Cash on Delivery Only */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Payment Method
                </label>

                <div className="p-3.5 bg-neutral-900 text-white rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Truck className="w-4 h-4 text-[#FF9F61]" />
                    <span className="text-xs font-bold">Cash on Delivery (COD)</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Pay at Doorstep
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <span>Place Order • Rs. {total.toLocaleString()}</span>
                )}
              </button>

            </form>
          </div>

          {/* Side Summary Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-4">
              <h2 className="font-serif-luxury font-bold text-neutral-900 text-base border-b border-neutral-100 pb-2">
                Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const price = getDiscountedPrice(item.product.price) * item.quantity;
                  return (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center space-x-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-neutral-900 truncate">{item.product.name}</p>
                        <p className="text-neutral-500 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-neutral-900 shrink-0">
                        Rs. {price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 p-1.5 rounded-lg text-[11px]">
                  <span>14% Azadi Discount Applied</span>
                  <span>-Rs. {azadiSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery Charge:</span>
                  <span>Rs. {shipping}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 text-sm border-t border-neutral-100 pt-2">
                  <span>Total Payable:</span>
                  <span className="text-[#FF9F61]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Guaranteed Delivery</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                You will receive an instant email receipt & order details upon submitting.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
