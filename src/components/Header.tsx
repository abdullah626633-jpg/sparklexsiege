import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { CategoryType, PageType } from '../types';
import { AzadiAnnouncementBar } from './AzadiAnnouncementBar';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenSearch,
  onOpenWishlist,
  onOpenAccount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; path: string; category?: CategoryType }[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Jewellery Sets', path: '/category/jewellery-sets', category: 'jewellery-sets' },
    { label: 'Pendants', path: '/category/pendants', category: 'pendants' },
    { label: 'Earrings', path: '/category/earrings', category: 'earrings' },
    { label: 'Bangles', path: '/category/bangles', category: 'bangles' },
    { label: 'Bracelets', path: '/category/bracelets', category: 'bracelets' },
    { label: 'Rings', path: '/category/rings', category: 'rings' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#002D2F]/95 backdrop-blur-md shadow-xl border-b border-emerald-900/80 text-white'
            : 'bg-[#002D2F] border-b border-emerald-900/60 text-white'
        }`}
      >
        {/* Sticky Azadi Sale Marquee Banner */}
        <AzadiAnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
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
                onClick={() => handleNavClick('/')}
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
                const active = isLinkActive(link.path);
                return (
                  <motion.button
                    key={link.label}
                    whileHover={{ y: -1, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(link.path)}
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
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-[#FF9F61] text-neutral-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                  >
                    {wishlistCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavClick('/cart')}
                className="p-2 text-emerald-100 hover:text-[#FF9F61] transition-all cursor-pointer relative"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-[#FF9F61] text-neutral-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                  >
                    {cartCount}
                  </span>
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
                    const active = isLinkActive(link.path);
                    return (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.path)}
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
                  We Deliver All Over Pakistan &bull; Delivery Charges Rs. 250
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


