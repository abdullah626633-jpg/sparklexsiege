import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Heart, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface NewArrivalsProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) onSelectProduct(product);
    navigate(`/product/${product.slug || product.id}`);
  };

  // Filter for new arrival products or fallback to top products
  const newArrivalsList = products.filter((p) => p.isNew).slice(0, 10);
  const displayProducts = newArrivalsList.length > 0 ? newArrivalsList : products.slice(0, 8);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle scroll to update active dot index
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth + 16 : 240;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), displayProducts.length - 1));
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth + 16 : 240;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < displayProducts.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-[#FAF5F2] border-b border-neutral-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching exact screenshot typography */}
        <div className="flex flex-col items-start justify-between mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#8C7368] block mb-1">
            FEATURED COLLECTION
          </span>
          <div className="flex items-center justify-between w-full">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.12em] text-neutral-900 uppercase">
              NEW ARRIVALS
            </h2>

            {/* Optional Desktop Arrows */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-9 h-9 border border-neutral-300 disabled:opacity-30 hover:border-neutral-900 bg-white text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === displayProducts.length - 1}
                className="w-9 h-9 border border-neutral-300 disabled:opacity-30 hover:border-neutral-900 bg-white text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next product"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Cards Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {displayProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="w-[200px] sm:w-[250px] md:w-[280px] shrink-0 snap-start group flex flex-col justify-between"
              >
                {/* Image Container with Exact 3:4 Portrait Aspect Ratio */}
                <div
                  className="relative aspect-[3/4] bg-neutral-100 overflow-hidden cursor-pointer border border-neutral-200/80 hover:border-neutral-900 transition-colors"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Black NEW IN badge at top left matching reference */}
                  <div className="absolute top-0 left-0 z-10">
                    <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 inline-block">
                      NEW IN
                    </span>
                  </div>

                  {/* Wishlist Button top right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 p-2 z-10 transition-colors ${
                      isWishlisted
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/80 hover:bg-neutral-900 text-neutral-800 hover:text-white border border-neutral-200'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Quick View Hover overlay on Desktop */}
                  {onQuickView && (
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                        }}
                        className="w-full bg-neutral-900/90 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold text-xs uppercase tracking-wider py-2 px-3 border border-neutral-700 hover:border-[#FF9F61] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Meta below image matching screenshot styling */}
                <div className="mt-2.5 px-0.5 flex flex-col cursor-pointer" onClick={() => handleProductClick(product)}>
                  <h3 className="font-serif-luxury text-sm sm:text-base font-normal text-neutral-800 group-hover:text-emerald-900 transition-colors line-clamp-1 leading-snug">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-[#8C7368] tracking-wider uppercase">
                      {product.formattedPrice ? product.formattedPrice : `$${product.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Pagination Bar matching exact screenshot styling */}
        <div className="flex items-center justify-center space-x-1.5 mt-6 sm:mt-8">
          {displayProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 sm:w-8 bg-[#8C7368] rounded-full'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400 rounded-full'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

