import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100/80 shadow-xs hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        {/* Animated Light Shimmer Beam on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 pointer-events-none" />

        {/* Primary Image */}
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
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
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col space-y-1 z-10">
          {product.isSale && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center space-x-0.5"
            >
              <span>Sale</span>
            </motion.span>
          )}
          {product.isNew && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-900 text-emerald-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs border border-emerald-700/50 flex items-center space-x-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#FF9F61] animate-pulse" />
              <span>New</span>
            </motion.span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:top-3 sm:right-3 sm:p-2.5 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-neutral-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Hover Quick View Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:flex items-center gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-md hover:bg-emerald-900 hover:text-white text-neutral-900 font-medium text-xs py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div onClick={() => onSelect(product)} className="cursor-pointer">
          <div className="flex items-center space-x-1 text-[#FF9F61] text-[11px] sm:text-xs mb-1">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            <span className="font-semibold text-neutral-700">{product.rating.toFixed(1)}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>

          <h3 className="font-serif-luxury text-sm sm:text-base md:text-lg font-semibold text-neutral-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-neutral-500 mt-0.5 sm:mt-1 line-clamp-1 font-light">
            {product.material}
          </p>
        </div>

        <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-wrap items-baseline gap-x-1">
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

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => onAddToCart(product)}
            className="bg-emerald-900 hover:bg-emerald-950 text-white border border-transparent hover:border-emerald-700 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer shadow-xs flex items-center justify-center shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

