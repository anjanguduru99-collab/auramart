import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ToastAlert from './components/ToastAlert';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {currentPage === 'shop' && (
          <Shop 
            initialCategory={pageParams.category || 'all'} 
            initialSearch={pageParams.search || ''} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'product' && (
          <ProductDetail 
            productId={pageParams.productId} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'orderSuccess' && (
          <OrderSuccessPage 
            orderId={pageParams.orderId} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'dashboard' && (
          <UserDashboardPage 
            initialTab={pageParams.tab || 'orders'} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}
      </main>

      <CartDrawer onNavigate={handleNavigate} />
      <ToastAlert />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
