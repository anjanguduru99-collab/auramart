import React, { useState } from 'react';
import { Star, Heart, Eye, ShoppingCart, Check, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export default function ProductCard({ product, viewMode = 'grid', onQuickView, onNavigate }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState(product.images[0] || DEFAULT_FALLBACK_IMG);
  const [isAdded, setIsAdded] = useState(false);

  const favorited = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleImageError = () => {
    setImgSrc(DEFAULT_FALLBACK_IMG);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onNavigate('product', { productId: product.id })}
        className="glass-panel p-4 flex flex-col sm:flex-row gap-6 items-center card-hover cursor-pointer group bg-slate-900 border border-slate-800 rounded-3xl"
      >
        <div className="relative w-full sm:w-56 h-52 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
          <img 
            src={imgSrc} 
            alt={product.title} 
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-indigo-600 text-white shadow-md z-10">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2 text-left w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{product.description}</p>

          <div className="pt-3 flex items-center justify-between gap-4 border-t border-slate-800">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.stock <= 10 && (
                <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3" /> Only {product.stock} left in stock!
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleWishlistClick}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${favorited ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400'}`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
              </button>
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary text-xs py-2.5 px-5 rounded-xl cursor-pointer"
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{isAdded ? 'Added' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onNavigate('product', { productId: product.id })}
      className="glass-panel flex flex-col justify-between card-hover cursor-pointer group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-full"
    >
      {/* Top Image Container with Fixed Height */}
      <div 
        className="relative w-full h-56 bg-slate-800 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) {
            setCurrentImgIndex(1);
            setImgSrc(product.images[1]);
          }
        }}
        onMouseLeave={() => {
          setCurrentImgIndex(0);
          setImgSrc(product.images[0] || DEFAULT_FALLBACK_IMG);
        }}
      >
        <img 
          src={imgSrc} 
          alt={product.title} 
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Non-overlapping Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-indigo-600 text-white shadow-lg">
              {product.badge}
            </span>
          )}
          {product.originalPrice > product.price && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-emerald-600 text-white shadow-lg">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistClick}
            className={`p-2.5 rounded-xl backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer ${favorited ? 'bg-rose-500 text-white' : 'bg-slate-950/80 text-slate-300 hover:text-rose-400'}`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-indigo-400 shadow-md transition-transform hover:scale-110 cursor-pointer"
            title="Quick Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-indigo-400 text-[10px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{product.tagline || product.description}</p>
        </div>

        {/* Price & Add Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`btn py-2 px-3.5 text-xs rounded-xl shadow-md transition-all cursor-pointer ${
              isAdded ? 'bg-emerald-600 text-white' : 'btn-primary'
            }`}
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{isAdded ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
