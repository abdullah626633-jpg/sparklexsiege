import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (onSelect) onSelect(product);
    navigate(`/product/${product.slug || product.id}`);
  };

  return (
    <div
      className="group relative bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden cursor-pointer" onClick={handleProductClick}>
        {/* Subtle hover gradient tint */}
        <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 transition-colors duration-300 z-1 pointer-events-none" />

        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Optional Secondary Hover Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badges */}
        {product.isSale && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-xs inline-block">
              Sale
            </span>
          </div>
        )}

        {/* Top Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 sm:top-3 sm:right-3 sm:p-2.5 transition-all z-10 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-600 text-white'
              : 'bg-white/90 text-neutral-800 hover:bg-neutral-900 hover:text-white border border-neutral-200'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:flex items-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-neutral-900/90 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs uppercase tracking-wider py-2.5 px-3 border border-neutral-700 hover:border-[#FF9F61] shadow-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white border-t border-neutral-100">
        <div onClick={handleProductClick} className="cursor-pointer">
          <div className="flex items-center space-x-1 text-[#FF9F61] text-[11px] sm:text-xs mb-1">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="font-semibold text-neutral-800">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>

          <h3 className="font-serif-luxury text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-neutral-500 mt-1 line-clamp-1 font-light tracking-wide uppercase">
            {product.material}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-sm sm:text-base font-bold text-neutral-900">
              {product.formattedPrice ? product.formattedPrice : `$${product.price.toLocaleString()}`}
            </span>
            {product.priceSubtitle && (
              <span className="text-[10px] sm:text-xs font-normal text-neutral-500">
                {product.priceSubtitle}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 p-2.5 transition-colors cursor-pointer border border-neutral-900 hover:border-[#FF9F61] flex items-center justify-center shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


