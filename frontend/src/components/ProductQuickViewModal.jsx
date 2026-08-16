import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, ShieldCheck, Truck, Zap, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductQuickViewModal({ product, onClose, onNavigate }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const favorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in" />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden z-10 animate-fade-in my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8 items-start">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover" 
              />
              {product.badge && (
                <span className="absolute top-3 left-3 badge badge-primary text-xs bg-indigo-600 text-white font-black shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Form */}
          <div className="space-y-5 text-left">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold uppercase tracking-wider text-indigo-500">{product.brand}</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{product.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{product.tagline || product.description}</p>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-3xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="ml-auto text-xs font-bold text-emerald-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
              </span>
            </div>

            {/* Color variants if any */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Select Color Variant</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedColor === color 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Key Highlights</label>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="pt-2 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  -
                </button>
                <span className="px-3 text-sm font-extrabold text-slate-900 dark:text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 btn btn-primary py-3.5 text-sm rounded-xl shadow-xl flex items-center justify-center gap-2"
              >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors ${favorited ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'}`}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-white' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => { onClose(); onNavigate('product', { productId: product.id }); }}
              className="w-full text-center text-xs font-bold text-indigo-500 hover:underline pt-2"
            >
              View Full Product Page & All Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
