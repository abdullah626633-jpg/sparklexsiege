import React, { useState, useMemo } from 'react';
import { Product, CategoryType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal, Search } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCat === 'all' || p.category === selectedCat;
        const matchesQuery =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCat, searchQuery, sortBy]);

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] block mb-2">
            The Complete Collection
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Shop All Jewellery
          </h1>
          <p className="text-sm text-neutral-500 font-light mt-3">
            Handcrafted 18k solid gold, ethical lab diamonds, and freshwater pearls made for every moment.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-neutral-50 rounded-2xl p-4 sm:p-6 mb-10 border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCat('all')}
              className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              All Pieces ({products.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#D4AF37] text-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-56">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shop..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-white border border-neutral-200 rounded-xl py-1.5 px-3 font-medium text-neutral-700 focus:outline-hidden focus:border-[#D4AF37]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-base font-semibold">No products match your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCat('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-[#D4AF37] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
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
