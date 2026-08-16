import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Flame, Shield, Clock, Star, Zap, ShoppingCart, Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const BANNERS = [
  {
    id: 1,
    badge: 'FLASH SALE • 24 HOURS ONLY',
    title: 'Spatial 3D Audio & ANC Tech',
    subtitle: 'Custom beryllium drivers, 60-hour battery life, and active noise reduction designed for audiophiles.',
    price: 249.99,
    originalPrice: 329.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'electronics',
    productId: 'prod-101',
    rating: 4.8,
    reviews: 342,
    highlights: ['60hr Battery', '40dB ANC', 'Bluetooth 5.3']
  },
  {
    id: 2,
    badge: 'LUXURY TITANIUM WEARABLE',
    title: 'Chronos Ultra Smartwatch',
    subtitle: 'Grade 5 Aerospace titanium casing, dual-frequency GPS, ECG heart monitor, and 7-day battery.',
    price: 349.00,
    originalPrice: 429.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category: 'electronics',
    productId: 'prod-102',
    rating: 4.9,
    reviews: 512,
    highlights: ['Titanium Body', '100m Water', '7-Day Battery']
  },
  {
    id: 3,
    badge: 'BARISTA CRAFT SERIE',
    title: 'Precision Espresso Machine',
    subtitle: 'Italian 15-bar high pressure pump, PID digital temp control & micro-foam commercial steam wand.',
    price: 499.00,
    originalPrice: 599.00,
    image: 'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=800&auto=format&fit=crop&q=80',
    category: 'home',
    productId: 'prod-108',
    rating: 4.9,
    reviews: 420,
    highlights: ['15-Bar Italian', 'PID Control', 'Burr Grinder']
  }
];

export default function HeroBanner({ onNavigate }) {
  const { addToCart } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % BANNERS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const slide = BANNERS[activeSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl mb-12 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl">
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Offer Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              {slide.badge}
            </span>

            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ends in:</span>
              <span className="font-mono text-cyan-300 font-extrabold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Highlights Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {slide.highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {h}
              </span>
            ))}
          </div>

          {/* Pricing & CTA */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">${slide.price.toFixed(2)}</span>
              <span className="text-sm text-slate-400 line-through">${slide.originalPrice.toFixed(2)}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                SAVE ${(slide.originalPrice - slide.price).toFixed(0)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('shop', { category: slide.category })}
                className="btn btn-primary py-3.5 px-7 rounded-2xl shadow-xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('product', { productId: slide.productId })}
                className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 px-5 rounded-2xl text-xs font-bold transition-all"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-4 flex items-center gap-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex -space-x-2">
              <img className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="" />
              <img className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="" />
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9/5 Rating</span>
              <span className="text-slate-400 font-normal">from 45,000+ verified buyers</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Product Showcase Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-slate-800/80 border border-white/15 shadow-2xl group cursor-pointer"
               onClick={() => onNavigate('product', { productId: slide.productId })}>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
            />
            
            {/* Top Right Floating Badge */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-black text-cyan-300 shadow-xl flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending #1</span>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{slide.category}</p>
                <h4 className="text-sm font-black text-white truncate max-w-[200px]">{slide.title}</h4>
              </div>
              <span className="text-lg font-black text-white bg-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                ${slide.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center gap-2 pt-6">
            {BANNERS.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setActiveSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
