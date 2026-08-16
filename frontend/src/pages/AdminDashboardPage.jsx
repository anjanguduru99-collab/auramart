import React, { useState, useEffect } from 'react';
import AdminProductModal from '../components/AdminProductModal';
import { fetchAnalytics, fetchProducts, fetchOrders, deleteProduct, updateOrderStatus } from '../services/api';
import { 
  Shield, DollarSign, ShoppingBag, Package, TrendingUp, Plus, Edit, Trash2, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboardPage({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');

  const loadAdminData = async () => {
    try {
      const [stats, prods, ords] = await Promise.all([
        fetchAnalytics(),
        fetchProducts({ limit: 50 }),
        fetchOrders()
      ]);
      setAnalytics(stats);
      setProducts(prods.products);
      setOrders(ords);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product from the marketplace database?')) {
      try {
        await deleteProduct(id);
        loadAdminData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 mt-4">Loading Admin Analytics & Inventory...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in text-left space-y-8">
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="badge badge-amber text-[10px] mb-1">Seller Control Panel</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-500" />
            <span>AuraMart Admin Portal</span>
          </h1>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
          className="btn btn-primary text-xs py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 border-none flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Gross Sales Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${analytics.totalRevenue.toFixed(2)}</p>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live SQLite Database
            </p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Total Orders Placed</span>
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalOrders}</p>
            <p className="text-[11px] text-slate-400">Avg value: ${analytics.avgOrderValue.toFixed(2)}</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Active Inventory Products</span>
              <Package className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{analytics.activeProducts}</p>
            <p className="text-[11px] text-slate-400">Across 6 store categories</p>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
              <span>Customer Reviews</span>
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{analytics.totalReviews}</p>
            <p className="text-[11px] text-slate-400">Verified buyer ratings</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500'}`}
        >
          Manage Customer Orders ({orders.length})
        </button>
      </div>

      {/* Inventory Products Table */}
      {activeTab === 'inventory' && (
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">{p.title}</p>
                        <p className="text-[10px] text-slate-400">{p.id} • {p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize font-semibold text-slate-500">{p.category}</td>
                  <td className="p-4 font-black text-slate-900 dark:text-white">${p.price.toFixed(2)}</td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{p.stock} units</td>
                  <td className="p-4 font-bold text-amber-500">★ {p.rating}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Orders Status Management Table */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items Count</th>
                <th className="p-4">Total Paid</th>
                <th className="p-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-500">{o.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {o.customerName}
                    <p className="text-[10px] text-slate-400 font-normal">{o.email}</p>
                  </td>
                  <td className="p-4 font-semibold text-slate-500">{o.items.length} item(s)</td>
                  <td className="p-4 font-black text-slate-900 dark:text-white">${o.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isProductModalOpen && (
        <AdminProductModal
          product={editingProduct}
          onClose={() => setIsProductModalOpen(false)}
          onProductSaved={loadAdminData}
        />
      )}
    </div>
  );
}
