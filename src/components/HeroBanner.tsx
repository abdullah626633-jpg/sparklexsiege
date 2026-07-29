import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full bg-[#001D1E] overflow-hidden">
      {/* MOBILE BANNER VIEW (sm:hidden) */}
      <div className="block sm:hidden relative w-full overflow-hidden bg-[#001D1E]">
        <div className="relative w-full aspect-[4/5] min-h-[360px] max-h-[560px] overflow-hidden flex items-end justify-start">
          {/* Mobile Banner Image */}
          <img
            src="/mobile-banner.png"
            alt="SparklezSiege Luxury Jewellery Mobile Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          
          {/* Gradient overlays for crisp text & button legibility on dark luxury background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D1E] via-[#001D1E]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001D1E]/70 via-transparent to-transparent" />

          {/* Banner Content Container - Positioned on Bottom Left */}
          <div className="relative z-10 w-full pb-7 px-6 flex flex-col items-start text-left">
            {/* Shop Button - Rectangular Type (Not Curved) on Bottom Left */}
            <button
              onClick={onShopNow}
              className="inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-[#FF9F61] to-[#f98239] text-neutral-950 font-bold tracking-widest uppercase text-xs py-3.5 px-7 rounded-none shadow-xl active:scale-95 transition-all duration-300 border border-[#FF9F61] cursor-pointer group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP BANNER VIEW (hidden sm:flex) */}
      <div className="hidden sm:flex relative w-full h-[65vh] min-h-[460px] items-end justify-start bg-[#001D1E] overflow-hidden">
        {/* Desktop Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/desktop-banner.jpg"
            alt="SparklezSiege Luxury Jewellery Desktop Banner"
            className="w-full h-full object-cover object-center opacity-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D1E] via-[#001D1E]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001D1E]/70 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 pb-10 pl-10 md:pb-14 md:pl-16 flex flex-col items-start">
          {/* Premium Shop Now Button */}
          <button
            onClick={onShopNow}
            className="inline-flex items-center space-x-3 bg-neutral-900/90 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold tracking-wider uppercase text-xs sm:text-sm px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-2xl hover:shadow-[#FF9F61]/20 transition-all duration-300 border border-[#FF9F61]/60 hover:border-[#FF9F61] backdrop-blur-md cursor-pointer group"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Accent Bottom Line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF9F61] via-emerald-600 to-transparent" />
      </div>
    </section>
  );
};



