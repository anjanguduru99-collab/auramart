import React, { useState, useEffect } from 'react';
import ReviewModal from '../components/ReviewModal';
import ProductCard from '../components/ProductCard';
import ProductQuickViewModal from '../components/ProductQuickViewModal';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Check, 
  MessageSquarePlus, Sparkles, ChevronRight, Zap, Info 
} from 'lucide-react';

export default function ProductDetail({ productId, onNavigate }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProductById(productId);
        setProductData(data.product);
        setReviews(data.reviews || []);
        setRelated(data.related || []);
        if (data.product.colors && data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    if (productId) load();
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold mt-4">Loading Product Details...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <button onClick={() => onNavigate('shop')} className="btn btn-primary text-xs py-2.5 px-6">
          Back to Shop Catalog
        </button>
      </div>
    );
  }

  const favorited = isInWishlist(productData.id);

  const handleAddToCart = () => {
    addToCart(productData, quantity, { color: selectedColor });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setProductData(prev => ({
      ...prev,
      reviewCount: prev.reviewCount + 1
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-12">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-500">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop', { category: productData.category })} className="capitalize hover:text-indigo-500">
          {productData.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold line-clamp-1">{productData.title}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative h-[440px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xl group">
            <img 
              src={productData.images[activeImgIndex] || productData.images[0]} 
              alt={productData.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {productData.badge && (
              <span className="absolute top-4 left-4 badge badge-primary text-xs bg-indigo-600 text-white font-black shadow-lg">
                {productData.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Carousel */}
          {productData.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImgIndex === idx ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Info Panel */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold uppercase tracking-widest text-indigo-500">{productData.brand}</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{productData.rating}</span>
                <span className="text-slate-400 font-medium">({productData.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">{productData.title}</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">{productData.tagline || productData.description}</p>
          </div>

          {/* Pricing Box */}
          <div className="glass-panel p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">${productData.price.toFixed(2)}</span>
                {productData.originalPrice > productData.price && (
                  <span className="text-base text-slate-400 line-through">${productData.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Taxes included • Free Express Shipping on orders $100+</p>
            </div>

            <span className="badge badge-emerald text-xs py-1 px-3">
              <Zap className="w-3.5 h-3.5" /> In Stock ({productData.stock})
            </span>
          </div>

          {/* Color Selector */}
          {productData.colors && productData.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Select Color</label>
              <div className="flex flex-wrap gap-2.5">
                {productData.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedColor === color 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features Checklist */}
          {productData.features && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Key Features</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                {productData.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="pt-2 flex items-center gap-4">
            <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1.5">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 text-base font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">-</button>
              <span className="px-3 text-sm font-black text-slate-900 dark:text-white">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-base font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 btn py-4 text-sm rounded-2xl shadow-xl transition-all ${isAdded ? 'bg-emerald-600 text-white' : 'btn-primary'}`}
            >
              {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              <span>{isAdded ? 'Added to Shopping Cart!' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(productData)}
              className={`p-4 rounded-2xl border transition-colors ${favorited ? 'bg-rose-500 text-white border-rose-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'}`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Specs Table */}
          {productData.specs && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-500" />
                Technical Specifications
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {Object.entries(productData.specs).map(([k, v]) => (
                  <div key={k} className="py-2 flex justify-between">
                    <span className="text-slate-400 font-semibold">{k}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Customer Reviews & Ratings</h2>
            <p className="text-xs text-slate-500 mt-1">Verified buyer feedback from around the globe</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="btn btn-primary text-xs py-2.5 px-5 rounded-xl flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <div className="md:col-span-2 glass-panel p-8 text-center text-xs text-slate-500 rounded-2xl">
              No reviews yet for this product. Be the first customer to leave feedback!
            </div>
          ) : (
            reviews.map(rev => (
              <div key={rev.id} className="glass-panel p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.userAvatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover bg-slate-100 dark:bg-slate-800" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</h4>
                      <p className="text-[10px] text-slate-400">{rev.date} • Verified Purchaser</p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">{rev.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Frequently Bought Together</h2>
          <div className="product-grid">
            {related.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}

      {isReviewModalOpen && (
        <ReviewModal
          product={productData}
          onClose={() => setIsReviewModalOpen(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

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
