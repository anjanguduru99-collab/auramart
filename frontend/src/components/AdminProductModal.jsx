import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Package, Image as ImageIcon } from 'lucide-react';
import { createProduct, updateProduct } from '../services/api';

export default function AdminProductModal({ product, onClose, onProductSaved }) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'electronics',
    price: '',
    originalPrice: '',
    stock: '15',
    badge: 'New',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    isFeatured: true,
    isTrending: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        brand: product.brand || '',
        category: product.category || 'electronics',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock || '15',
        badge: product.badge || '',
        description: product.description || '',
        imageUrl: product.images ? product.images[0] : '',
        isFeatured: !!product.isFeatured,
        isTrending: !!product.isTrending
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      setError('Please fill in the product title and price.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price) * 1.2,
      stock: parseInt(formData.stock, 10),
      images: [formData.imageUrl]
    };

    try {
      let saved;
      if (product && product.id) {
        saved = await updateProduct(product.id, payload);
      } else {
        saved = await createProduct(payload);
      }

      setIsSubmitting(false);
      onProductSaved(saved.product);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in" />

      <div className="relative w-full max-w-2xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-8 z-10 animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {product ? 'Edit Product Inventory' : 'Add New Marketplace Product'}
              </h3>
              <p className="text-xs text-slate-400">Seller & Admin Dashboard Management</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. AuraSound Pro Headphones"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. AuraTech"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field text-xs"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                  <option value="gaming">Gaming</option>
                  <option value="fitness">Fitness</option>
                  <option value="books">Books</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="149.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Inventory Stock</label>
                <input
                  type="number"
                  placeholder="25"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Bestseller, Hot Deal"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Product description and specification details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field text-xs"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Mark as Trending</span>
              </label>
            </div>

            {error && <p className="font-bold text-rose-500">{error}</p>}

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 btn btn-secondary py-3">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 btn btn-primary py-3">
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
