const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    type: { type: String, enum: ['in', 'out', 'adjust'] },
    quantity: { type: Number },
    reference_id: { type: mongoose.Schema.Types.ObjectId },
    note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
