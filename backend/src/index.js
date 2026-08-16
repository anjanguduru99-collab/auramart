import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AuraMart API Backend', timestamp: new Date() });
});

// Analytics Dashboard Endpoint
app.get('/api/analytics', (req, res) => {
  try {
    const stats = db.getAnalytics();
    res.json({ success: true, analytics: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- PRODUCT ROUTES ---

// GET /api/products
app.get('/api/products', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, inStock, sortBy, limit, page } = req.query;
    const result = db.getProducts({ category, search, minPrice, maxPrice, rating, inStock, sortBy, limit, page });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/featured
app.get('/api/products/featured', (req, res) => {
  try {
    const { products } = db.getProducts({ limit: 6 });
    const featured = products.filter(p => p.isFeatured || p.isTrending);
    res.json({ success: true, products: featured });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const reviews = db.getReviewsByProductId(product.id);
    const related = db.getProducts({ category: product.category, limit: 4 }).products.filter(p => p.id !== product.id);
    
    res.json({ success: true, product, reviews, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products (Create)
app.post('/api/products', (req, res) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json({ success: true, product: newProduct, message: 'Product created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id (Update)
app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- CATEGORIES ROUTES ---
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- ORDERS ROUTES ---

// GET /api/orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  try {
    const { items, customerName, email, shippingAddress, subtotal, discount, shippingFee, total, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items cannot be empty' });
    }

    const order = db.createOrder({ items, customerName, email, shippingAddress, subtotal, discount, shippingFee, total, paymentMethod });
    res.status(201).json({ success: true, order, message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = db.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- REVIEWS ROUTE ---
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, rating, title, comment, userName } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Missing required review fields' });
    }

    const review = db.addReview({ productId, rating, title, comment, userName });
    res.status(201).json({ success: true, review, message: 'Review added successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- COUPONS ROUTE ---
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code } = req.body;
    const result = db.validateCoupon(code);
    if (result.valid) {
      res.json({ success: true, coupon: result.coupon });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Static Production Hosting for Frontend single-page app
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 AuraMart Production Full-Stack Server running on http://localhost:${PORT}`);
});
