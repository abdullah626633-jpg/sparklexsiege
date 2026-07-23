import React from 'react';
import { Product } from '../types';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
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
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
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
        <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
          {product.isSale && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-900 font-medium text-xs py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-700" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div onClick={() => onSelect(product)} className="cursor-pointer">
          <div className="flex items-center space-x-1 text-amber-500 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-neutral-700">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>

          <h3 className="font-serif-luxury text-lg font-semibold text-neutral-900 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-1 font-light">
            {product.material}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-neutral-900">
              ${product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-neutral-900 hover:bg-[#D4AF37] text-white hover:text-neutral-950 p-2.5 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
