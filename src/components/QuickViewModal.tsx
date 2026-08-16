import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, Zap, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, size?: string, color?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onGoToDetail?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onGoToDetail,
}) => {
  const navigate = useNavigate();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0] : undefined
  );
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const handleGoToDetail = () => {
    onClose();
    if (onGoToDetail) onGoToDetail(product);
    navigate(`/product/${product.slug || product.id}`);
  };

  const handleBuyNow = () => {
    onClose();
    onBuyNow(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

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

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const hasGenuineDiscount = !!(product.compareAtPrice && product.compareAtPrice > product.price);
  const savingsAmount = hasGenuineDiscount ? (product.compareAtPrice! - product.price) : 0;
  const discountPercent = hasGenuineDiscount
    ? Math.round((savingsAmount / product.compareAtPrice!) * 100)
    : 0;

  const currentTotalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-neutral-900 bg-white/90 backdrop-blur-md rounded-full shadow-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side Gallery */}
        <div className="w-full md:w-1/2 bg-neutral-50 p-5 sm:p-6 flex flex-col justify-between">
          <div className="aspect-square w-full rounded-2xl border border-neutral-200 overflow-hidden bg-white mb-3 relative">
            {hasGenuineDiscount && (
              <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                SAVE {discountPercent}%
              </span>
            )}
            <img
              src={product.images[activeImgIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex space-x-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImgIndex === idx
                      ? 'border-[#FF9F61] shadow-2xs'
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
        </div>

        {/* Right Side Info */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Rating */}
            <div className="flex items-center space-x-2 text-xs mb-1.5">
              <div className="flex text-[#FF9F61]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-neutral-900">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Title */}
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {product.name}
            </h2>

            {/* Price & Savings */}
            <div className="flex items-baseline space-x-2.5 mt-2.5">
              <span className="text-2xl font-bold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {hasGenuineDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through">
                    Rs. {product.compareAtPrice!.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    SAVE Rs. {savingsAmount.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Material & Stock reassurance */}
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span>{product.material}</span>
              <span className="font-semibold text-emerald-700">✓ In Stock (COD Available)</span>
            </div>

            {/* Size Options if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-bold text-neutral-800 block mb-1.5">
                  Select Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-bold text-neutral-800 block mb-1.5">
                  Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSelectColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        selectedColor === color
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-3.5 flex items-center space-x-3">
              <span className="text-xs font-bold text-neutral-800">Quantity:</span>
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-neutral-700 hover:bg-neutral-200 text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-neutral-700 hover:bg-neutral-200 text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions & Trust */}
          <div className="mt-5 pt-3 border-t border-neutral-100 space-y-2.5">
            {addedToast && (
              <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-3 rounded-lg flex items-center space-x-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to cart!</span>
              </div>
            )}

            {/* BUY NOW PRIMARY CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-[#FF9F61] hover:bg-[#f08f4f] text-neutral-950 font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>BUY NOW — Rs. {currentTotalPrice.toLocaleString()}</span>
            </button>

            {/* SECONDARY ROW */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-white hover:bg-neutral-900 text-neutral-900 hover:text-white border border-neutral-900 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-neutral-200 text-neutral-600 hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Mini Trust Signals */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-[#FF9F61]" />
                <span>Nationwide Delivery</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💵</span>
                <span>Cash on Delivery</span>
              </span>
              <span className="flex items-center space-x-1">
                <RotateCcw className="w-3.5 h-3.5 text-[#FF9F61]" />
                <span>7-Day Exchange</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoToDetail}
              className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 pt-1 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>View Full Details & Reviews</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
