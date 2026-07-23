import React from 'react';
import { Product, CategoryType } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface CategoryPageProps {
  category: CategoryType;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const categoryProducts = products.filter((p) => p.category === category);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Banner */}
      <div className="relative h-72 sm:h-96 w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
        <img
          src={categoryInfo.image}
          alt={categoryInfo.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60 sm:opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent" />

        <div className="relative z-10 text-center max-w-2xl px-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
            SparklezSiege Collection
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-white tracking-tight">
            {categoryInfo.name}
          </h1>
          <p className="text-sm text-neutral-200 font-light mt-3 max-w-lg mx-auto">
            {categoryInfo.description}
          </p>
        </div>
      </div>

      {/* Category Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Showing {categoryProducts.length} Pieces
          </span>
          <span className="text-xs text-neutral-400">
            All items hand-finished in 18k solid gold & certified diamonds
          </span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-base font-semibold">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {categoryProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(prod.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
