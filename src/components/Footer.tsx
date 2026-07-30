import React from 'react';
import { PageType } from '../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#002D2F] text-emerald-100 border-t border-emerald-900/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Logo & Copyright */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <img
            src="/logo.jpg"
            alt="SparklezSiege Jewellery"
            className="h-12 sm:h-14 w-auto object-contain mb-2"
          />
          <p className="text-xs text-emerald-200/80 mt-1">
            © {new Date().getFullYear()} SparklezSiege Jewellery. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <button
            onClick={() => onNavigate('shop')}
            className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer font-medium"
          >
            Shop
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer font-medium"
          >
            Contact
          </button>
          <button
            onClick={() => onNavigate('exchange')}
            className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer font-medium text-[#FF9F61]"
          >
            Exchange & Return Policy
          </button>
          <button
            onClick={() => onNavigate('privacy')}
            className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer font-medium"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigate('terms')}
            className="hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer font-medium"
          >
            Terms & Conditions
          </button>
        </nav>

        {/* Social Icons (Instagram, Facebook, TikTok, Pinterest) */}
        <div className="flex items-center space-x-5 text-emerald-200">
          <a
            href="https://www.instagram.com/sparklezsiege?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all duration-200 hover:scale-125 p-1"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all duration-200 hover:scale-125 p-1"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@sparklezsiege_?_r=1&_t=ZS-98Rob2rTsqz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all duration-200 hover:scale-125 p-1"
            aria-label="TikTok"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.28c.01 1.59-.44 3.18-1.34 4.5-1.3 1.9-3.56 3.03-5.88 2.94-2.52-.06-4.82-1.42-5.99-3.61-1.17-2.19-1.04-4.88.33-6.94 1.25-1.89 3.42-3 5.68-2.9 1.1.03 2.19.34 3.14.9v4.11c-.53-.33-1.15-.52-1.78-.54-1.22-.05-2.42.53-3.02 1.58-.6 1.05-.48 2.37.28 3.3.77.92 2.05 1.3 3.22 1.02.99-.24 1.83-.98 2.18-1.95.14-.38.22-.79.22-1.2V.02z"/>
            </svg>
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all duration-200 hover:scale-125 p-1"
            aria-label="Pinterest"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};
