import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onGoToDetail: (product: Product) => void;
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
  if (!product) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-neutral-900 bg-white/80 backdrop-blur-md rounded-full shadow-md transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side Gallery */}
        <div className="w-full md:w-1/2 bg-neutral-50 p-6 flex flex-col justify-between">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white mb-4 border border-neutral-100 relative">
            <img
              src={product.images[activeImgIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImgIndex === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
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
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 text-xs mb-2">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-neutral-800">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400">({product.reviewCount} reviews)</span>
            </div>

            <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 tracking-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-2xl font-bold text-neutral-900">
                ${product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ${product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* Material */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <span className="text-xs font-semibold text-neutral-700 block mb-1">
                Material:
              </span>
              <span className="text-xs text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-lg inline-block">
                {product.material}
              </span>
            </div>

            {/* Size Options if available */}
            {product.sizes && (
              <div className="mt-4">
                <span className="text-xs font-semibold text-neutral-700 block mb-2">
                  Select Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === sz
                          ? 'border-[#D4AF37] bg-amber-50 text-[#D4AF37]'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center space-x-4">
              <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-4 border-t border-neutral-100 space-y-3">
            {addedToast && (
              <div className="bg-emerald-50 text-emerald-800 text-xs py-2 px-3 rounded-lg flex items-center space-x-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to cart successfully!</span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-neutral-900 hover:bg-[#D4AF37] text-white hover:text-neutral-950 font-semibold text-sm py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => {
                  onToggleWishlist(product);
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-neutral-200 text-neutral-600 hover:text-rose-600 hover:border-rose-200'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onBuyNow(product, quantity, selectedSize);
              }}
              className="w-full bg-[#D4AF37] hover:bg-[#c49f2e] text-neutral-950 font-semibold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Buy Now
            </button>

            <button
              onClick={() => {
                onClose();
                onGoToDetail(product);
              }}
              className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-[#D4AF37] pt-2 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
