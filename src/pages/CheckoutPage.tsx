import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, PageType } from '../types';
import { validateDiscountCode, DiscountCode } from '../data/discountCodes';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Phone, 
  MapPin, 
  User, 
  Mail, 
  Truck, 
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Lock,
  RotateCcw,
  Check,
  Copy,
  Tag,
  GraduationCap,
  X
} from 'lucide-react';
import { sendOrderEmail } from '../services/emailService';
import { trackInitiateCheckout, trackPurchase } from '../utils/metaPixel';

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
  const [confirmedDiscountAmount, setConfirmedDiscountAmount] = useState<number>(0);
  const [confirmedDiscountCode, setConfirmedDiscountCode] = useState<string | null>(null);
  const [confirmedIsCieStudent, setConfirmedIsCieStudent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(true);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cod'>('bank_transfer');
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState<'bank_transfer' | 'cod'>('bank_transfer');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Discount code state
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountMessage, setDiscountMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Restore coupon from session if set in Cart
  useEffect(() => {
    try {
      const savedCode = sessionStorage.getItem('sparklez_discount_code');
      if (savedCode) {
        const result = validateDiscountCode(savedCode);
        if (result.valid && result.discount) {
          setAppliedDiscount(result.discount);
          setDiscountInput(result.discount.code);
          setDiscountMessage({ text: result.message, error: false });
        }
      }
    } catch {}
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Validation error strings
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountPercent = appliedDiscount ? appliedDiscount.percentage : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // FREE Delivery on Bank Transfer, Rs. 250 on Cash on Delivery
  const shipping = subtotal === 0 ? 0 : paymentMethod === 'bank_transfer' ? 0 : 250;
  const total = discountedSubtotal + shipping;

  React.useEffect(() => {
    if (cartItems.length > 0) {
      trackInitiateCheckout(total, cartItems.length);
    }
  }, []);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDiscountCode(discountInput);
    if (result.valid && result.discount) {
      setAppliedDiscount(result.discount);
      setDiscountMessage({ text: result.message, error: false });
      try {
        sessionStorage.setItem('sparklez_discount_code', result.discount.code);
      } catch {}
    } else {
      setAppliedDiscount(null);
      setDiscountMessage({ text: result.message, error: true });
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountInput('');
    setDiscountMessage(null);
    try {
      sessionStorage.removeItem('sparklez_discount_code');
    } catch {}
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frictionless Validation (Email is optional)
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid phone or WhatsApp number (e.g. 03001234567).');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your complete delivery street address.');
      return;
    }
    if (city === 'Other City' && !customCity.trim()) {
      setErrorMsg('Please enter your city name.');
      return;
    }

    setIsSubmitting(true);
    const orderNum = `SKS-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCity = city === 'Other City' ? customCity.trim() : city;
    const finalEmail = email.trim() || 'orders@sparkleziege.shop';
    const paymentMethodLabel =
      paymentMethod === 'bank_transfer'
        ? 'Bank Transfer (GET FREE DELIVERY)'
        : 'Cash on Delivery (COD)';

    const emailRes = await sendOrderEmail({
      order_id: orderNum,
      customer_name: fullName.trim(),
      customer_email: finalEmail,
      phone_number: phone.trim(),
      address: address.trim(),
      city: finalCity,
      state: 'Pakistan',
      notes: notes.trim() || undefined,
      cartItems: cartItems,
      subtotal: `Rs. ${subtotal.toLocaleString()}`,
      discount: discountAmount > 0 ? `Rs. ${discountAmount.toLocaleString()} (${appliedDiscount?.code} • ${discountPercent}% OFF)` : undefined,
      discount_code: appliedDiscount ? appliedDiscount.code : undefined,
      shipping: shipping === 0 ? 'FREE (Bank Transfer Special)' : `Rs. ${shipping}`,
      total_amount: `Rs. ${total.toLocaleString()}`,
      payment_method: paymentMethodLabel,
    });

    setConfirmedTotal(total);
    setConfirmedDiscountAmount(discountAmount);
    setConfirmedDiscountCode(appliedDiscount ? appliedDiscount.code : null);
    setConfirmedIsCieStudent(!!appliedDiscount?.isCieStudentCode);
    setConfirmedPaymentMethod(paymentMethod);
    setEmailSentSuccess(emailRes.success);
    setPlacedOrder(orderNum);
    trackPurchase(orderNum, total);
    setIsSubmitting(false);
    onClearCart();
    try {
      sessionStorage.removeItem('sparklez_discount_code');
    } catch {}
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    const finalCity = city === 'Other City' ? customCity : city;
    const isBankTransfer = confirmedPaymentMethod === 'bank_transfer';

    return (
      <div className="bg-neutral-50 min-h-screen py-10 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed
            </span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Your order number is <strong className="text-neutral-900 font-mono">#{placedOrder}</strong>
            </p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-4 text-xs text-neutral-700 text-left space-y-2 border border-neutral-100">
            <div className="flex justify-between">
              <span className="text-neutral-500">Customer:</span>
              <span className="font-bold text-neutral-900">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Phone:</span>
              <span className="font-bold text-neutral-900">{phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal:</span>
              <span className="font-semibold text-neutral-800">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {confirmedDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Discount ({confirmedDiscountCode}):</span>
                </span>
                <span>-Rs. {confirmedDiscountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Charges:</span>
              <span className="font-bold text-emerald-700">
                {isBankTransfer ? 'FREE (Bank Transfer Offer)' : 'Rs. 250'}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200/80 pt-1.5">
              <span className="text-neutral-700 font-bold">Total Payable:</span>
              <span className="font-bold text-neutral-900 text-sm">Rs. {confirmedTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Mode:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                {isBankTransfer ? '💳 Bank Transfer (FREE Delivery)' : '💵 Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Address:</span>
              <span className="font-semibold text-neutral-900 text-right max-w-[200px] truncate">
                {address}, {finalCity}
              </span>
            </div>
          </div>

          {/* Student CIE Verification Notice if CIE Discount applied */}
          {confirmedIsCieStudent && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-amber-950">
                <GraduationCap className="w-4 h-4 text-amber-700 shrink-0" />
                <span>CIE Student Result Verification</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                You used student code <strong>{confirmedDiscountCode}</strong>. Please attach a photo of your official <strong>CIE Result Statement</strong> when clicking WhatsApp below.
              </p>
            </div>
          )}

          {/* Bank Transfer Details if customer chose Bank Transfer */}
          {isBankTransfer && (
            <div className="p-3.5 sm:p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-700 text-xs text-left space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-200">
                  <span>🏦</span>
                  <span className="text-xs uppercase tracking-wider">HBL Bank Details (Free Delivery)</span>
                </div>
                <span className="text-[10px] font-black bg-[#FF9F61] text-neutral-950 px-2 py-0.5 rounded-full">
                  FREE DELIVERY
                </span>
              </div>

              <div className="bg-emerald-900/80 rounded-xl p-2.5 border border-emerald-700/60 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-emerald-200 border-b border-emerald-800/80 pb-1">
                  <span><strong>Bank:</strong> Habib Bank Limited (HBL)</span>
                  <span><strong>Title:</strong> Sparklez Siege</span>
                </div>

                <div className="flex items-center justify-between bg-black/25 px-2 py-1 rounded-lg">
                  <span className="text-emerald-300 font-semibold">Account #:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-white tracking-wider">50327000381203</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('50327000381203', 'conf-acc')}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'conf-acc' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/25 px-2 py-1 rounded-lg">
                  <span className="text-emerald-300 font-semibold">IBAN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-[#FF9F61] tracking-wide text-[10px] sm:text-[11px]">PK59HABB0050327000381203</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('PK59HABB0050327000381203', 'conf-iban')}
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1 transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedField === 'conf-iban' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200 font-medium">
                👉 Transfer <strong className="text-white">Rs. {confirmedTotal.toLocaleString()}</strong> to HBL and click below to send your receipt slip on WhatsApp for instant dispatch!
              </p>
            </div>
          )}

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-left flex items-start space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Our team will dispatch your parcel within 24 hours. Tracked courier delivery in 3-5 days.</span>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/923039117733?text=${encodeURIComponent(
                confirmedIsCieStudent
                  ? `Hi Sparklez Siege! I just placed Order #${placedOrder} for ${fullName} with CIE Student Discount (${confirmedDiscountCode}, Rs. ${confirmedDiscountAmount.toLocaleString()} OFF). Total payable: Rs. ${confirmedTotal.toLocaleString()} via ${isBankTransfer ? 'HBL Bank Transfer' : 'COD'}. Here is my CIE Result Statement ${isBankTransfer ? '& payment slip' : ''} for verification.`
                  : isBankTransfer
                  ? `Hi Sparklez Siege! I just placed Order #${placedOrder} for ${fullName} with Bank Transfer (Rs. ${confirmedTotal.toLocaleString()}). Here is my payment confirmation slip.`
                  : `Hi Sparklez Siege! I just placed Order #${placedOrder} for ${fullName} with Cash on Delivery (Rs. ${confirmedTotal.toLocaleString()}). Could you please confirm tracking?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {confirmedIsCieStudent
                  ? 'Send CIE Result & Slip on WhatsApp'
                  : isBankTransfer
                  ? 'Send Payment Slip on WhatsApp'
                  : 'Track / Inquire on WhatsApp'}
              </span>
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

  // EMPTY CART VIEW
  if (cartItems.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-4 shadow-sm">
          <ShoppingBag className="w-16 h-16 mx-auto text-[#FF9F61] opacity-40" />
          <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-500">Please select fine jewellery pieces to proceed with checkout.</p>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('shop');
              navigate('/shop');
            }}
            className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
          >
            Explore Jewellery
          </button>
        </div>
      </div>
    );
  }

  // OPTIMIZED CONVERSION CHECKOUT VIEW
  return (
    <div className="bg-neutral-50/70 min-h-screen py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Trust Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (onNavigate) onNavigate('cart');
              navigate('/cart');
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>

          <div className="flex items-center space-x-1 text-xs text-emerald-800 font-semibold bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Secure Checkout</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#002D2F] text-emerald-100 text-xs font-bold px-3.5 py-1.5 rounded-full mb-2 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-[#FF9F61] animate-pulse"></span>
            <span>GET FREE DELIVERY ON BANK TRANSFER!</span>
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
            Express Checkout
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Choose Bank Transfer for <strong className="text-emerald-700 font-bold">100% Free Delivery</strong> or Cash on Delivery nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 1. ORDER SUMMARY COLUMN */}
          <div className="lg:col-span-5 order-2 lg:order-2 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="font-serif-luxury font-bold text-neutral-900 text-base">
                  Your Order ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </h2>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Summary
                </span>
              </div>

              {/* Product items list */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                      className="flex items-center space-x-3 text-xs bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-neutral-200 shrink-0 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Qty: <strong className="text-neutral-800">{item.quantity}</strong>
                          {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                        </p>
                        <span className="text-xs font-bold text-neutral-800 block mt-0.5">
                          Rs. {item.product.price.toLocaleString()} each
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-neutral-900">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Discount / CIE Student Promo Code Section */}
              <div className="border-t border-neutral-100 pt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-neutral-800 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF9F61]" />
                    <span>Discount / CIE Student Code</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>CIE Student Offer</span>
                  </span>
                </div>

                {appliedDiscount ? (
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Code: <strong>{appliedDiscount.code}</strong> ({appliedDiscount.percentage}% OFF)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveDiscount}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer flex items-center space-x-0.5"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                    {appliedDiscount.isCieStudentCode && (
                      <p className="text-[10px] text-emerald-800 leading-tight flex items-start space-x-1">
                        <GraduationCap className="w-3 h-3 shrink-0 mt-0.5 text-emerald-700" />
                        <span>Valid for students with CIE Results. Attach your result on WhatsApp after checkout.</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleApplyDiscount} className="space-y-1.5">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                        <input
                          type="text"
                          value={discountInput}
                          onChange={(e) => setDiscountInput(e.target.value)}
                          placeholder="e.g. CIE10, CIE15, CIE30..."
                          className="w-full pl-8 pr-2 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase focus:bg-white focus:outline-hidden focus:border-[#FF9F61] transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs px-3.5 rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {discountMessage && (
                      <p
                        className={`text-xs mt-1 font-medium ${
                          discountMessage.error ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {discountMessage.text}
                      </p>
                    )}
                    <p className="text-[10px] text-neutral-500">
                      🎓 Students: Use code <strong className="text-neutral-800">CIE10</strong>, <strong className="text-neutral-800">CIE15</strong>, <strong className="text-neutral-800">CIE30</strong>, <strong className="text-neutral-800">CIE40</strong>, or <strong className="text-neutral-800">CIE50</strong>.
                    </p>
                  </form>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 px-2 py-1 rounded-lg">
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Discount ({appliedDiscount?.code} • {discountPercent}%):</span>
                    </span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-neutral-600">
                  <span>Delivery Charges:</span>
                  {paymentMethod === 'bank_transfer' ? (
                    <span className="font-bold text-emerald-700 flex items-center space-x-1.5">
                      <span className="line-through text-neutral-400 font-normal text-[11px]">Rs. 250</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px]">FREE</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-neutral-900">Rs. 250</span>
                  )}
                </div>

                {paymentMethod === 'bank_transfer' ? (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Free Delivery Applied!</strong> You save Rs. 250 on this order.</span>
                  </div>
                ) : (
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 cursor-pointer hover:bg-amber-100/70 transition-colors flex items-center justify-between"
                  >
                    <span>💡 Switch to <strong>Bank Transfer</strong> for FREE delivery!</span>
                    <span className="font-bold underline text-[10px] uppercase tracking-wider">Save Rs. 250</span>
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900">Total Payable:</span>
                  <span className="text-2xl font-extrabold text-neutral-900">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mini trust checklist */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free Delivery on Bank Transfer • COD also available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>7-Day Easy Exchange Policy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tracked courier delivery nationwide in 3-5 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DELIVERY INFORMATION FORM COLUMN */}
          <div className="lg:col-span-7 order-1 lg:order-1 bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <h2 className="font-serif-luxury font-bold text-neutral-900 text-lg">
                Delivery Information
              </h2>
              <p className="text-xs text-neutral-500">
                Where should we send your order?
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Fatima Ali"
                    className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                  />
                </div>
              </div>

              {/* 2. Phone / WhatsApp */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-800">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">For Delivery & Tracking</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* 3. Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Delivery Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #, Street #, Sector / Area / Landmark"
                    className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                  />
                </div>
              </div>

              {/* 4. City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full py-3 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white cursor-pointer"
                  >
                    {COMMON_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {city === 'Other City' ? (
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Type City Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter your city name"
                      className="w-full py-3 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="For digital receipt"
                        className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* If city is 'Other City', show email below */}
              {city === 'Other City' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For digital receipt (optional)"
                      className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* 5. Special Note (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Special Note for Courier <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please deliver after 2 PM or call on arrival"
                  className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white"
                />
              </div>

              {/* 6. PAYMENT METHOD: SELECTABLE BANK TRANSFER (FREE DELIVERY) OR COD */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Select Payment Method <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#FF9F61] bg-neutral-950 px-2.5 py-0.5 rounded-full">
                    FREE DELIVERY on Bank Transfer
                  </span>
                </div>

                {/* Option 1: Bank Transfer (Free Delivery) */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-emerald-950 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="accent-emerald-500 cursor-pointer w-4 h-4"
                      />
                      <span className={`text-xs sm:text-sm font-extrabold ${paymentMethod === 'bank_transfer' ? 'text-white' : 'text-neutral-900'}`}>
                        💳 HBL Bank Transfer
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-neutral-950 bg-[#FF9F61] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                      FREE DELIVERY (Rs. 0)
                    </span>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-800/80 space-y-2 text-xs">
                      {/* Compact Prominent HBL Details Box */}
                      <div className="bg-emerald-900/90 rounded-xl p-2.5 border border-emerald-700/80 space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-emerald-200 font-sans text-[11px] pb-0.5 border-b border-emerald-800">
                          <span><strong>Bank:</strong> Habib Bank Ltd (HBL)</span>
                          <span><strong>Title:</strong> Sparklez Siege</span>
                        </div>

                        <div className="flex items-center justify-between bg-black/30 px-2.5 py-1 rounded-lg">
                          <span className="text-emerald-300 font-sans font-semibold text-[10px]">ACC #:</span>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white tracking-wider">50327000381203</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard('50327000381203', 'form-acc');
                              }}
                              className="text-[10px] bg-white/15 hover:bg-white/30 text-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1 transition-colors"
                              title="Copy Account Number"
                            >
                              {copiedField === 'form-acc' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-black/30 px-2.5 py-1 rounded-lg">
                          <span className="text-emerald-300 font-sans font-semibold text-[10px]">IBAN:</span>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-[#FF9F61] tracking-wide text-[10px] sm:text-[11px]">PK59HABB0050327000381203</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard('PK59HABB0050327000381203', 'form-iban');
                              }}
                              className="text-[10px] bg-white/15 hover:bg-white/30 text-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1 transition-colors"
                              title="Copy IBAN"
                            >
                              {copiedField === 'form-iban' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] sm:text-[11px] text-emerald-200 font-medium">
                        ✓ Transfer <strong className="text-white">Rs. {total.toLocaleString()}</strong> & share screenshot on WhatsApp (0303-9117733) for instant dispatch.
                      </p>
                    </div>
                  )}
                </div>

                {/* Option 2: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-neutral-50 border-neutral-900 shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-neutral-900 cursor-pointer w-4 h-4"
                      />
                      <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                        💵 Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md shrink-0">
                      Rs. 250 Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* 7. FINAL PURCHASE BUTTON (PLACE ORDER — Rs. DYNAMIC TOTAL) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-[#FF9F61] hover:bg-[#f08f4f] active:scale-[0.99] text-neutral-950 font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 border border-[#FF9F61]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Placing Your Order...</span>
                    </>
                  ) : (
                    <span>
                      PLACE ORDER — Rs. {total.toLocaleString()}
                      {paymentMethod === 'bank_transfer' && ' (FREE DELIVERY)'}
                    </span>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center space-x-4 text-[11px] text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe & Insured Delivery</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    <span>7-Day Easy Exchange</span>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
