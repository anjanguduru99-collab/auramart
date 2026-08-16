import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headphones, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-500">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">256-Bit SSL Checkout</h4>
              <p className="text-xs text-slate-500">Bank-level encrypted payment</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-slate-500">Hassle-free instant refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">24/7 Concierge Support</h4>
              <p className="text-xs text-slate-500">Dedicated live agent assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black gradient-text">AuraMart</span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm">
            AuraMart is the next-generation e-commerce marketplace delivering premium lifestyle, gaming, tech, and fashion products worldwide with ultra-fast delivery.
          </p>

          {/* Newsletter Box */}
          <div className="pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subscribe to VIP Secret Deals</h5>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're subscribed! Check your inbox for 15% off code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
                  required
                />
                <button type="submit" className="btn btn-primary text-xs py-2.5 px-4 shrink-0">
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Column 1: Shop Categories */}
        <div>
          <h5 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Shop Categories</h5>
          <ul className="space-y-2.5 text-xs font-medium text-slate-500">
            <li><button onClick={() => onNavigate('shop', { category: 'electronics' })} className="hover:text-indigo-500 transition-colors">Electronics & Tech</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'fashion' })} className="hover:text-indigo-500 transition-colors">Apparel & Fashion</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'home' })} className="hover:text-indigo-500 transition-colors">Home & Living</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'gaming' })} className="hover:text-indigo-500 transition-colors">Gaming Gear</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'fitness' })} className="hover:text-indigo-500 transition-colors">Fitness & Sports</button></li>
          </ul>
        </div>

        {/* Column 2: Customer Account */}
        <div>
          <h5 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Customer Care</h5>
          <ul className="space-y-2.5 text-xs font-medium text-slate-500">
            <li><button onClick={() => onNavigate('dashboard', { tab: 'orders' })} className="hover:text-indigo-500 transition-colors">Order Tracking</button></li>
            <li><button onClick={() => onNavigate('dashboard', { tab: 'wishlist' })} className="hover:text-indigo-500 transition-colors">My Wishlist</button></li>
            <li><button onClick={() => onNavigate('cart')} className="hover:text-indigo-500 transition-colors">Shopping Cart</button></li>
            <li><span className="hover:text-indigo-500 cursor-pointer">Shipping & Customs</span></li>
            <li><span className="hover:text-indigo-500 cursor-pointer">Returns & Exchanges</span></li>
          </ul>
        </div>

        {/* Column 3: Seller & Platform */}
        <div>
          <h5 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Aura Platform</h5>
          <ul className="space-y-2.5 text-xs font-medium text-slate-500">
            <li><button onClick={() => onNavigate('admin')} className="hover:text-indigo-500 transition-colors">Seller Dashboard</button></li>
            <li><span className="hover:text-indigo-500 cursor-pointer">Sell on AuraMart</span></li>
            <li><span className="hover:text-indigo-500 cursor-pointer">Affiliate Partner Program</span></li>
            <li><span className="hover:text-indigo-500 cursor-pointer">Privacy Policy & Terms</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between container mx-auto px-4 gap-4">
        <p>© 2026 AuraMart Inc. All rights reserved. Designed for next-gen e-commerce.</p>
        <div className="flex items-center gap-3 font-semibold text-slate-400">
          <span>VISA</span> • <span>Mastercard</span> • <span>Apple Pay</span> • <span>PayPal</span> • <span>Stripe</span>
        </div>
      </div>
    </footer>
  );
}
