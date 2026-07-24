const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./src/config/db');

// Connect to Database
connectDB();


const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (cần cho Render.com, Railway, Heroku)
app.set('trust proxy', 1);

// CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : true, // true = cho phép tất cả origins (phù hợp khi FE và BE cùng domain)
    credentials: true
};
app.use(cors(corsOptions));

// Logging Middleware
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    }
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Root directory - dùng process.cwd() thay vì __dirname vì dotenvx làm __dirname không chính xác
const ROOT = process.cwd();

app.use(express.static(path.join(ROOT, 'public')));
app.use('/uploads', express.static(path.join(ROOT, 'uploads')));

// View directory path (MVC)
const viewsPath = path.join(ROOT, 'src', 'views');

// Admin Views
app.get('/admin/login', (req, res) => {
    res.redirect('/login');
});

app.get('/admin', (req, res) => {
    res.sendFile('admin/index.html', { root: viewsPath });
});

// Customer Views
app.get('/', (req, res) => {
    res.sendFile('customer/index.html', { root: viewsPath });
});

app.get('/products', (req, res) => {
    res.sendFile('customer/products.html', { root: viewsPath });
});

app.get('/products/:id', (req, res) => {
    res.sendFile('customer/product-detail.html', { root: viewsPath });
});

app.get('/login', (req, res) => {
    res.sendFile('customer/customer-login.html', { root: viewsPath });
});

app.get('/register', (req, res) => {
    res.sendFile('customer/register.html', { root: viewsPath });
});

app.get('/cart', (req, res) => {
    res.sendFile('customer/cart.html', { root: viewsPath });
});

app.get('/checkout', (req, res) => {
    res.sendFile('customer/checkout.html', { root: viewsPath });
});

app.get('/account', (req, res) => {
    res.sendFile('customer/account.html', { root: viewsPath });
});

app.get('/contact', (req, res) => {
    res.sendFile('customer/contact.html', { root: viewsPath });
});

app.get('/about', (req, res) => {
    res.sendFile('customer/about.html', { root: viewsPath });
});

app.get('/account-orders', (req, res) => {
    res.sendFile('customer/account-orders.html', { root: viewsPath });
});

app.get('/order-success', (req, res) => {
    res.sendFile('customer/order-success.html', { root: viewsPath });
});

app.get('/account-addresses', (req, res) => {
    res.sendFile('customer/account-addresses.html', { root: viewsPath });
});

app.get('/account-wishlist', (req, res) => {
    res.sendFile('customer/account-wishlist.html', { root: viewsPath });
});


// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const supplierRoutes = require('./src/routes/supplierRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const userRoutes = require('./src/routes/userRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const supplierPaymentRoutes = require('./src/routes/supplierPaymentRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const systemRoutes = require('./src/routes/systemRoutes');

const checkStatus = require('./src/middleware/checkStatus');

app.use('/api/auth', authRoutes);
app.use('/api', checkStatus); // Apply to all subsequent /api routes
app.use('/api/products', productRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/supplier-payments', supplierPaymentRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/system', systemRoutes);

// Global Error Handler (must be last middleware)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    // Nếu lỗi từ sendFile (file không tìm thấy), trả HTML 404 đẹp hơn
    if (err.status === 404) {
        return res.status(404).send('<h2>404 - Trang không tồn tại</h2>');
    }
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
    });
});

// 404 handler for unknown API routes (phải sau error handler)
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ ThuyR Mart Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Configured ✅' : 'Not configured (using local) ⚠️'}`);
});
