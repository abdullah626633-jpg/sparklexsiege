import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Heart, X, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleProductSelect = (prod: Product) => {
    if (onSelectProduct) onSelectProduct(prod);
    onClose();
    navigate(`/product/${prod.slug || prod.id}`);
  };

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
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#FF9F61] fill-current" />
              <span className="font-serif-luxury text-xl font-bold text-neutral-900">
                My Wishlist ({wishlistProducts.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#FF9F61]" />
                <p className="text-base font-semibold text-neutral-800">Your wishlist is empty</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Explore our timeless jewellery collection and save your favorite pieces here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center space-x-4 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      onClick={() => handleProductSelect(prod)}
                      className="w-20 h-20 object-cover rounded-xl bg-white cursor-pointer"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => handleProductSelect(prod)}
                        className="font-serif-luxury text-base font-semibold text-neutral-900 hover:text-[#FF9F61] cursor-pointer truncate"
                      >
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-500 capitalize mt-0.5">{prod.category}</p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-sm font-bold text-neutral-900">
                          Rs. {prod.price.toLocaleString()}
                        </span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            Rs. {prod.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="bg-neutral-900 hover:bg-[#FF9F61] text-white hover:text-neutral-950 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => onRemoveFromWishlist(prod)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove from Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

