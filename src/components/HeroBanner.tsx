import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
}

const slides = [
  {
    id: 1,
    image: '/banner-slide-1.png',
    alt: 'SparklezSiege Luxury Collection Slide 1',
  },
  {
    id: 2,
    image: '/banner-slide-3.png',
    alt: 'SparklezSiege Luxury Collection Slide 2',
  },
  {
    id: 3,
    image: '/banner-slide-2.png',
    alt: 'SparklezSiege Luxury Collection Slide 3',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section 
      className="relative w-full bg-[#001D1E] overflow-hidden group/banner select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Main Stage */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] min-h-[380px] sm:min-h-[480px] h-[55vh] sm:h-[65vh] max-h-[620px] overflow-hidden flex items-end justify-start">
        {/* Slides */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Ambient background blur of the banner image to seamlessly fill frame without harsh empty spaces */}
              <img
                src={slide.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-xl scale-110"
              />

              {/* Foreground main banner image rendered in full proportions without any cropping or text cut-off */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="relative z-10 w-full h-full object-contain object-center"
                referrerPolicy="no-referrer"
              />

              {/* Subtle Gradient Overlays for optimal button & control contrast */}
              <div className="absolute inset-0 z-15 bg-gradient-to-t from-[#001D1E]/90 via-transparent to-[#001D1E]/30 pointer-events-none" />
              <div className="absolute inset-0 z-15 bg-gradient-to-r from-[#001D1E]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Bottom Left Content Container (Shop Button) */}
        <div className="relative z-20 w-full pb-7 px-6 sm:pb-12 sm:px-12 flex flex-col items-start text-left">
          <button
            onClick={onShopNow}
            className="inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-[#FF9F61] to-[#f98239] hover:from-[#f98239] hover:to-[#FF9F61] text-neutral-950 font-bold tracking-widest uppercase text-xs sm:text-sm py-3.5 px-7 sm:py-4 sm:px-9 rounded-none shadow-2xl active:scale-95 transition-all duration-300 border border-[#FF9F61] cursor-pointer group"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-950/40 hover:bg-[#FF9F61] text-white hover:text-neutral-950 border border-white/20 hover:border-[#FF9F61] flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 group-hover/banner:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-950/40 hover:bg-[#FF9F61] text-white hover:text-neutral-950 border border-white/20 hover:border-[#FF9F61] flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 group-hover/banner:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators / Pagination Dots */}
        <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-12 z-20 flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 bg-[#FF9F61]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Decorative Bottom Accent Bar */}
      <div className="w-full h-1 bg-gradient-to-r from-[#FF9F61] via-amber-500 to-transparent" />
    </section>
  );
};




