const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductByBarcode = async (req, res) => {
    try {
        const barcode = String(req.params.barcode || '').trim();
        if (!barcode) {
            return res.status(400).json({ success: false, message: 'Mã vạch không hợp lệ' });
        }
        const product = await Product.getByBarcode(barcode);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm', barcode });
        }
        return res.json({ success: true, data: product });
    } catch (error) {
        console.error('getProductByBarcode:', error);
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const id = await Product.create(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        console.error('createProduct error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            const val = error.keyValue ? error.keyValue[field] : '';
            const fieldName = field === 'barcode' ? 'Mã vạch' : (field === 'sku' ? 'Mã SKU' : field);
            return res.status(400).json({ error: `${fieldName} "${val}" đã tồn tại trong hệ thống!` });
        }
        res.status(500).json({ error: error.message || 'Lỗi khi lưu sản phẩm' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('updateProduct error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            const val = error.keyValue ? error.keyValue[field] : '';
            const fieldName = field === 'barcode' ? 'Mã vạch' : (field === 'sku' ? 'Mã SKU' : field);
            return res.status(400).json({ error: `${fieldName} "${val}" đã tồn tại trong hệ thống!` });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const products = await Product.search(req.query.q);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
