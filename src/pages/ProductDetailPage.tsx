import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { MOCK_REVIEWS, CATEGORIES } from '../data/products';
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
  Share2,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailPageProps {
  product?: Product;
  allProducts: Product[];
  onSelectProduct?: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, size?: string) => void;
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

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedSize);
    navigate('/checkout');
  };
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors ? product.colors[0] : undefined
  );

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
  const [addedToast, setAddedToast] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'delivery' | 'returns' | 'specs' | null>('delivery');

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(MOCK_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'Just now',
      title: newTitle || 'Loved this jewellery piece!',
      comment: newComment,
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
  };

  // Related products (same category or featured excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(allProducts.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white py-3.5 px-5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-[#FF9F61]/50 transition-all">
            <Check className="w-5 h-5 text-[#FF9F61]" />
            <span className="text-xs sm:text-sm font-semibold">
              Added {quantity} × "{product.name}" to cart!
            </span>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link to={`/category/${product.category}`} className="hover:text-neutral-900 capitalize transition-colors">
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery (Left Col: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
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
            <div className="flex-1 aspect-square bg-neutral-50 overflow-hidden border border-neutral-200 relative group cursor-crosshair">
              <img
                src={product.images[activeImgIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transform group-hover:scale-125 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider shadow-sm">
                  Save {discountPercent}%
                </span>
              )}

              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 backdrop-blur-md border border-neutral-200 transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/90 text-neutral-800 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details (Right Col: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-[#FF9F61] text-xs font-semibold mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current text-[#FF9F61]'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-neutral-800 ml-1">{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400">({product.reviewCount} reviews)</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-3xl font-bold text-neutral-900">
                  {product.formattedPrice ? product.formattedPrice : `$${product.price.toLocaleString()}`}
                </span>
                {product.priceSubtitle && (
                  <span className="text-base font-normal text-neutral-500">
                    {product.priceSubtitle}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-lg text-neutral-400 line-through">
                    ${product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 font-light mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Material Badge */}
              <div className="mt-6 p-3.5 bg-[#FF9F61]/10 rounded-2xl border border-[#FF9F61]/25 flex items-center space-x-3">
                <Gem className="w-5 h-5 text-[#FF9F61] shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-neutral-900 block">Crafted Material</span>
                  <span className="text-neutral-600">{product.material}</span>
                </div>
              </div>

              {/* Sizes if applicable */}
              {product.sizes && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Size:
                    </span>
                    <span className="text-xs text-neutral-500 underline cursor-pointer">
                      Size Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs px-4 py-2.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'border-emerald-800 bg-emerald-900/10 text-neutral-900 shadow-xs'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors if applicable */}
              {product.colors && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Color Option: <span className="font-semibold text-emerald-800">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleSelectColor(color)}
                        className={`text-xs px-5 py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center space-x-2 ${
                          selectedColor === color
                            ? 'border-emerald-800 bg-emerald-900 text-white shadow-md'
                            : 'border-neutral-200 bg-white text-neutral-800 hover:border-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
                            color.toLowerCase().includes('red') || color.toLowerCase().includes('ruby')
                              ? 'bg-rose-600'
                              : color.toLowerCase().includes('green') || color.toLowerCase().includes('emerald')
                              ? 'bg-emerald-600'
                              : color.toLowerCase().includes('blue') || color.toLowerCase().includes('sapphire')
                              ? 'bg-blue-600'
                              : color.toLowerCase().includes('purple') || color.toLowerCase().includes('amethyst')
                              ? 'bg-purple-600'
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
              <div className="mt-6 flex items-center space-x-4">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-200 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-200 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-semibold text-base py-4 px-6 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-base py-4 px-6 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  Buy Now
                </button>
              </div>

              {/* Value Badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 pt-6 border-t border-neutral-100 text-center">
                <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl">
                  <Truck className="w-5 h-5 text-[#FF9F61] mb-1" />
                  <span className="text-[11px] font-semibold text-neutral-800">Deliver All Over Pakistan (Rs. 250)</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-[#FF9F61] mb-1" />
                  <span className="text-[11px] font-semibold text-neutral-800">7-Day Exchange & Returns</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-[#FF9F61] mb-1" />
                  <span className="text-[11px] font-semibold text-neutral-800">100% Handcrafted</span>
                </div>
              </div>
            </div>

            {/* Expandable Accordions for Delivery, Returns, Specifications */}
            <div className="mt-10 border-t border-neutral-100 pt-4 space-y-3">
              {/* Delivery info */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'delivery' ? null : 'delivery')}
                  className="w-full p-4 text-left font-semibold text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#FF9F61]" />
                    <span>Delivery Information</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'delivery' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="p-4 text-xs text-neutral-600 bg-white space-y-2 border-t border-neutral-100">
                    <p>• We deliver all over Pakistan with standard courier services.</p>
                    <p>• Fixed Delivery Charges: <strong>Rs. 250</strong> on all orders.</p>
                    <p>• Estimated Delivery Time: 3 to 5 business days with tracking.</p>
                  </div>
                )}
              </div>

              {/* Return & Exchange Policy */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                  className="w-full p-4 text-left font-semibold text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#FF9F61]" />
                    <span>Exchange & Return Policy</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openAccordion === 'returns' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'returns' && (
                  <div className="p-4 text-xs text-neutral-600 bg-white space-y-2 border-t border-neutral-100">
                    <p>• <strong>Damaged/Defective Items:</strong> Free exchange within 7 days of delivery.</p>
                    <p>• <strong>Standard Returns:</strong> Items can be returned within 7 days, but the customer must pay the return delivery charges.</p>
                    <p>• All returned items must be unworn and in original luxury packaging with invoice.</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  className="w-full p-4 text-left font-semibold text-sm text-neutral-900 flex items-center justify-between bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF9F61]" />
                    <span>Specifications & Certification</span>
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
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-1">
                Verified Opinions
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-neutral-900">
                Customer Reviews
              </h2>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-4 sm:mt-0 bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-semibold text-xs py-2.5 px-5 rounded-xl transition-colors cursor-pointer"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {showReviewForm && (
            <form onSubmit={handleAddReview} className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 mb-8 max-w-2xl space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Share Your Experience</h3>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Rating</label>
                <div className="flex space-x-1 text-[#FF9F61]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer focus:outline-hidden"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Ayesha K."
                    className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Review Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Truly stunning craftsmanship!"
                    className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write details about the shine, weight, packaging, or fit..."
                  className="w-full py-2 px-3 bg-white border border-neutral-200 rounded-xl text-xs h-24"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#FF9F61] text-neutral-950 font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-[#FF9F61]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400">{rev.date}</span>
                  </div>

                  <h4 className="font-serif-luxury text-base font-bold text-neutral-900 mb-1">{rev.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20 pt-12 border-t border-neutral-200">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-2 text-center">
            You May Also Admire
          </span>
          <h2 className="font-serif-luxury text-3xl font-bold text-neutral-900 text-center mb-10">
            Related Jewellery
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
    </div>
  );
};
