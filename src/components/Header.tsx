import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CategoryType, PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  selectedCategory?: CategoryType;
  onNavigate: (page: PageType, category?: CategoryType) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  selectedCategory,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenSearch,
  onOpenWishlist,
  onOpenAccount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageType; category?: CategoryType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Jewellery Sets', page: 'category', category: 'jewellery-sets' },
    { label: 'Earrings', page: 'category', category: 'earrings' },
    { label: 'Bangles', page: 'category', category: 'bangles' },
    { label: 'Bracelets', page: 'category', category: 'bracelets' },
    { label: 'Necklaces', page: 'category', category: 'necklaces' },
    { label: 'Rings', page: 'category', category: 'rings' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageType, category?: CategoryType) => {
    onNavigate(page, category);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (page: PageType, category?: CategoryType) => {
    if (page === 'category' && category) {
      return currentPage === 'category' && selectedCategory === category;
    }
    if (page === 'home') return currentPage === 'home';
    if (page === 'shop') return currentPage === 'shop';
    if (page === 'contact') return currentPage === 'contact';
    return false;
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#001D1E] via-[#003B3E] to-[#001D1E] text-[#FF9F61] text-[11px] sm:text-xs py-1.5 px-4 text-center border-b border-[#FF9F61]/30 font-medium tracking-wider uppercase overflow-hidden relative">
        <div className="inline-flex items-center space-x-2">
          <Sparkles className="w-3 h-3 text-[#FF9F61]" />
          <span>SparklezSiege Fine Jewellery &bull; Free Express Delivery &bull; 100% Handcrafted Elegance</span>
          <Sparkles className="w-3 h-3 text-[#FF9F61]" />
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#002D2F]/95 backdrop-blur-md shadow-xl py-2.5 border-b border-emerald-900/80 text-white'
            : 'bg-[#002D2F] py-3 border-b border-emerald-900/60 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-emerald-100 hover:text-white focus:outline-hidden transition-all duration-200 cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick('home')}
                className="group inline-flex items-center space-x-3 focus:outline-hidden cursor-pointer"
              >
                <img
                  src="/logo.jpg"
                  alt="SparklezSiege Luxury Jewellery"
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300"
                />
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const active = isLinkActive(link.page, link.category);
                return (
                  <motion.button
                    key={link.label}
                    whileHover={{ y: -1, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(link.page, link.category)}
                    className={`text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer relative py-1 ${
                      active
                        ? 'text-white font-bold'
                        : 'text-emerald-100/90 hover:text-[#FF9F61]'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF9F61] to-emerald-400 rounded-full shadow-xs"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Action Icons (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenSearch}
                className="p-2 text-emerald-100 hover:text-[#FF9F61] transition-all cursor-pointer"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenAccount}
                className="p-2 text-emerald-100 hover:text-[#FF9F61] transition-all cursor-pointer"
                title="Account"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenWishlist}
                className="p-2 text-emerald-100 hover:text-[#FF9F61] transition-all cursor-pointer relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#FF9F61] text-neutral-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavClick('cart')}
                className="p-2 text-emerald-100 hover:text-[#FF9F61] transition-all cursor-pointer relative"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-[#FF9F61] text-neutral-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#002D2F] shadow-2xl flex flex-col z-50 text-white border-r border-emerald-900"
            >
              <div className="p-5 border-b border-emerald-900/80 flex items-center justify-between">
                <img
                  src="/logo.jpg"
                  alt="SparklezSiege"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-emerald-200 hover:text-white focus:outline-hidden transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-5">
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link) => {
                    const active = isLinkActive(link.page, link.category);
                    return (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.page, link.category)}
                        className={`flex items-center justify-between py-3 px-3 text-base font-medium rounded-lg transition-all duration-200 text-left ${
                          active
                            ? 'bg-emerald-900 text-white font-bold border border-white/30'
                            : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-300" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-900/80 flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount();
                    }}
                    className="flex items-center space-x-3 text-sm font-medium text-emerald-100 py-2.5 px-3 rounded-lg hover:bg-emerald-900/50 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5 text-emerald-300" />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWishlist();
                    }}
                    className="flex items-center space-x-3 text-sm font-medium text-emerald-100 py-2.5 px-3 rounded-lg hover:bg-emerald-900/50 hover:text-white transition-colors"
                  >
                    <Heart className="w-5 h-5 text-emerald-300" />
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                </div>
              </div>

              <div className="p-5 border-t border-emerald-900/80 bg-[#011e17]">
                <p className="text-xs text-emerald-200/80 text-center font-light">
                  Free Express Shipping on Orders Over Rs. 5,000
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

