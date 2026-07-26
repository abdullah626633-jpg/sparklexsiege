import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/products';
import { CategoryType } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategoriesGridProps {
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORY_TAGS: Record<string, string> = {
  'jewellery-sets': 'HANDCRAFTED',
  'earrings': 'ARTISAN',
  'studs': 'MINIMALIST',
  'bangles': 'EMBROIDERED',
  'bracelets': 'LUXURY',
  'pendants': 'FINE CRAFT',
  'rings': 'TIMELESS',
};

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-12 sm:py-20 bg-[#FAF5F2] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching exact screenshot typography */}
        <div className="text-left mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8C7368] block mb-1">
            OUR COLLECTIONS
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-wide">
            Shop by <span className="italic font-normal font-serif">Category</span>
          </h2>
        </div>

        {/* 2-Column Portrait Grid Layout matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const eyebrow = CATEGORY_TAGS[cat.id] || 'EXCLUSIVE';
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-4 sm:p-6 text-center bg-neutral-900 border border-neutral-200/40"
              >
                {/* Category Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay for optimal contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-300" />

                {/* Card Content Centered Vertically / Bottom Aligned */}
                <div className="relative z-10 flex flex-col items-center justify-end h-full text-white space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.25em] text-white/80">
                    {eyebrow}
                  </span>

                  <h3 className="font-serif-luxury text-base sm:text-xl md:text-2xl font-normal text-white leading-snug tracking-wide">
                    {cat.name}
                  </h3>

                  <div className="mt-2.5 sm:mt-3 inline-flex items-center space-x-1 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/60 bg-black/20 backdrop-blur-xs text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-white uppercase group-hover:bg-white group-hover:text-neutral-950 transition-all duration-300">
                    <span>EXPLORE</span>
                    <ChevronRight className="w-3 h-3 text-white group-hover:text-neutral-950 transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


