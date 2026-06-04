const mongoose = require('mongoose');

const supplierPaymentSchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['cash', 'transfer'], default: 'cash' },
    note: { type: String },
    payment_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SupplierPayment', supplierPaymentSchema);
