const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getLogs = async (req, res) => {
    try {
        const logs = await InventoryLog.find()
            .populate('product_id', 'name sku')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.adjustStock = async (req, res) => {
    try {
        const { product_id, change_qty, type, note } = req.body;
        
        const ProductModel = mongoose.model('Product');
        const product = await ProductModel.findById(product_id);
        if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

        // Update stock
        await ProductModel.findByIdAndUpdate(product_id, {
            $inc: { stock_quantity: change_qty }
        });

        // Save inventory log
        const log = new InventoryLog({
            product_id,
            type: type || 'adjust',
            quantity: change_qty,
            note: note || 'Điều chỉnh kho thủ công'
        });
        await log.save();

        res.json({ success: true, message: 'Điều chỉnh kho thành công' });
    } catch (error) {
        console.error('adjustStock error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Tạo log nhập kho đơn giản (không dùng transaction, dùng cho quick-create từ barcode scan)
exports.createLog = async (req, res) => {
    try {
        const { product_id, type, quantity, note } = req.body;
        if (!product_id || !quantity) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }
        // Cập nhật tồn kho
        const ProductModel = mongoose.model('Product');
        await ProductModel.findByIdAndUpdate(product_id, { $inc: { stock_quantity: Number(quantity) } });
        // Tạo log
        const log = new InventoryLog({
            product_id,
            type: type || 'in',
            quantity: Number(quantity),
            note: note || 'Tồn kho ban đầu'
        });
        await log.save();
        res.status(201).json({ success: true, message: 'Tạo log kho thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
