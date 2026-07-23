import React, { useState, useEffect } from 'react';
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
    { label: 'Bracelets', page: 'category', category: 'bracelets' },
    { label: 'Bangles', page: 'category', category: 'bangles' },
    { label: 'Necklaces', page: 'category', category: 'necklaces' },
    { label: 'Rings', page: 'category', category: 'rings' },
    { label: 'Earrings', page: 'category', category: 'earrings' },
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
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3 border-b border-neutral-100'
            : 'bg-white py-4 border-b border-neutral-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-800 hover:text-[#D4AF37] focus:outline-hidden transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <button
                onClick={() => handleNavClick('home')}
                className="group inline-flex items-center space-x-2 focus:outline-hidden cursor-pointer"
              >
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 group-hover:text-[#D4AF37] transition-colors">
                  SparklezSiege
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold border-l border-[#D4AF37]/30 pl-2">
                  Luxury
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const active = isLinkActive(link.page, link.category);
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.page, link.category)}
                    className={`text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer relative py-1 ${
                      active
                        ? 'text-[#D4AF37] font-semibold'
                        : 'text-neutral-700 hover:text-[#D4AF37]'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Icons (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <button
                onClick={onOpenSearch}
                className="p-2 text-neutral-700 hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenAccount}
                className="p-2 text-neutral-700 hover:text-[#D4AF37] transition-colors cursor-pointer"
                title="Account"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenWishlist}
                className="p-2 text-neutral-700 hover:text-[#D4AF37] transition-colors cursor-pointer relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('cart')}
                className="p-2 text-neutral-700 hover:text-[#D4AF37] transition-colors cursor-pointer relative"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-50">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-neutral-900">
                SparklezSiege
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-900 focus:outline-hidden"
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
                      className={`flex items-center justify-between py-3 px-3 text-base font-medium rounded-lg transition-colors text-left ${
                        active
                          ? 'bg-amber-50 text-[#D4AF37] font-semibold'
                          : 'text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="flex items-center space-x-3 text-sm font-medium text-neutral-700 py-2.5 px-3 rounded-lg hover:bg-neutral-50"
                >
                  <User className="w-5 h-5 text-neutral-500" />
                  <span>My Account</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenWishlist();
                  }}
                  className="flex items-center space-x-3 text-sm font-medium text-neutral-700 py-2.5 px-3 rounded-lg hover:bg-neutral-50"
                >
                  <Heart className="w-5 h-5 text-neutral-500" />
                  <span>Wishlist ({wishlistCount})</span>
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50">
              <p className="text-xs text-neutral-500 text-center">
                Free Worldwide Express Shipping on Orders Over $250
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
