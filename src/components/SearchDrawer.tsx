import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Search, X, ChevronRight } from 'lucide-react';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleProductSelect = (prod: Product) => {
    if (onSelectProduct) onSelectProduct(prod);
    onClose();
    navigate(`/product/${prod.slug || prod.id}`);
  };

  const suggestedTags = ['Jewellery Sets', 'Diamonds', '18k Gold', 'Rings', 'Bangles', 'Pearl'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <span className="font-serif-luxury text-xl font-bold text-neutral-900">
              Search Products
            </span>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="p-5 border-b border-neutral-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (filtered.length > 0) {
                  handleProductSelect(filtered[0]);
                }
              }}
              className="relative"
            >
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewellery, materials, diamonds..."
                className="w-full pl-11 pr-16 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm focus:outline-hidden focus:border-[#FF9F61] focus:bg-white transition-all"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-3.5 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Quick Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs bg-neutral-100 hover:bg-[#FF9F61]/15 hover:text-[#FF9F61] text-neutral-600 px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-5">
            {!query.trim() ? (
              <div className="text-center py-12 text-neutral-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#FF9F61]" />
                <p className="text-sm">Type above to search our luxury jewellery collection.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p className="text-sm font-medium">No products found for "{query}"</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try searching for rings, bangles, gold, or diamonds.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Results ({filtered.length})
                </p>
                {filtered.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleProductSelect(prod)}
                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-100 transition-all group"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-16 h-16 object-cover rounded-xl bg-neutral-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif-luxury text-base font-semibold text-neutral-900 group-hover:text-[#FF9F61] transition-colors truncate">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-500 capitalize">{prod.category}</p>
                      <div className="flex items-baseline space-x-2 mt-0.5">
                        <span className="text-sm font-bold text-neutral-900">
                          Rs. {prod.price.toLocaleString()}
                        </span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            Rs. {prod.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#FF9F61] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

