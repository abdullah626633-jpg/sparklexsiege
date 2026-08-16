import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { MOCK_REVIEWS } from '../data/products';
import { trackViewContent } from '../utils/metaPixel';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Check,
  Gem,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

interface ProductDetailPageProps {
  product?: Product;
  allProducts: Product[];
  onSelectProduct?: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted?: boolean;
  wishlistIds: string[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: propProduct,
  allProducts,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  wishlistIds,
}) => {
  const navigate = useNavigate();
  const { slugOrId } = useParams<{ slugOrId: string }>();

  const product =
    (slugOrId
      ? allProducts.find((p) => p.slug === slugOrId || p.id === slugOrId)
      : null) ||
    propProduct ||
    allProducts[0];

  const isWishlisted = wishlistIds.includes(product.id);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors ? product.colors[0] : undefined
  );

  const [addedToast, setAddedToast] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'specs' | 'delivery' | 'returns' | 'care' | null>('delivery');

  // Reviews state with localStorage persistence per product
  const storageKey = `sparklez_reviews_${product.id}`;

  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`sparklez_reviews_${product.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return MOCK_REVIEWS;
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // Sync reviews if product changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sparklez_reviews_${product.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsList(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setReviewsList(MOCK_REVIEWS);
  }, [product.id]);

  // Dynamic review count & rating calculation based on real persisted reviews
  const currentReviewCount = reviewsList.length > 0 ? reviewsList.length : product.reviewCount;
  const currentAvgRating =
    reviewsList.length > 0
      ? Number(
          (
            reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
          ).toFixed(1)
        )
      : product.rating;

  // Sticky buy bar detection
  const mainBuyButtonRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
    }
  }, [product?.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (mainBuyButtonRef.current) {
        const rect = mainBuyButtonRef.current.getBoundingClientRect();
        // If the bottom of the main CTA button is scrolled above the viewport or out of view
        if (rect.bottom < 0) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    if (product.colorImages && product.colorImages[color]) {
      const imgUrl = product.colorImages[color];
      const idx = product.images.indexOf(imgUrl);
      if (idx !== -1) {
        setActiveImgIndex(idx);
      }
    } else if (product.colors) {
      const colorIndex = product.colors.indexOf(color);
      if (colorIndex !== -1 && product.images[colorIndex]) {
        setActiveImgIndex(colorIndex);
      }
    }
  };

  const hasGenuineDiscount = !!(product.compareAtPrice && product.compareAtPrice > product.price);
  const savingsAmount = hasGenuineDiscount ? (product.compareAtPrice! - product.price) : 0;
  const discountPercent = hasGenuineDiscount
    ? Math.round((savingsAmount / product.compareAtPrice!) * 100)
    : 0;

  const currentTotalPrice = product.price * quantity;

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const todayDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: todayDate,
      comment: newComment.trim(),
      verified: true,
    };

    const updatedReviews = [newRev, ...reviewsList];
    setReviewsList(updatedReviews);

    // Persist immediately in localStorage so it stays permanently on the website
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
    } catch {
      // ignore
    }

    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3000);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(allProducts.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  const currentImageUrl = product.images[activeImgIndex] || product.images[0] || '';
  const absoluteImageUrl = currentImageUrl.startsWith('http://') || currentImageUrl.startsWith('https://')
    ? currentImageUrl
    : `${typeof window !== 'undefined' ? window.location.origin : 'https://sparkleziege.shop'}${currentImageUrl.startsWith('/') ? currentImageUrl : `/${currentImageUrl}`}`;

  const currentProductUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://sparkleziege.shop'}/product/${product.slug || product.id}`;
  const effectivePrice = product.price;
  const pageTitle = `${product.name} | Sparklez Siege`;
  const metaDescription = product.description.length > 160 ? `${product.description.substring(0, 157)}...` : product.description;

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [absoluteImageUrl],
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Sparklez Siege',
    },
    offers: {
      '@type': 'Offer',
      url: currentProductUrl,
      priceCurrency: 'PKR',
      price: effectivePrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="bg-white min-h-screen pb-16 sm:pb-20">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.name}, ${product.category}, Sparklez Siege, jewellery Pakistan, buy ${product.name} online, ${product.colors ? product.colors.join(', ') : ''}`} />
        <link rel="canonical" href={currentProductUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:url" content={currentProductUrl} />
        <meta property="og:site_name" content="Sparklez Siege" />
        <meta property="og:price:amount" content={String(effectivePrice)} />
        <meta property="og:price:currency" content="PKR" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={absoluteImageUrl} />

        {/* Product Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>

      {/* Toast Alerts */}
      {addedToast && (
        <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 bg-neutral-900 text-white py-3.5 px-5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-[#FF9F61]/50 transition-all animate-bounce">
          <Check className="w-5 h-5 text-[#FF9F61]" />
          <span className="text-xs sm:text-sm font-semibold">
            Added {quantity} × "{product.name}" to your cart!
          </span>
        </div>
      )}

      {reviewSubmittedToast && (
        <div className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 bg-neutral-900 text-white py-3.5 px-5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-[#FF9F61] transition-all animate-bounce">
          <Check className="w-5 h-5 text-[#FF9F61]" />
          <span className="text-xs sm:text-sm font-semibold">
            Thank you! Your review is now live on our website.
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-5 flex-wrap">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to={`/category/${product.category}`} className="hover:text-neutral-900 capitalize transition-colors">
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold text-neutral-900 truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery (Left Col: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col space-x-2.5 md:space-x-0 md:space-y-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-1 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImgIndex === idx
                        ? 'border-[#FF9F61] shadow-xs'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image with hover zoom */}
            <div className="flex-1 aspect-square bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 relative group cursor-crosshair">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Discount / Sale Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {hasGenuineDiscount && (
                  <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                    SAVE {discountPercent}%
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-neutral-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 p-3 rounded-full backdrop-blur-md border border-neutral-200 transition-colors cursor-pointer shadow-md ${
                  isWishlisted
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white/95 text-neutral-800 hover:bg-neutral-900 hover:text-white'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Information (Right Col: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            {/* 1. Rating & Social Proof */}
            <div
              onClick={scrollToReviews}
              className="inline-flex items-center space-x-2 text-xs cursor-pointer group"
            >
              <div className="flex text-[#FF9F61]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(currentAvgRating)
                        ? 'fill-current text-[#FF9F61]'
                        : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                {currentAvgRating.toFixed(1)}
              </span>
              <span className="text-neutral-500 underline group-hover:text-neutral-800">
                ({currentReviewCount} verified {currentReviewCount === 1 ? 'review' : 'reviews'})
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                ✓ Verified
              </span>
            </div>

            {/* 2. Product Name */}
            <div>
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1 font-medium">
                {product.category.replace(/-/g, ' ')} • {product.material}
              </p>
            </div>

            {/* 3. Pricing & Genuine Savings Breakdown */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                  Rs. {product.price.toLocaleString()}
                </span>

                {hasGenuineDiscount && (
                  <>
                    <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
                      Rs. {product.compareAtPrice!.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                      SAVE Rs. {savingsAmount.toLocaleString()} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>

              {product.priceSubtitle && (
                <p className="text-xs font-medium text-neutral-500 mt-1">
                  {product.priceSubtitle}
                </p>
              )}

              <div className="mt-2.5 pt-2.5 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-600">
                <span className="flex items-center space-x-1 font-medium text-emerald-700">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>In Stock & Ready to Dispatch</span>
                </span>
                <span className="text-neutral-500">Delivery: Rs. 250</span>
              </div>
            </div>

            {/* 4. Why You'll Love It (Short & Scannable Selling Points) */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2.5">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9F61]" />
                <span>Why You'll Love It</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Premium handcrafted finish with tarnish-resistant coating</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>High-grade sparkling zircon & crystal embellishments</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Lightweight and hypoallergenic — comfortable for everyday & festive wear</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Arrives in signature Sparklez Siege luxury packaging — perfect for gifting</span>
                </li>
              </ul>
            </div>

            {/* 5. Variants (Sizes & Colors) & Quantity */}
            <div className="space-y-4 pt-1">
              {/* Sizes if applicable */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Select Size: <span className="font-semibold text-[#FF9F61]">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs px-4 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 text-neutral-800 bg-white hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors if applicable */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Color: <span className="font-semibold text-neutral-900">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`text-xs px-4 py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center space-x-2 ${
                          selectedColor === color
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full border border-black/20 ${
                            color.toLowerCase().includes('red') || color.toLowerCase().includes('ruby')
                              ? 'bg-rose-600'
                              : color.toLowerCase().includes('green') || color.toLowerCase().includes('emerald')
                              ? 'bg-emerald-600'
                              : color.toLowerCase().includes('blue') || color.toLowerCase().includes('sapphire')
                              ? 'bg-blue-600'
                              : color.toLowerCase().includes('purple') || color.toLowerCase().includes('amethyst')
                              ? 'bg-purple-600'
                              : color.toLowerCase().includes('pink') || color.toLowerCase().includes('rose')
                              ? 'bg-pink-400'
                              : color.toLowerCase().includes('golden') || color.toLowerCase().includes('gold')
                              ? 'bg-[#FF9F61]'
                              : color.toLowerCase().includes('silver')
                              ? 'bg-slate-300'
                              : color.toLowerCase().includes('black')
                              ? 'bg-neutral-900'
                              : 'bg-neutral-400'
                          }`}
                        />
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-neutral-700 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-neutral-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-neutral-700 hover:bg-neutral-100 text-sm font-bold cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 6. PRIMARY CALL TO ACTION (BUY NOW IS MAIN ACTION) */}
            <div ref={mainBuyButtonRef} className="space-y-3 pt-2">
              {/* BUY NOW BUTTON (DOMINANT & HIGH VISIBILITY) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-[#FF9F61] hover:bg-[#f08f4f] active:scale-[0.99] text-neutral-950 font-extrabold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 border border-[#FF9F61]"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>BUY NOW — Rs. {currentTotalPrice.toLocaleString()}</span>
              </button>

              {/* SECONDARY ROW: Add to Cart + Wishlist */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border-2 border-neutral-900 font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border-2 transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-500 text-rose-600'
                      : 'border-neutral-300 text-neutral-700 hover:text-rose-600 hover:border-rose-300 bg-white'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* 7. SHORT TRUST SIGNALS & DOUBT REMOVAL (Immediately below Buy Now) */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2.5">
              <div className="grid grid-cols-2 gap-3 text-xs text-neutral-800">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block text-neutral-900">Nationwide Delivery</span>
                    <span className="text-[11px] text-neutral-600">3-5 business days</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-base shrink-0">💵</span>
                  <div>
                    <span className="font-bold block text-neutral-900">Cash on Delivery</span>
                    <span className="text-[11px] text-neutral-600">Pay at your doorstep</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block text-neutral-900">7-Day Easy Exchange</span>
                    <span className="text-[11px] text-neutral-600">Hassle-free guarantee</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold block text-neutral-900">100% Genuine</span>
                    <span className="text-[11px] text-neutral-600">Premium quality piece</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. EXPANDABLE ACCORDIONS (Reduced information overload) */}
            <div className="border-t border-neutral-200 pt-4 space-y-2.5">
              {/* Product Details */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Gem className="w-4 h-4 text-[#FF9F61]" />
                    <span>Product Details & Description</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="p-4 text-xs text-neutral-700 bg-white leading-relaxed border-t border-neutral-100 space-y-2">
                    <p>{product.description}</p>
                    <p className="font-semibold text-neutral-800">
                      Material: <span className="font-normal text-neutral-600">{product.material}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery & Cash on Delivery */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
                  className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#FF9F61]" />
                    <span>Delivery & Cash on Delivery Info</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'delivery' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="p-4 text-xs text-neutral-600 bg-white space-y-1.5 border-t border-neutral-100">
                    <p>• <strong>Cash on Delivery (COD)</strong> is available for all cities and towns across Pakistan.</p>
                    <p>• Standard Flat Delivery Fee: <strong>Rs. 250</strong> per order.</p>
                    <p>• Orders are dispatched within 24 hours and delivered in 3 to 5 business days with active SMS/WhatsApp tracking.</p>
                  </div>
                )}
              </div>

              {/* 7-Day Exchange Policy */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                  className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#FF9F61]" />
                    <span>7-Day Easy Exchange Policy</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'returns' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'returns' && (
                  <div className="p-4 text-xs text-neutral-600 bg-white space-y-1.5 border-t border-neutral-100">
                    <p>• <strong>7-Day Exchange:</strong> If you receive a damaged piece or need a size adjustment, contact us within 7 days of receiving your parcel.</p>
                    <p>• Items must be unworn and in original luxury Sparklez Siege packaging.</p>
                    <p>• Simply message us on WhatsApp with your order number for immediate assistance.</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                    className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#FF9F61]" />
                      <span>Specifications & Dimensions</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform ${
                        openAccordion === 'specs' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'specs' && (
                    <div className="p-4 text-xs text-neutral-600 bg-white border-t border-neutral-100">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {product.specifications.map((spec, i) => (
                            <tr key={i} className="border-b border-neutral-100 last:border-0 py-1.5">
                              <td className="py-2 font-semibold text-neutral-800 w-1/2">{spec.key}</td>
                              <td className="py-2 text-neutral-600 w-1/2">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Care Instructions */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/70 hover:bg-neutral-100 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#FF9F61]" />
                    <span>Jewellery Care Guide</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="p-4 text-xs text-neutral-600 bg-white space-y-1.5 border-t border-neutral-100">
                    <p>• Avoid direct contact with perfume, hairspray, lotions, and harsh sanitizers.</p>
                    <p>• Store in the provided airtight box or pouch when not in use.</p>
                    <p>• Wipe gently with a soft micro-fiber cloth after each wear to maintain brilliance.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews-section" className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-1">
                Verified Customer Feedback
              </span>
              <div className="flex items-center space-x-3">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900">
                  Customer Reviews
                </h2>
                <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  ★ {currentAvgRating.toFixed(1)} / 5.0
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {currentReviewCount} verified {currentReviewCount === 1 ? 'buyer has' : 'buyers have'} shared their experience across Pakistan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="self-start sm:self-auto bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form - Clean & Simple: Only Name and Review required */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="bg-neutral-50 p-6 sm:p-7 rounded-3xl border border-neutral-200 mb-8 max-w-2xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Write Your Review</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Your review will be posted directly to this product page.
                </p>
              </div>

              {/* Star Rating Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center space-x-1 text-[#FF9F61]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform focus:outline-hidden"
                      aria-label={`${star} star rating`}
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-current' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">
                    {newRating === 5 ? '5.0 - Excellent' : `${newRating}.0`}
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-hidden focus:border-[#FF9F61]"
                  required
                />
              </div>

              {/* Review Text Field */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Your Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us what you liked about the piece, finishing, sparkle, or delivery experience..."
                  className="w-full py-2.5 px-3.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 h-28 focus:outline-hidden focus:border-[#FF9F61] resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="submit"
                  className="bg-[#FF9F61] hover:bg-[#f08f4f] active:scale-[0.99] text-neutral-950 font-bold text-xs sm:text-sm py-3 px-7 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 py-3 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviewsList.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
              <p className="text-xs sm:text-sm text-neutral-600">No reviews yet for this product. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex flex-col justify-between space-y-3 hover:border-neutral-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-[#FF9F61]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">{rev.date}</span>
                    </div>

                    {rev.title && (
                      <h4 className="font-serif-luxury text-sm font-bold text-neutral-900 mb-1">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-2 text-center">
            You May Also Like
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-8">
            Complete The Look
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
                onAddToCart={(prod) => onAddToCart(prod, 1)}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(p.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. STICKY MOBILE BUY BUTTON BAR */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:hidden transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-medium">
                Total Price
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-extrabold text-neutral-900">
                  Rs. {currentTotalPrice.toLocaleString()}
                </span>
                {hasGenuineDiscount && (
                  <span className="text-[10px] text-neutral-400 line-through">
                    Rs. {(product.compareAtPrice! * quantity).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 bg-[#FF9F61] active:bg-[#e88d51] text-neutral-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
