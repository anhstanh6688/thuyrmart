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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { product_id, change_qty, type, note } = req.body;
        
        const product = await Product.getById(product_id);
        if (!product) throw new Error('Không tìm thấy sản phẩm');

        // Update product stock
        // Note: Product.js doesn't have a direct update stock method, I'll update via Mongoose Model directly here or add a method to Product.js
        // For simplicity and transaction safety, I'll use the Model
        const ProductModel = mongoose.model('Product');
        await ProductModel.findByIdAndUpdate(product_id, {
            $inc: { stock_quantity: change_qty }
        }, { session });

        // Log the adjustment
        const log = new InventoryLog({
            product_id,
            type: type || 'adjust',
            quantity: change_qty,
            note: note || 'Điều chỉnh kho thủ công'
        });
        await log.save({ session });

        await session.commitTransaction();
        res.json({ message: 'Điều chỉnh kho thành công' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};
