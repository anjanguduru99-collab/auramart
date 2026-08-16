import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductQuickViewModal from '../components/ProductQuickViewModal';
import { fetchProducts, fetchCategories } from '../services/api';
import { 
  Filter, Grid, List, RotateCcw, Search, Star 
} from 'lucide-react';

export default function Shop({ initialCategory = 'all', initialSearch = '', onNavigate }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory,
          search: searchQuery,
          minPrice: minPrice !== '' ? minPrice : undefined,
          maxPrice: maxPrice !== '' ? maxPrice : undefined,
          rating: minRating > 0 ? minRating : undefined,
          inStock: inStockOnly ? 'true' : undefined,
          sortBy
        };

        const res = await fetchProducts(params);
        setProducts(res.products);
        setTotalProducts(res.total);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-8">
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white capitalize">
            {selectedCategory === 'all' ? 'All Marketplace Products' : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-indigo-400 font-extrabold">{totalProducts}</strong> products matching your criteria
          </p>
        </div>

        {/* View Mode & Sort Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 border border-slate-700 text-white outline-none cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <option value="featured">Featured / Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Grid/List Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="glass-panel p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 lg:sticky lg:top-24 text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span>Filter Catalog</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>

          {/* Search inside shop */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Search Keywords</label>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 text-white border border-slate-700 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Category</label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${selectedCategory === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span>All Categories</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5">Price Range ($)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 text-white border border-slate-700 outline-none focus:border-indigo-500"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 text-white border border-slate-700 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Minimum Rating</label>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map(stars => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer ${minRating === stars ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span>{stars} Stars & Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Switch */}
          <div className="pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Products Container */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel p-16 text-center space-y-4 rounded-3xl border border-slate-800">
              <h3 className="text-xl font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your filters or keyword query to explore all available marketplace items.</p>
              <button onClick={resetFilters} className="btn btn-primary text-xs py-2.5 px-6">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'product-grid' : 'product-list'}>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </main>
      </div>

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
