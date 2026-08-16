import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, Heart, MapPin, User, Shield, ShoppingCart, Trash2, ArrowRight, Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { fetchOrders } from '../services/api';

export default function UserDashboardPage({ initialTab = 'orders', onNavigate }) {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    async function loadUserOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-8">
      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl ring-4 ring-indigo-500/30 object-cover" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email} • Premier Marketplace Member</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="btn btn-primary text-xs py-2.5 px-5 rounded-xl"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-500'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wishlist' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-500'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Saved Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('address')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'address' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Shipping Addresses</span>
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-panel p-12 text-center text-xs text-slate-500 rounded-3xl">
              You haven't placed any orders yet.
            </div>
          ) : (
            orders.map(ord => (
              <div key={ord.id} className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-500">{ord.id}</span>
                    <span className="text-slate-400 ml-3">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${ord.status === 'Delivered' ? 'badge-emerald' : 'badge-amber'} text-[10px]`}>
                      {ord.status}
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">${ord.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {ord.items.map((it, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {it.image && <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{it.title}</p>
                          <p className="text-slate-400">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Wishlist Tab Content */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="glass-panel p-12 text-center text-xs text-slate-500 rounded-3xl">
              Your wishlist is currently empty.
            </div>
          ) : (
            <div className="product-grid">
              {wishlist.map(p => (
                <div key={p.id} className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-xl bg-slate-100 dark:bg-slate-800" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</h4>
                  <p className="text-xs font-black text-indigo-500">${p.price.toFixed(2)}</p>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => { addToCart(p, 1); toggleWishlist(p); }}
                      className="flex-1 btn btn-primary text-xs py-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shipping Address Tab */}
      {activeTab === 'address' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default Shipping Destination</h3>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
            <p>{user.address.street}</p>
            <p>{user.address.city}, {user.address.state} {user.address.zip}</p>
            <p>{user.address.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}
