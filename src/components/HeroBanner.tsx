import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full h-[55vh] sm:h-[75vh] min-h-[380px] sm:min-h-[500px] flex items-center justify-center bg-neutral-950 overflow-hidden">
      {/* Background Hero Image with subtle slow zoom animation */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        {/* Mobile Banner Image */}
        <img
          src="/mobile-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Mobile Banner"
          className="block sm:hidden w-full h-full object-cover object-center transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Desktop Banner Image */}
        <img
          src="/desktop-banner.jpg"
          alt="SparklezSiege Luxury Jewellery Desktop Banner"
          className="hidden sm:block w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-950/25" />
      </motion.div>

      {/* Floating Sparkle Elements */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/5 text-[#FF9F61]/80"
        >
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/3 right-1/4 text-emerald-300/50"
        >
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.div>
      </div>

      {/* Premium Animated Shop Now Button overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center justify-center px-4"
      >
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onShopNow}
          className="animate-shimmer animate-pulse-glow inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 hover:from-white hover:to-white text-white hover:text-emerald-950 font-bold tracking-wider uppercase text-sm sm:text-base px-10 py-4.5 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all cursor-pointer border border-emerald-500/80 hover:border-white group"
        >
          <Sparkles className="w-4 h-4 text-[#FF9F61] group-hover:text-emerald-800 transition-colors" />
          <span>Shop Now</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Bottom Animated Accent Ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg"
      />
    </section>
  );
};

