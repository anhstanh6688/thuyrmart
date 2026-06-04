const SupplierPayment = require('../models/SupplierPayment');
const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

exports.payDebt = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { supplier_id, amount, payment_method, note, user_id } = req.body;
        
        // 1. Update Supplier Debt
        const SupplierModel = mongoose.model('Supplier');
        const supplier = await SupplierModel.findById(supplier_id);
        if (!supplier) throw new Error('Không tìm thấy nhà cung cấp');

        await SupplierModel.findByIdAndUpdate(supplier_id, {
            $inc: { debt: -Number(amount) }
        }, { session });


        // 2. Create Payment Record
        const payment = new SupplierPayment({
            supplier_id,
            user_id: user_id || null,
            amount: Number(amount),
            payment_method: payment_method || 'cash',
            note: note || 'Trả nợ nhà cung cấp'
        });
        await payment.save({ session });

        await session.commitTransaction();
        res.json({ success: true, message: 'Thanh toán nợ thành công' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

exports.getPaymentsBySupplier = async (req, res) => {
    try {
        const payments = await SupplierPayment.find({ supplier_id: req.params.id })
            .populate('user_id', 'full_name')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
