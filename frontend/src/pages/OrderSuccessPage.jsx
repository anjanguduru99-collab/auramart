import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Package, Truck, Clock, Sparkles, MapPin, ArrowRight, Printer 
} from 'lucide-react';
import { fetchOrderById } from '../services/api';

export default function OrderSuccessPage({ orderId, onNavigate }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const fetched = await fetchOrderById(orderId);
        setOrder(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 mt-4">Generating Order Receipt...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in text-center max-w-3xl space-y-8">
      {/* Top Banner Icon */}
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Thank You for Your Order!</h1>
        <p className="text-xs text-slate-500">Order Reference Number: <strong className="text-indigo-500 font-mono text-sm px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">{orderId || 'AM-8942-X7'}</strong></p>
      </div>

      {/* Shipment Status Timeline */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Delivery Timeline</h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto font-bold">1</div>
            <p className="font-bold text-slate-900 dark:text-white">Placed</p>
            <p className="text-[10px] text-emerald-500 font-semibold">Completed</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto font-bold animate-pulse">2</div>
            <p className="font-bold text-slate-900 dark:text-white">Processing</p>
            <p className="text-[10px] text-amber-500 font-semibold">In Progress</p>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto font-bold">3</div>
            <p className="font-bold text-slate-900 dark:text-white">Shipped</p>
            <p className="text-[10px] text-slate-400">Pending</p>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto font-bold">4</div>
            <p className="font-bold text-slate-900 dark:text-white">Delivered</p>
            <p className="text-[10px] text-slate-400">Est. 2 Days</p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      {order && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Order Receipt Summary</h3>
            <button onClick={() => window.print()} className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1">
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />}
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${(order.subtotal || order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `$${(order.shippingFee || 0).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2">
              <span>Total Paid</span>
              <span className="gradient-text">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => onNavigate('dashboard', { tab: 'orders' })}
          className="btn btn-secondary py-3 px-6 text-xs rounded-xl"
        >
          View Order History in Dashboard
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="btn btn-primary py-3 px-8 text-xs rounded-xl flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
