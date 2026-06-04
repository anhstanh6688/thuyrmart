const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    email: { type: String },
    supply_items: { type: String },
    note: { type: String },
    debt: { type: Number, default: 0 }
}, { timestamps: true });

const SupplierModel = mongoose.model('Supplier', supplierSchema);

class Supplier {
    static async getAll() {
        const suppliers = await SupplierModel.find().sort({ name: 1 });
        return suppliers.map(s => ({
            id: s._id.toString(),
            ...s.toObject()
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const s = await SupplierModel.findById(id);
        if (!s) return null;
        return {
            id: s._id.toString(),
            ...s.toObject()
        };
    }

    static async create(data) {
        const s = new SupplierModel(data);
        const result = await s.save();
        return result._id.toString();
    }

    static async update(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await SupplierModel.findByIdAndUpdate(id, data);
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await SupplierModel.findByIdAndDelete(id);
    }
}

module.exports = Supplier;
