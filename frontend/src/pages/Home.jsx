import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import ProductQuickViewModal from '../components/ProductQuickViewModal';
import { fetchCategories, fetchFeaturedProducts, fetchProducts } from '../services/api';
import { Sparkles, Flame, ArrowRight, Award, Zap, ShieldCheck } from 'lucide-react';

export default function Home({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, featured, all] = await Promise.all([
          fetchCategories(),
          fetchFeaturedProducts(),
          fetchProducts({ limit: 8 })
        ]);
        setCategories(cats);
        setFeaturedProducts(featured);
        setTrendingProducts(all.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    onNavigate('shop', { category: catId });
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in space-y-12">
      {/* Hero Banner */}
      <HeroBanner onNavigate={onNavigate} />

      {/* Category Pills Bar */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>Explore Popular Categories</span>
          </h2>
          <button onClick={() => onNavigate('shop')} className="text-xs font-bold text-indigo-500 hover:underline">
            View All Categories →
          </button>
        </div>
        <CategoryBar categories={categories} activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
      </div>

      {/* Featured Deals Spotlight */}
      <section className="space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="badge badge-amber text-[10px] mb-1">Editors Choice</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500" />
              <span>Trending Marketplace Highlights</span>
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('shop')}
            className="btn btn-outline text-xs py-2 px-4 rounded-xl"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>

      {/* Promo Campaign Spotlight Box */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="relative z-10 max-w-xl space-y-4 text-left">
          <span className="badge bg-cyan-500 text-slate-950 font-black text-xs">VIP ACCESS</span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">Upgrade Your Setup with Aura Sound & Tech Pro</h2>
          <p className="text-sm text-slate-300">
            Engineered with spatial audio, Grade 5 titanium, and ultra-long battery performance. Exclusive 20% discount applied automatically at checkout.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop', { category: 'electronics' })}
              className="btn bg-white text-slate-950 hover:bg-slate-100 font-black text-sm py-3 px-8 rounded-2xl shadow-xl"
            >
              Shop Electronics Collection
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-40 hidden sm:block pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
            alt="Headphones" 
            className="w-full h-full object-cover" 
          />
        </div>
      </section>

      {/* Full Catalog Showcase */}
      <section className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-500" />
            <span>Recommended for You</span>
          </h2>
          <button 
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-500 hover:underline"
          >
            Browse Full Shop →
          </button>
        </div>

        <div className="product-grid">
          {trendingProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* Quick View Modal Popup */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
