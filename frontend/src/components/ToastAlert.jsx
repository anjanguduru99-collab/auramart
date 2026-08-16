import React from 'react';
import { CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ToastAlert() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="glass-panel px-5 py-3.5 shadow-2xl flex items-center gap-3 border-l-4 border-indigo-500 bg-slate-900/90 text-white rounded-xl">
        <ShoppingBag className="w-5 h-5 text-indigo-400 animate-bounce" />
        <span className="text-sm font-semibold">{toastMessage}</span>
      </div>
    </div>
  );
}
