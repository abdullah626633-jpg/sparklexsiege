import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
      {/* Background Hero Image with luxury dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop"
          alt="SparklezSiege Luxury Jewellery Lifestyle"
          className="w-full h-full object-cover object-center opacity-70 transform scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-900/50 to-neutral-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white">
            Fine Jewellery Collection 2026
          </span>
        </div>

        <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Timeless Jewellery Crafted For Every Occasion
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-200 text-base sm:text-lg font-light leading-relaxed mb-8">
          Discover hand-finished 18k solid gold, conflict-free certified lab diamonds, and organic freshwater pearls designed to shine for a lifetime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onShopNow}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-[#D4AF37] hover:bg-[#c49f2e] text-neutral-950 font-semibold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Shop Collection</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtle Bottom Accent Ribbon */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
    </section>
  );
};
