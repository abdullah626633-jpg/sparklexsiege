import React from 'react';
import { PageType } from '../types';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF9F61] block mb-2">
            Our Heritage & Artisanal Philosophy
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            About SparklezSiege
          </h1>
          <p className="text-base text-neutral-600 font-light mt-4 leading-relaxed">
            Founded with a commitment to uncompromised elegance, SparklezSiege blends master goldsmith tradition with modern, conflict-free luxury.
          </p>
        </div>

        {/* Feature Hero Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-16 border border-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop"
            alt="Artisanal Jewellery Craftsmanship"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="text-xs uppercase tracking-widest text-[#FF9F61] font-semibold">
              The SparklezSiege Atelier
            </span>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-1">
              "Every piece tells a story of brilliance, timelessness, and modern grace."
            </p>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
            <div className="w-12 h-12 bg-[#FF9F61]/10 text-[#FF9F61] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-neutral-900 mb-2">18k Solid Gold</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We exclusively craft our pieces using certified 100% recycled 18k solid gold that will never oxidize, tarnish, or lose its radiant luster.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
            <div className="w-12 h-12 bg-[#FF9F61]/10 text-[#FF9F61] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-neutral-900 mb-2">Ethical Lab Diamonds</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              All our solitaire and pavé diamonds are grown in zero-emission laboratories, sharing the identical optical, physical, and chemical qualities as mined gems.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 text-center">
            <div className="w-12 h-12 bg-[#FF9F61]/10 text-[#FF9F61] rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-neutral-900 mb-2">Lifetime Guarantee</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every SparklezSiege purchase includes complimentary lifetime cleaning, prong inspection, and a warranty against manufacturing defects.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-neutral-900 text-white rounded-3xl p-10 sm:p-14 shadow-2xl">
          <h2 className="font-serif-luxury text-3xl font-bold mb-3">
            Explore The SparklezSiege Collection
          </h2>
          <p className="text-xs text-neutral-300 max-w-lg mx-auto mb-8 font-light leading-relaxed">
            Find the perfect bracelet, bangle, necklace, ring, or earring crafted to elevate your signature personal style.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#FF9F61] hover:bg-[#e88d51] text-neutral-950 font-bold text-sm py-3.5 px-8 rounded-full transition-colors cursor-pointer"
          >
            Shop All Jewellery
          </button>
        </div>
      </div>
    </div>
  );
};
