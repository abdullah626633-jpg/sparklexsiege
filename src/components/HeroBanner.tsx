import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full h-[55vh] sm:h-[75vh] min-h-[380px] sm:min-h-[500px] flex items-end justify-start bg-neutral-950 overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        {/* Mobile Banner Image */}
        <img
          src="/mobile-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Mobile Banner"
          className="block sm:hidden w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Desktop Banner Image */}
        <img
          src="/desktop-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Desktop Banner"
          className="hidden sm:block w-full h-full object-cover object-center opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
      </div>

      {/* Premium Shop Now Button - Positioned at bottom left */}
      <div className="relative z-10 pb-8 pl-6 sm:pb-12 sm:pl-12">
        <button
          onClick={onShopNow}
          className="inline-flex items-center space-x-3 bg-neutral-900/90 hover:bg-[#FF9F61] text-white hover:text-neutral-950 font-bold tracking-wider uppercase text-xs sm:text-sm px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-2xl hover:shadow-[#FF9F61]/20 transition-all duration-300 border border-[#FF9F61]/60 hover:border-[#FF9F61] backdrop-blur-md cursor-pointer group"
        >
          <span>Shop Now</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF9F61] via-emerald-600 to-transparent" />
    </section>
  );
};


