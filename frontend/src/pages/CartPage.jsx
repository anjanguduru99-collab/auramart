import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Truck, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ onNavigate }) {
  const { 
    cart, removeFromCart, updateQuantity, clearCart,
    subtotal, discount, shippingFee, total, appliedCoupon, applyCouponCode, removeCoupon,
    FREE_SHIPPING_THRESHOLD 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    const res = await applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Looks like you haven't added any products to your shopping bag yet.</p>
        <button onClick={() => onNavigate('shop')} className="btn btn-primary text-xs py-3 px-8 rounded-xl">
          Explore All Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart Summary</h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
          <div className="p-2 rounded-xl bg-indigo-500 text-white shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-500 font-extrabold text-sm">🎉 You've earned FREE Express Delivery!</span>
            ) : (
              <span>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more to qualify for FREE Shipping.</span>
            )}
          </div>
        </div>
        <div className="w-full sm:w-48 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="p-5 flex flex-col sm:flex-row gap-5 items-center">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  className="w-24 h-24 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0" 
                />

                <div className="flex-1 min-w-0 space-y-1 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{item.product.brand}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{item.product.title}</h3>
                  {item.selectedColor && <p className="text-xs text-slate-400">Variant: {item.selectedColor}</p>}
                  <p className="text-sm font-black text-indigo-500 mt-1">${item.product.price.toFixed(2)}</p>
                </div>

                {/* Quantity Manager */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-extrabold text-slate-900 dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => onNavigate('shop')} className="btn btn-secondary text-xs py-3 px-6 rounded-xl flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Right Summary Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white/90 dark:bg-slate-900/90">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Order Details</h3>

          {/* Promo code input */}
          {appliedCoupon ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Coupon ({appliedCoupon.code}) Applied</span>
              </div>
              <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-500">Remove</button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Have a Promo Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AURA20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none uppercase"
                />
                <button type="submit" className="btn btn-secondary text-xs py-2 px-4">
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] font-bold text-rose-500">{couponError}</p>}
            </form>
          )}

          {/* Pricing table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-500 font-bold">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span className="font-bold text-slate-900 dark:text-white">{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800">
              <span>Grand Total</span>
              <span className="gradient-text text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full btn btn-primary py-4 text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
          >
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
