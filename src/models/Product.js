const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    sku: { type: String, unique: true },
    name: { type: String, required: true },
    alias: { type: String },
    unit: { type: String, default: 'Cái' },
    cost_price: { type: Number, default: 0 },
    selling_price: { type: Number, default: 0 },
    stock_quantity: { type: Number, default: 0 },
    min_stock: { type: Number, default: 10 },
    average_rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    description: { type: String },
    images: [{ type: String }],
    video: { type: String },
    status: { type: Boolean, default: true }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

class Product {
    static async getAll() {
        const products = await ProductModel.find().populate('category_id').sort({ createdAt: -1 });
        return products.map(p => ({
            id: p._id.toString(),
            category_id: p.category_id?._id.toString(),
            category_name: p.category_id?.name || 'Uncategorized',
            sku: p.sku,
            name: p.name,
            alias: p.alias,
            unit: p.unit,
            cost_price: p.cost_price,
            selling_price: p.selling_price,
            stock_quantity: p.stock_quantity,
            min_stock: p.min_stock,
            description: p.description,
            images: p.images || [],
            video: p.video || '',
            status: p.status,
            average_rating: p.average_rating || 0,
            review_count: p.review_count || 0
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const p = await ProductModel.findById(id).populate('category_id');
        if (!p) return null;
        return {
            id: p._id.toString(),
            category_id: p.category_id?._id?.toString() || null,
            category_name: p.category_id?.name || 'Chưa phân loại',
            sku: p.sku,
            name: p.name,
            alias: p.alias,
            unit: p.unit,
            cost_price: p.cost_price,
            price: p.cost_price,           // alias for FE: compare with selling_price to show discount
            selling_price: p.selling_price,
            stock_quantity: p.stock_quantity,
            min_stock: p.min_stock,
            description: p.description,
            images: p.images || [],
            video: p.video || '',
            status: p.status,
            average_rating: p.average_rating || 0,
            review_count: p.review_count || 0,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        };
    }

    static async create(data) {
        if (data.category_id && !mongoose.Types.ObjectId.isValid(data.category_id)) {
            data.category_id = null;
        }
        const p = new ProductModel(data);
        const result = await p.save();
        return result._id.toString();
    }

    static async update(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await ProductModel.findByIdAndUpdate(id, data);
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await ProductModel.findByIdAndDelete(id);
    }

    static async search(query) {
        const products = await ProductModel.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { sku: new RegExp(query, 'i') },
                { alias: new RegExp(query, 'i') }
            ]
        }).limit(10);
        return products.map(p => ({
            id: p._id.toString(),
            ...p.toObject()
        }));
    }
}

module.exports = Product;
