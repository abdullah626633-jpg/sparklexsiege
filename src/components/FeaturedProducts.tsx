import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onViewAllShop: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onViewAllShop,
}) => {
  // Take exactly 8 featured products
  const featuredList = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2 block">
              Signature Pieces
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              Featured Jewellery
            </h2>
          </div>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.96 }}
            onClick={onViewAllShop}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-neutral-900 hover:text-emerald-800 transition-colors group cursor-pointer border-b border-emerald-900/20 hover:border-emerald-800 pb-0.5"
          >
            <span>View All Shop</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Grid of 8 products (2 columns on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

