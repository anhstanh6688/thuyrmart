const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', categorySchema);

class Category {
    static async getAll() {
        const categories = await CategoryModel.find().sort({ name: 1 });
        return categories.map(cat => ({
            id: cat._id.toString(),
            name: cat.name,
            description: cat.description
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const cat = await CategoryModel.findById(id);
        if (!cat) return null;
        return {
            id: cat._id.toString(),
            name: cat.name,
            description: cat.description
        };
    }

    static async create(name, description) {
        const cat = new CategoryModel({ name, description });
        const result = await cat.save();
        return result._id.toString();
    }

    static async update(id, name, description) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await CategoryModel.findByIdAndUpdate(id, { name, description });
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await CategoryModel.findByIdAndDelete(id);
    }
}

module.exports = Category;
