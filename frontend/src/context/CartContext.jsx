import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateCoupon } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('auramart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('auramart_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, quantity = 1, options = {}) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedColor === options.color);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedColor: options.color || (product.colors ? product.colors[0] : null)
        }];
      }
    });

    showToast(`Added "${product.title}" to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedColor) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId, selectedColor, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === selectedColor) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code) => {
    try {
      const coupon = await validateCoupon(code);
      setAppliedCoupon(coupon);
      showToast(`Promo code "${code}" applied successfully!`);
      return { success: true, coupon };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const FREE_SHIPPING_THRESHOLD = 100;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || (appliedCoupon && appliedCoupon.freeShipping);
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : 9.99);

  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      subtotal,
      discount,
      shippingFee,
      total,
      totalItemCount,
      FREE_SHIPPING_THRESHOLD,
      toastMessage
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
