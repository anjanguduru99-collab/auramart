import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Truck, Check, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onNavigate }) {
  const { 
    cart, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart,
    subtotal, discount, shippingFee, total, appliedCoupon, applyCouponCode, removeCoupon,
    FREE_SHIPPING_THRESHOLD 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput);
    setIsApplying(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart} 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Slide-Over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-white/95 dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-slide-right">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400">{cart.length} unique item(s)</p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-indigo-500/5 p-3.5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-500" />
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-emerald-500">🎉 You unlocked FREE Express Shipping!</strong>
                ) : (
                  <span>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for FREE Shipping</span>
                )}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100 dark:divide-slate-800/60">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Discover top-rated tech, fashion, and lifestyle items ready for 2-day delivery.</p>
                <button
                  onClick={() => { closeCart(); onNavigate('shop'); }}
                  className="btn btn-primary text-xs py-2.5 px-6"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedColor || idx}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    className="w-18 h-18 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.product.title}</h4>
                    {item.selectedColor && (
                      <p className="text-xs text-slate-400">Color: {item.selectedColor}</p>
                    )}
                    <p className="text-sm font-black text-indigo-500 mt-1">${item.product.price.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-extrabold text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Promo Coupon Bar */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.description})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. AURA20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none uppercase"
                  />
                  <button type="submit" disabled={isApplying} className="btn btn-secondary text-xs py-2 px-3">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>}

              {/* Price Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => { closeCart(); onNavigate('checkout'); }}
                  className="w-full btn btn-primary py-3 text-sm rounded-xl shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { closeCart(); onNavigate('cart'); }}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-indigo-500 transition-colors py-1"
                >
                  View Detailed Cart Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
