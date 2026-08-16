import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Heart, Moon, Sun, Shield, 
  Menu, X, Sparkles, ChevronDown, PackageCheck, Zap 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { fetchProducts } from '../services/api';

export default function Navbar({ onNavigate, currentPage }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { totalItemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdminMode, toggleAdminMode } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetchProducts({ search: searchQuery, limit: 5 });
          setSuggestions(res.products);
          setShowSuggestions(true);
        } catch (err) {
          console.error(err);
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onNavigate('shop', { search: searchQuery });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 animate-bounce text-yellow-300 shrink-0" />
        <span>FLASH SALE: Extra 20% OFF all tech & lifestyle gear! Use promo code <strong className="bg-white/20 px-2 py-0.5 rounded text-yellow-200">AURA20</strong></span>
      </div>

      {/* Main Nav Row */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-6 shrink-0">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 group text-left outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight gradient-text leading-none">AuraMart</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 leading-none">PRO</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 hidden lg:block mt-1">Next-Gen E-Commerce</p>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden xl:flex items-center gap-2">
            <button 
              onClick={() => onNavigate('home')} 
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${currentPage === 'home' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-indigo-400'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('shop')} 
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${currentPage === 'shop' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-indigo-400'}`}
            >
              Shop Catalog
            </button>
          </nav>
        </div>

        {/* Center: Dedicated Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search 1,000+ products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              className="w-full pl-11 pr-28 py-2.5 text-xs font-medium rounded-full bg-slate-900/90 text-white border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span>Search</span>
            </button>
          </form>

          {/* Predictive Search Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 glass-panel p-2 shadow-2xl z-50 animate-fade-in border border-slate-800 bg-slate-950/95 rounded-2xl overflow-hidden text-left">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Products Match
              </div>
              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
                {suggestions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery('');
                      onNavigate('product', { productId: item.id });
                    }}
                    className="w-full text-left p-2.5 hover:bg-indigo-500/10 transition-colors flex items-center gap-3 rounded-xl cursor-pointer"
                  >
                    <img src={item.images[0]} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{item.category} • <strong className="text-indigo-400">${item.price.toFixed(2)}</strong></p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin Mode Switcher */}
          <button
            onClick={toggleAdminMode}
            title={isAdminMode ? "Switch to Customer Mode" : "Switch to Admin/Seller Dashboard"}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isAdminMode 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' 
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-amber-500/50 hover:text-amber-400'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isAdminMode ? 'Admin Portal' : 'Seller Mode'}</span>
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => onNavigate('dashboard', { tab: 'wishlist' })}
            className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Cart</span>
            <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-[11px] font-black flex items-center justify-center">
              {totalItemCount}
            </span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 object-cover" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Account Popover Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 glass-panel p-2 shadow-2xl z-50 animate-fade-in bg-slate-950 border border-slate-800 rounded-2xl text-left">
                <div className="p-3 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard', { tab: 'orders' }); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 text-indigo-400" />
                    My Orders & Tracking
                  </button>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); onNavigate('dashboard', { tab: 'wishlist' }); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    Saved Wishlist
                  </button>
                  {isAdminMode && (
                    <button
                      onClick={() => { setIsUserMenuOpen(false); onNavigate('admin'); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Seller Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 p-4 space-y-4 animate-fade-in bg-slate-950">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 text-xs rounded-full bg-slate-900 text-white border border-slate-700 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <button type="submit" className="absolute right-1 text-xs font-bold px-3 py-1 bg-indigo-600 text-white rounded-full">
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }} className="p-2.5 rounded-xl bg-slate-900 text-left">Home</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop'); }} className="p-2.5 rounded-xl bg-slate-900 text-left">Shop All</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop', { category: 'electronics' }); }} className="p-2.5 rounded-xl bg-slate-900 text-left">Electronics</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop', { category: 'fashion' }); }} className="p-2.5 rounded-xl bg-slate-900 text-left">Fashion</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('dashboard'); }} className="p-2.5 rounded-xl bg-slate-900 text-left col-span-2">My Account & Orders</button>
          </div>
        </div>
      )}
    </header>
  );
}
