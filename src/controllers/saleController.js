const Sale = require('../models/Sale');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.getAll();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.getById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalesByCustomerId = async (req, res) => {
    try {
        const sales = await Sale.getByCustomerId(req.params.customerId);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        const { order, items } = req.body;
        // Default user_id to 1 (admin) if not provided
        order.user_id = order.user_id || 1;
        
        const saleId = await Sale.create(order, items);
        res.status(201).json({ success: true, saleId });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.cancelSale = async (req, res) => {
    try {
        const success = await Sale.updateStatus(req.params.id, 'cancelled');
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Đã hủy đơn hàng' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.paySale = async (req, res) => {
    try {
        const success = await Sale.updateStatus(req.params.id, 'completed');
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Thanh toán thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Sale.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.mockPaymentSuccess = async (req, res) => {
    try {
        const sale = await Sale.getById(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        
        const SaleModel = require('mongoose').model('SaleOrder');
        await SaleModel.findByIdAndUpdate(req.params.id, { paid_amount: sale.final_amount });
        
        res.json({ success: true, message: 'Giả lập chuyển tiền thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
