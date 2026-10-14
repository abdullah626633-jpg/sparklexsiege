import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, PageType } from '../types';
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
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { sendOrderEmail } from '../services/emailService';
import { trackInitiateCheckout, trackPurchase } from '../utils/metaPixel';
import { validateDiscountCode, DiscountCode } from '../data/discountCodes';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
  onNavigate?: (page: PageType) => void;
}

const POPULAR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
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

  // Form fields with persistence
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cod'>('bank_transfer');
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState<'bank_transfer' | 'cod'>('bank_transfer');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Coupon / Discount state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved customer information from localStorage & discount from sessionStorage
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('sparklez_shipping_details');
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.city) setCity(parsed.city);
        if (parsed.landmark) setLandmark(parsed.landmark);
      }
    } catch {
      // Ignore storage errors
    }

    try {
      const savedDiscount = sessionStorage.getItem('sparklez_discount_code');
      if (savedDiscount) {
        const result = validateDiscountCode(savedDiscount);
        if (result.valid && result.discount) {
          setAppliedDiscount(result.discount);
          setCouponCode(result.discount.code);
          setCouponMessage({ text: result.message, error: false });
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountPercent = appliedDiscount ? appliedDiscount.percentage : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  // FREE Delivery on Bank Transfer, Rs. 250 on Cash on Delivery
  const shipping = discountedSubtotal === 0 ? 0 : paymentMethod === 'bank_transfer' ? 0 : 250;
  const total = discountedSubtotal + shipping;

  useEffect(() => {
    if (cartItems.length > 0) {
      trackInitiateCheckout(total, cartItems.length);
    }
  }, []);

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDiscountCode(couponCode);
    if (result.valid && result.discount) {
      setAppliedDiscount(result.discount);
      setCouponMessage({ text: result.message, error: false });
      try {
        sessionStorage.setItem('sparklez_discount_code', result.discount.code);
      } catch {}
    } else {
      setAppliedDiscount(null);
      setCouponMessage({ text: result.message, error: true });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponMessage(null);
    try {
      sessionStorage.removeItem('sparklez_discount_code');
    } catch {}
  };

  // 1-Click WhatsApp Quick Order Link
  const getWhatsAppOrderUrl = () => {
    const itemsList = cartItems
      .map(
        (item) =>
          `• ${item.product.name} (Qty: ${item.quantity}${
            item.selectedColor ? `, Color: ${item.selectedColor}` : ''
          }${item.selectedSize ? `, Size: ${item.selectedSize}` : ''}) - Rs. ${(
            item.product.price * item.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const customerDetails = fullName.trim()
      ? `\n\n*Customer Details:*\nName: ${fullName.trim()}\nPhone: ${phone.trim() || 'N/A'}\nCity: ${
          city.trim() || 'N/A'
        }\nAddress: ${address.trim() || 'N/A'}`
      : '';

    const text = `Hi Sparklez Siege! 👋 I'd like to place an order directly:\n\n*Cart Items:*\n${itemsList}\n\n*Subtotal:* Rs. ${subtotal.toLocaleString()}${
      discountAmount > 0 ? `\n*Discount:* -Rs. ${discountAmount.toLocaleString()}` : ''
    }\n*Delivery:* ${
      paymentMethod === 'bank_transfer' ? 'FREE (Bank Transfer)' : 'Rs. 250 (COD)'
    }\n*Total:* Rs. ${total.toLocaleString()}${customerDetails}\n\nPlease confirm availability and guide me through the payment!`;

    return `https://wa.me/923039117733?text=${encodeURIComponent(text)}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frictionless Validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid Pakistani mobile/WhatsApp number (e.g. 0300 1234567).');
      window.scrollTo({ top: 160, behavior: 'smooth' });
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your complete delivery street address (House / Flat, Street, Area).');
      window.scrollTo({ top: 220, behavior: 'smooth' });
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please select or enter your city.');
      window.scrollTo({ top: 280, behavior: 'smooth' });
      return;
    }

    // Persist details for future effortless purchases
    try {
      localStorage.setItem(
        'sparklez_shipping_details',
        JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          landmark: landmark.trim(),
        })
      );
    } catch {
      // Ignore storage errors
    }

    setIsSubmitting(true);
    const orderNum = `SKS-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCity = city.trim();
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
      landmark: landmark.trim() || undefined,
      city: finalCity,
      state: 'Pakistan',
      notes: notes.trim() || undefined,
      cartItems: cartItems,
      subtotal: `Rs. ${subtotal.toLocaleString()}`,
      discount: discountAmount > 0 ? `-Rs. ${discountAmount.toLocaleString()}` : undefined,
      discount_code: appliedDiscount?.code,
      shipping: shipping === 0 ? 'FREE (Bank Transfer Special)' : `Rs. ${shipping}`,
      total_amount: `Rs. ${total.toLocaleString()}`,
      payment_method: paymentMethodLabel,
    });

    setConfirmedTotal(total);
    setConfirmedPaymentMethod(paymentMethod);
    setEmailSentSuccess(emailRes.success);
    setPlacedOrder(orderNum);
    trackPurchase(orderNum, total);
    setIsSubmitting(false);
    onClearCart();
  };

  // SUCCESS CONFIRMATION VIEW
  if (placedOrder) {
    const finalCity = city;
    const isBankTransfer = confirmedPaymentMethod === 'bank_transfer';

    return (
      <div className="bg-neutral-50/70 min-h-screen py-10 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-9 border border-neutral-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order Confirmed & Received</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Your order reference number is:
            </p>
            <div className="mt-2 inline-flex items-center space-x-2 bg-neutral-100 px-4 py-2 rounded-xl border border-neutral-200">
              <span className="font-mono text-base font-extrabold text-neutral-900">#{placedOrder}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(placedOrder, 'order-id')}
                className="text-neutral-500 hover:text-neutral-900 text-xs flex items-center space-x-1 bg-white px-2 py-1 rounded-md border border-neutral-200 transition-colors"
                title="Copy Order ID"
              >
                {copiedField === 'order-id' ? (
                  <span className="text-emerald-600 font-bold">Copied!</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-100">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-3 text-left">
              Order Timeline
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-[11px] font-bold text-neutral-900 mt-1">Received</span>
                <span className="text-[10px] text-neutral-500">Instant</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#FF9F61] text-neutral-950 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-[11px] font-bold text-neutral-900 mt-1">Dispatch</span>
                <span className="text-[10px] text-neutral-500">Within 24h</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-[11px] font-bold text-neutral-900 mt-1">Delivered</span>
                <span className="text-[10px] text-neutral-500">3-5 Days</span>
              </div>
            </div>
          </div>

          {/* Order Summary Details Box */}
          <div className="bg-neutral-50 rounded-2xl p-4 text-xs text-neutral-700 text-left space-y-2 border border-neutral-100">
            <div className="flex justify-between">
              <span className="text-neutral-500">Recipient:</span>
              <span className="font-bold text-neutral-900">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Phone:</span>
              <span className="font-bold text-neutral-900 font-mono">{phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal:</span>
              <span className="font-semibold text-neutral-800">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount ({appliedDiscount?.code}):</span>
                <span>-Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Charges:</span>
              <span className="font-bold text-emerald-700">
                {isBankTransfer ? 'FREE (Bank Transfer Special)' : 'Rs. 250'}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200/80 pt-2">
              <span className="text-neutral-800 font-extrabold text-sm">Total Amount:</span>
              <span className="font-extrabold text-neutral-950 text-base">Rs. {confirmedTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Payment Mode:</span>
              <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                {isBankTransfer ? '💳 HBL Bank Transfer (FREE Delivery)' : '💵 Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-neutral-500 shrink-0">Ship to:</span>
              <span className="font-medium text-neutral-900 text-right max-w-[240px] truncate">
                {address}, {finalCity}
              </span>
            </div>
          </div>

          {/* Bank Transfer Details if customer chose Bank Transfer */}
          {isBankTransfer && (
            <div className="p-4 sm:p-5 bg-emerald-950 text-white rounded-2xl border border-emerald-700 text-xs text-left space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-emerald-200">
                  <span className="text-base">🏦</span>
                  <span className="text-xs uppercase tracking-wider font-extrabold">HBL Bank Details (Free Delivery)</span>
                </div>
                <span className="text-[10px] font-black bg-[#FF9F61] text-neutral-950 px-2.5 py-0.5 rounded-full">
                  FREE DELIVERY
                </span>
              </div>

              <div className="bg-emerald-900/80 rounded-xl p-3 border border-emerald-700/60 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-emerald-200 border-b border-emerald-800/80 pb-1.5">
                  <span><strong>Bank:</strong> Habib Bank Limited (HBL)</span>
                  <span><strong>Title:</strong> Sparklez Siege</span>
                </div>

                <div className="flex items-center justify-between bg-black/30 px-2.5 py-1.5 rounded-lg">
                  <span className="text-emerald-300 font-semibold">Account #:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white tracking-wider text-xs">50327000381203</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('50327000381203', 'conf-acc')}
                      className="text-[10px] bg-white/15 hover:bg-white/25 text-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1 transition-colors"
                      title="Copy Account Number"
                    >
                      {copiedField === 'conf-acc' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/30 px-2.5 py-1.5 rounded-lg">
                  <span className="text-emerald-300 font-semibold">IBAN:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#FF9F61] tracking-wide text-[10px] sm:text-[11px]">PK59HABB0050327000381203</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('PK59HABB0050327000381203', 'conf-iban')}
                      className="text-[10px] bg-white/15 hover:bg-white/25 text-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1 transition-colors"
                      title="Copy IBAN"
                    >
                      {copiedField === 'conf-iban' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200 leading-relaxed">
                👉 Please transfer <strong className="text-white font-bold">Rs. {confirmedTotal.toLocaleString()}</strong> to HBL and share your payment receipt below on WhatsApp for priority dispatch!
              </p>
            </div>
          )}

          <div className="space-y-2.5 pt-1">
            <a
              href={`https://wa.me/923039117733?text=${encodeURIComponent(
                isBankTransfer
                  ? `Hi Sparklez Siege! I just placed Order #${placedOrder} for ${fullName} with Bank Transfer (Rs. ${confirmedTotal.toLocaleString()}). Here is my payment receipt screenshot.`
                  : `Hi Sparklez Siege! I just placed Order #${placedOrder} for ${fullName} with Cash on Delivery (Rs. ${confirmedTotal.toLocaleString()}). Could you please confirm delivery tracking?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm py-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>
                {isBankTransfer
                  ? 'Send Payment Receipt on WhatsApp'
                  : 'Track / Inquire Order on WhatsApp'}
              </span>
            </a>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('shop');
                navigate('/shop');
              }}
              className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all cursor-pointer"
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
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-[#FF9F61]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-500">
            Please add luxury jewellery sets or pieces to proceed with checkout.
          </p>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('shop');
              navigate('/shop');
            }}
            className="w-full bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
          >
            Explore Jewellery Collection
          </button>
        </div>
      </div>
    );
  }

  // OPTIMIZED, ECOMMERCE-FRIENDLY CHECKOUT VIEW
  return (
    <div className="bg-neutral-50/70 min-h-screen py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Step Progression Breadcrumb */}
        <div className="mb-6 bg-white rounded-2xl p-3 sm:p-4 border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1: Cart */}
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('cart');
                navigate('/cart');
              }}
              className="flex items-center space-x-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="hidden sm:inline">Shopping Bag</span>
            </button>

            <span className="h-0.5 w-8 sm:w-16 bg-neutral-200" />

            {/* Step 2: Delivery & Payment (Active) */}
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span className="text-[#FF9F61] font-extrabold">Delivery & Payment</span>
            </div>

            <span className="h-0.5 w-8 sm:w-16 bg-neutral-200" />

            {/* Step 3: Confirmation */}
            <div className="flex items-center space-x-2 text-xs font-medium text-neutral-400">
              <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center text-xs">
                3
              </span>
              <span className="hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Security & Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#002D2F] text-emerald-100 text-xs font-bold px-3 py-1 rounded-full mb-1.5 border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#FF9F61] animate-pulse"></span>
              <span>GET FREE DELIVERY ON BANK TRANSFER!</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
              Fast & Easy Checkout
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter your delivery details below to finalize your jewellery purchase.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* 1-Tap WhatsApp Quick Order Card (Huge conversion booster for Pakistani e-commerce) */}
        <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                Prefer to order directly via WhatsApp?
              </h3>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                Skip typing or get live styling guidance from our team in seconds.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <span>Order via WhatsApp (1 Tap)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: DELIVERY INFORMATION & PAYMENT FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
              
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="font-serif-luxury font-bold text-neutral-900 text-lg flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#FF9F61]" />
                  <span>1. Delivery Address in Pakistan</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  We deliver nationwide via insured tracked courier services.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4">
                
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
                      className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 2. Phone / WhatsApp Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-800">
                      Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      For courier delivery updates
                    </span>
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white font-mono transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Format: 03XX XXXXXXX (Courier calls on this number before delivery)
                  </span>
                </div>

                {/* 3. Delivery Street Address */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Complete Street Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Apartment #, Street #, Sector / Area"
                      className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 4. City with 1-Click Quick City Chips */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  
                  {/* Quick City Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          city.toLowerCase() === c.toLowerCase()
                            ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Type or pick your city"
                      className="w-full py-3 pl-9 pr-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Optional Landmark & Instructions Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{showOptionalFields ? 'Hide extra details' : '+ Add nearby landmark, email, or gift note'}</span>
                    {showOptionalFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showOptionalFields && (
                    <div className="mt-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 animate-fadeIn">
                      {/* Landmark */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Nearby Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Shell pump / Masjid / Main Market"
                          className="w-full py-2.5 px-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Email Address (Optional, for digital receipt)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@gmail.com"
                            className="w-full py-2.5 pl-9 pr-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61]"
                          />
                        </div>
                      </div>

                      {/* Order notes */}
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Delivery Instructions / Gift Message (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="e.g. Please deliver after 2 PM, or Include a birthday note"
                          className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-[#FF9F61]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. PAYMENT METHOD SECTION */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <span>2. Select Payment Method</span>
                    </label>
                    <span className="text-[10px] font-bold text-[#FF9F61] bg-neutral-950 px-2.5 py-0.5 rounded-full">
                      Free Shipping on Bank Transfer
                    </span>
                  </div>

                  {/* Option 1: HBL Bank Transfer (Recommended with Free Delivery) */}
                  <div
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
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
                        <div>
                          <span className={`text-xs sm:text-sm font-extrabold ${paymentMethod === 'bank_transfer' ? 'text-white' : 'text-neutral-900'}`}>
                            💳 HBL Bank Transfer
                          </span>
                          <span className={`block text-[10px] ${paymentMethod === 'bank_transfer' ? 'text-emerald-200' : 'text-neutral-500'}`}>
                            Online Banking / Raast / EasyPaisa / JazzCash to HBL
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-neutral-950 bg-[#FF9F61] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                        FREE DELIVERY (Save Rs. 250)
                      </span>
                    </div>

                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-3 pt-3 border-t border-emerald-800/80 space-y-2.5 text-xs animate-fadeIn">
                        {/* Compact Prominent HBL Details Box */}
                        <div className="bg-emerald-900/90 rounded-xl p-3 border border-emerald-700/80 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-emerald-200 font-sans text-[11px] pb-1 border-b border-emerald-800">
                            <span><strong>Bank:</strong> Habib Bank Ltd (HBL)</span>
                            <span><strong>Title:</strong> Sparklez Siege</span>
                          </div>

                          <div className="flex items-center justify-between bg-black/30 px-2.5 py-1.5 rounded-lg">
                            <span className="text-emerald-300 font-sans font-semibold text-[10px]">ACCOUNT #:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white tracking-wider text-xs">50327000381203</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard('50327000381203', 'form-acc');
                                }}
                                className="text-[10px] bg-white/15 hover:bg-white/30 text-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1 transition-colors"
                                title="Copy Account Number"
                              >
                                {copiedField === 'form-acc' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-black/30 px-2.5 py-1.5 rounded-lg">
                            <span className="text-emerald-300 font-sans font-semibold text-[10px]">IBAN / RAAST:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-[#FF9F61] tracking-wide text-[10px] sm:text-[11px]">PK59HABB0050327000381203</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard('PK59HABB0050327000381203', 'form-iban');
                                }}
                                className="text-[10px] bg-white/15 hover:bg-white/30 text-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1 transition-colors"
                                title="Copy IBAN"
                              >
                                {copiedField === 'form-iban' ? <span className="text-[#FF9F61] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-emerald-100 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800/60 leading-relaxed">
                          ✓ Transfer <strong className="text-white">Rs. {total.toLocaleString()}</strong> and share payment screenshot on WhatsApp (<strong className="text-[#FF9F61]">0303-9117733</strong>) after placing order for instant VIP dispatch.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
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
                        <div>
                          <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                            💵 Cash on Delivery (COD)
                          </span>
                          <span className="block text-[10px] text-neutral-500">
                            Pay in cash to the rider at your doorstep upon parcel receipt
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-200 px-2.5 py-1 rounded-full shrink-0">
                        Rs. 250 Delivery
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button (Desktop & Tablet) */}
                <div className="pt-3">
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
                        COMPLETE ORDER — Rs. {total.toLocaleString()}
                        {paymentMethod === 'bank_transfer' && ' (FREE DELIVERY)'}
                      </span>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center space-x-4 text-[11px] text-neutral-500">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Safe Insured Delivery</span>
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

          {/* RIGHT COLUMN: ORDER SUMMARY COLUMN (5 Cols, Sticky) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-4 lg:sticky lg:top-24">
              
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="font-serif-luxury font-bold text-neutral-900 text-base">
                  Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate('cart');
                    navigate('/cart');
                  }}
                  className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              {/* Product items list */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  const isContain =
                    item.product.imageFit === 'contain' ||
                    item.product.category === 'sterling-luxury-sets' ||
                    item.product.name.toLowerCase().includes('maharani') ||
                    item.product.name.toLowerCase().includes('princess');

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`}
                      className="flex items-center space-x-3 text-xs bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className={`w-14 h-14 ${
                          isContain ? 'object-contain p-1' : 'object-cover'
                        } rounded-lg border border-neutral-200 shrink-0 bg-white`}
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
                          Rs. {item.product.price.toLocaleString()}
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

              {/* Promo code drawer */}
              <div className="border-t border-neutral-100 pt-3">
                {appliedDiscount ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedDiscount.code} ({appliedDiscount.percentage}% OFF Applied)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    {!showCouponInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCouponInput(true)}
                        className="text-xs font-semibold text-neutral-700 hover:text-[#FF9F61] flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Have a discount or student code?</span>
                      </button>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter promo code"
                            className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase focus:outline-hidden focus:border-[#FF9F61]"
                          />
                          <button
                            type="submit"
                            className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {couponMessage && (
                          <p
                            className={`text-[11px] font-medium ${
                              couponMessage.error ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {couponMessage.text}
                          </p>
                        )}
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="border-t border-neutral-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedDiscount?.code}):</span>
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
                    <span><strong>Free Shipping Applied!</strong> You saved Rs. 250 on this order.</span>
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

              {/* Guarantees */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-600">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Solid 925 Sterling Silver & Original Stones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free Delivery on Bank Transfer • COD nationwide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dispatched in 24 Hours with tracking number</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM CHECKOUT BAR FOR MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase block">Total Payable</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-black text-neutral-900">Rs. {total.toLocaleString()}</span>
              {paymentMethod === 'bank_transfer' && (
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  FREE SHIP
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting || cartItems.length === 0}
            className="flex-1 bg-[#FF9F61] hover:bg-[#f08f4f] text-neutral-950 font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>COMPLETE ORDER</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
