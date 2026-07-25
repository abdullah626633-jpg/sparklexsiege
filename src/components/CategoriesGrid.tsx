import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/products';
import { CategoryType } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesGridProps {
  onSelectCategory: (category: CategoryType) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 block mb-2">
            Curated Categories
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Explore By Category
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-gradient-to-r from-emerald-800 via-[#FF9F61] to-emerald-800 mx-auto mt-4"
          />
        </motion.div>

        {/* Responsive Square Grid Layout for categories */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-neutral-950 border border-neutral-800 hover:border-[#FF9F61] transition-all duration-300 flex flex-col justify-end p-3 sm:p-5 shadow-md"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent group-hover:from-neutral-950/95 transition-colors duration-300" />

              {/* Inner Luxury Square Border Accent */}
              <div className="absolute inset-2 border border-white/10 group-hover:border-[#FF9F61]/40 transition-colors pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 text-white flex items-end justify-between w-full">
                <div className="min-w-0 pr-1">
                  <h3 className="font-serif-luxury text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-[#FF9F61] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-300 font-light mt-0.5 line-clamp-1 opacity-80 group-hover:opacity-100">
                    {cat.description}
                  </p>
                </div>

                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-900/80 group-hover:bg-[#FF9F61] group-hover:text-neutral-950 text-white flex items-center justify-center transition-colors shrink-0 ml-1 border border-white/20 group-hover:border-[#FF9F61]">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

