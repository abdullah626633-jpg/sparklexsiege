import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] min-h-[400px] flex items-center justify-center bg-neutral-900 overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        {/* Mobile Banner Image */}
        <img
          src="/mobile-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Lifestyle Mobile"
          className="block sm:hidden w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Desktop Banner Image */}
        <img
          src="/desktop-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Lifestyle Desktop"
          className="hidden sm:block w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-950/20" />
      </div>

      {/* Premium Shop Now Button overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <button
          onClick={onShopNow}
          className="inline-flex items-center space-x-3 bg-emerald-800 hover:bg-white text-white hover:text-emerald-950 font-bold tracking-wider uppercase text-sm sm:text-base px-10 py-4.5 rounded-full shadow-2xl hover:shadow-white/20 transition-all transform hover:-translate-y-1 hover:scale-105 cursor-pointer border border-emerald-600/80 hover:border-white"
        >
          <span>Shop Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Accent Ribbon */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
    </section>
  );
};
