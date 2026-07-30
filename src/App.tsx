import React, { useState, useEffect } from 'react';
import { PageType, CategoryType, Product, CartItem } from './types';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('pendants');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);

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

  // Scroll to top on page navigate
  const navigateTo = (page: PageType, category?: CategoryType, product?: Product) => {
    if (category) setSelectedCategory(category);
    if (product) setSelectedProduct(product);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Actions
  const handleAddToCart = (product: Product, quantity: number = 1, size?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedSize: size }];
    });
  };

  const handleBuyNow = (product: Product, quantity: number = 1, size?: string) => {
    handleAddToCart(product, quantity, size);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string, selectedSize?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
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
      {/* Top Header */}
      <Header
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        onNavigate={(page, category) => navigateTo(page, category)}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HOMEPAGE */}
        {currentPage === 'home' && (
          <div>
            <HeroBanner onShopNow={() => navigateTo('shop')} />
            <NewArrivals
              products={PRODUCTS}
              onSelectProduct={(product) => navigateTo('product', undefined, product)}
              onQuickView={(product) => setQuickViewProduct(product)}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />
            <CategoriesGrid
              onSelectCategory={(category) => navigateTo('category', category)}
            />
          </div>
        )}

        {/* SHOP ALL PRODUCTS PAGE */}
        {currentPage === 'shop' && (
          <ShopPage
            products={PRODUCTS}
            onSelectProduct={(product) => navigateTo('product', undefined, product)}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {/* CATEGORY PAGE */}
        {currentPage === 'category' && (
          <CategoryPage
            category={selectedCategory}
            products={PRODUCTS}
            onSelectProduct={(product) => navigateTo('product', undefined, product)}
            onQuickView={(product) => setQuickViewProduct(product)}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {/* PRODUCT DETAIL PAGE */}
        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={PRODUCTS}
            onSelectProduct={(prod) => navigateTo('product', undefined, prod)}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            wishlistIds={wishlistIds}
          />
        )}

        {/* CART PAGE */}
        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onNavigate={(page) => navigateTo(page)}
          />
        )}

        {/* CHECKOUT PAGE */}
        {currentPage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onClearCart={handleClearCart}
            onNavigate={(page) => navigateTo(page)}
          />
        )}

        {/* ABOUT US PAGE */}
        {currentPage === 'about' && (
          <AboutPage onNavigate={(page) => navigateTo(page)} />
        )}

        {/* CONTACT US PAGE */}
        {currentPage === 'contact' && <ContactPage />}

        {/* PRIVACY POLICY PAGE */}
        {currentPage === 'privacy' && <PrivacyPage />}

        {/* TERMS & CONDITIONS PAGE */}
        {currentPage === 'terms' && <TermsPage />}

        {/* EXCHANGE POLICY PAGE */}
        {currentPage === 'exchange' && <ExchangePolicyPage />}
      </main>

      {/* Minimal Footer */}
      <Footer onNavigate={(page) => navigateTo(page)} />

      {/* Overlays / Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onGoToDetail={(prod) => navigateTo('product', undefined, prod)}
      />

      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(prod) => navigateTo('product', undefined, prod)}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onSelectProduct={(prod) => navigateTo('product', undefined, prod)}
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
