import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Product, CartItem } from './types';
import { PRODUCTS } from './data/products';

// Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchDrawer } from './components/SearchDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { WhatsAppButton } from './components/WhatsAppButton';

// Home Components
import { HeroBanner } from './components/HeroBanner';
import { NewArrivals } from './components/NewArrivals';
import { CategoriesGrid } from './components/CategoriesGrid';

// Pages
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ExchangePolicyPage } from './pages/ExchangePolicyPage';
import { trackAddToCart } from './utils/metaPixel';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  // Cart State (stored in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sparklezsiege_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (stored in localStorage)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sparklezsiege_wishlist');
      return saved ? JSON.parse(saved) : ['prod-diamond-cut-bangles-pair', 'prod-3'];
    } catch {
      return ['prod-diamond-cut-bangles-pair', 'prod-3'];
    }
  });

  // Overlay Modals State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sparklezsiege_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('sparklezsiege_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Cart Actions
  const handleAddToCart = (product: Product, quantity: number = 1, size?: string, color?: string) => {
    const chosenSize = size || (product.sizes ? product.sizes[0] : undefined);
    const chosenColor = color || (product.colors ? product.colors[0] : undefined);

    trackAddToCart(product, quantity);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedSize: chosenSize, selectedColor: chosenColor }];
    });
  };

  const handleBuyNow = (product: Product, quantity: number = 1, size?: string, color?: string) => {
    handleAddToCart(product, quantity, size, color);
  };

  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Actions
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-[#FF9F61]/20">
      <Helmet defaultTitle="Sparklez Siege | Premium Artificial Jewellery Pakistan" titleTemplate="%s | Sparklez Siege">
        <title>Sparklez Siege | Premium Artificial Jewellery & Accessories</title>
        <meta name="description" content="Shop exquisite artificial jewellery, bangles, bridal sets, rings, pendants, and earrings at Sparklez Siege. High quality finish with cash on delivery across Pakistan." />
        <meta name="keywords" content="Sparklez Siege, artificial jewellery Pakistan, bangles, bridal jewellery, rings, earrings, pendants, jewellery sets online" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sparklez Siege" />
        <meta property="og:title" content="Sparklez Siege | Premium Artificial Jewellery Pakistan" />
        <meta property="og:description" content="Shop exquisite artificial jewellery, bangles, bridal sets, rings, pendants, and earrings at Sparklez Siege." />
        <meta property="og:image" content="https://sparkleziege.shop/logo.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sparklez Siege | Premium Artificial Jewellery Pakistan" />
        <meta name="twitter:description" content="Shop exquisite artificial jewellery, bangles, bridal sets, rings, pendants, and earrings at Sparklez Siege." />
        <meta name="twitter:image" content="https://sparkleziege.shop/logo.jpg" />
      </Helmet>

      <ScrollToTop />

      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          {/* HOMEPAGE */}
          <Route
            path="/"
            element={
              <div>
                <HeroBanner />
                <NewArrivals
                  products={PRODUCTS}
                  onQuickView={(product) => setQuickViewProduct(product)}
                  onAddToCart={(product) => handleAddToCart(product, 1)}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                />
                <CategoriesGrid />
              </div>
            }
          />

          {/* SHOP ALL PRODUCTS PAGE */}
          <Route
            path="/shop"
            element={
              <ShopPage
                products={PRODUCTS}
                onQuickView={(product) => setQuickViewProduct(product)}
                onAddToCart={(product) => handleAddToCart(product, 1)}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            }
          />

          {/* CATEGORY PAGE */}
          <Route
            path="/category/:categoryId"
            element={
              <CategoryPage
                products={PRODUCTS}
                onQuickView={(product) => setQuickViewProduct(product)}
                onAddToCart={(product) => handleAddToCart(product, 1)}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            }
          />

          {/* PRODUCT DETAIL PAGE */}
          <Route
            path="/product/:slugOrId"
            element={
              <ProductDetailPage
                allProducts={PRODUCTS}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            }
          />

          {/* CART PAGE */}
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
              />
            }
          />

          {/* CHECKOUT PAGE */}
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                onClearCart={handleClearCart}
              />
            }
          />

          {/* ABOUT US PAGE */}
          <Route path="/about" element={<AboutPage />} />

          {/* CONTACT US PAGE */}
          <Route path="/contact" element={<ContactPage />} />

          {/* PRIVACY POLICY PAGE */}
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* TERMS & CONDITIONS PAGE */}
          <Route path="/terms" element={<TermsPage />} />

          {/* EXCHANGE POLICY PAGE */}
          <Route path="/exchange" element={<ExchangePolicyPage />} />

          {/* FALLBACK CATCH-ALL ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Overlays / Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
      />

      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />

      {/* Floating Bottom-Left WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
