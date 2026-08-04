import React from 'react';

export const AzadiAnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#01411C] text-white py-2 overflow-hidden border-b border-emerald-900/80 shadow-xs relative z-50">
      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee-continuous flex items-center space-x-8 whitespace-nowrap text-xs sm:text-sm font-bold tracking-wider uppercase">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center space-x-2.5">
              <span>🇵🇰</span>
              <span className="text-white font-extrabold">AZADI SALE</span>
              <span className="text-[#FF9F61]">&bull;</span>
              <span className="text-emerald-200 font-bold">FLAT 14% OFF ON ALL PRODUCTS</span>
              <span className="text-[#FF9F61]">&bull;</span>
              <span className="text-white font-semibold">LIMITED TIME OFFER</span>
              <span className="text-[#FF9F61]">&bull;</span>
              <span className="text-[#FF9F61] font-bold underline underline-offset-2">SHOP NOW</span>
              <span>🇵🇰</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
