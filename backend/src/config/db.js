import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts, initialCategories, initialCoupons, initialReviews } from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../auramart_db.json');

class DatabaseStore {
  constructor() {
    this.data = {
      products: [],
      categories: [],
      orders: [],
      reviews: [],
      coupons: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('⚡ Database loaded from disk persistent storage:', DB_FILE);
      } else {
        console.log('🌱 Initializing database with seed dataset...');
        this.data = {
          products: [...initialProducts],
          categories: [...initialCategories],
          orders: [
            {
              id: 'AM-8942-X7',
              customerName: 'Sarah Jenkins',
              email: 'sarah.j@example.com',
              shippingAddress: { street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', zip: '97477' },
              items: [
                { id: 'prod-101', title: 'AuraSound Max Wireless ANC Headphones', price: 249.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' }
              ],
              total: 249.99,
              paymentMethod: 'Credit Card (**** 4242)',
              status: 'Delivered',
              createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
            }
          ],
          reviews: [...initialReviews],
          coupons: [...initialCoupons]
        };
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // Products
  getProducts({ category, search, minPrice, maxPrice, rating, inStock, sortBy, limit, page = 1 }) {
    let result = [...this.data.products];

    if (category && category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (rating !== undefined && !isNaN(rating)) {
      result = result.filter(p => p.rating >= Number(rating));
    }

    if (inStock === 'true' || inStock === true) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort logic
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // Default: popularity / featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = result.length;
    let paginated = result;

    if (limit && !isNaN(limit)) {
      const p = Number(page);
      const l = Number(limit);
      const start = (p - 1) * l;
      paginated = result.slice(start, start + l);
    }

    return { products: paginated, total, page: Number(page), totalPages: limit ? Math.ceil(total / limit) : 1 };
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id) || null;
  }

  createProduct(productData) {
    const newProduct = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      title: productData.title || 'Untitled Product',
      tagline: productData.tagline || '',
      description: productData.description || '',
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price) * 1.2,
      category: productData.category || 'electronics',
      brand: productData.brand || 'Generic',
      rating: 5.0,
      reviewCount: 0,
      stock: Number(productData.stock) || 10,
      isFeatured: !!productData.isFeatured,
      isTrending: !!productData.isTrending,
      badge: productData.badge || 'New',
      images: productData.images && productData.images.length > 0 
        ? productData.images 
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      features: productData.features || ['Premium quality build', 'Fast shipping'],
      specs: productData.specs || { Warranty: '1 Year' },
      colors: productData.colors || ['Black']
    };

    this.data.products.unshift(newProduct);
    this.updateCategoryCounts();
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.save();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.products.splice(index, 1);
    this.updateCategoryCounts();
    this.save();
    return true;
  }

  // Categories
  getCategories() {
    this.updateCategoryCounts();
    return this.data.categories;
  }

  updateCategoryCounts() {
    this.data.categories.forEach(cat => {
      cat.count = this.data.products.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;
    });
  }

  // Orders
  getOrders() {
    return this.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id.toLowerCase() === id.toLowerCase()) || null;
  }

  createOrder(orderData) {
    const orderId = `AM-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      customerName: orderData.customerName || 'Valued Customer',
      email: orderData.email || 'customer@example.com',
      shippingAddress: orderData.shippingAddress || {},
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      shippingFee: Number(orderData.shippingFee) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      status: 'Processing',
      createdAt: new Date().toISOString()
    };

    // Deduct product stock
    newOrder.items.forEach(item => {
      const prod = this.getProductById(item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    this.save();
    return order;
  }

  // Reviews
  getReviewsByProductId(productId) {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      userName: reviewData.userName || 'Anonymous',
      userAvatar: reviewData.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewData.userName}`,
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: reviewData.title || '',
      comment: reviewData.comment || '',
      verified: true
    };

    this.data.reviews.unshift(newReview);

    // Recalculate product rating
    const prodReviews = this.getReviewsByProductId(reviewData.productId);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

    const prod = this.getProductById(reviewData.productId);
    if (prod) {
      prod.rating = Number(avgRating.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    this.save();
    return newReview;
  }

  // Coupons
  validateCoupon(code) {
    if (!code) return { valid: false, message: 'Invalid code' };
    const found = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      return { valid: true, coupon: found };
    }
    return { valid: false, message: 'Coupon code not found' };
  }

  // Analytics
  getAnalytics() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const activeProducts = this.data.products.length;
    const totalReviews = this.data.reviews.length;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      activeProducts,
      totalReviews,
      avgOrderValue: totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0
    };
  }
}

export const db = new DatabaseStore();
