import React from 'react';
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
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 block mb-2">
            Curated Categories
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Explore By Category
          </h2>
          <div className="w-12 h-0.5 bg-emerald-700 mx-auto mt-4" />
        </div>

        {/* Responsive Grid Layout for 5 categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-emerald-900/10"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-neutral-900/20 to-transparent group-hover:from-emerald-950/95 transition-colors duration-300" />

              {/* Content */}
              <div className="relative z-10 text-white flex items-end justify-between w-full">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-emerald-100/90 font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-emerald-900/60 backdrop-blur-md group-hover:bg-white group-hover:text-emerald-950 text-white flex items-center justify-center transition-all duration-300 shrink-0 ml-2 shadow-lg group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 transform group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
