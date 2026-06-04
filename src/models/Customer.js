const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    password: { type: String },  // optional - for website-registered customers
    avatar: { type: String },    // Base64 avatar image data
    debt: { type: Number, default: 0 },
    note: { type: String }
}, { timestamps: true });

const CustomerModel = mongoose.model('Customer', customerSchema);

class Customer {
    static async getAll() {
        const customers = await CustomerModel.find().sort({ name: 1 });
        return customers.map(c => ({
            id: c._id.toString(),
            ...c.toObject()
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const c = await CustomerModel.findById(id);
        if (!c) return null;
        return {
            id: c._id.toString(),
            ...c.toObject()
        };
    }

    static async create(data) {
        const c = new CustomerModel(data);
        const result = await c.save();
        return result._id.toString();
    }

    static async update(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await CustomerModel.findByIdAndUpdate(id, data);
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await CustomerModel.findByIdAndDelete(id);
    }

    // Login by phone number (primary identifier in this system)
    static async findByPhone(phone) {
        const c = await CustomerModel.findOne({ phone });
        if (!c) return null;
        return {
            id: c._id.toString(),
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            avatar: c.avatar, // Base64 avatar
            _password: c.password  // internal use only for login check
        };
    }

    // Kept for compatibility / email-based future use
    static async findByEmail(email) {
        const c = await CustomerModel.findOne({ email });
        if (!c) return null;
        return {
            id: c._id.toString(),
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            avatar: c.avatar,
            _password: c.password
        };
    }

    // Find by phone OR email — then create if not found
    static async findOrCreate(data) {
        // Try to find by phone first (primary key in this system)
        if (data.phone) {
            const existing = await CustomerModel.findOne({ phone: data.phone });
            if (existing) {
                return {
                    id: existing._id.toString(),
                    name: existing.name,
                    email: existing.email,
                    phone: existing.phone,
                    address: existing.address,
                    avatar: existing.avatar
                };
            }
        }
        // Otherwise create new
        const c = new CustomerModel(data);
        const result = await c.save();
        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            phone: result.phone,
            address: result.address,
            avatar: result.avatar
        };
    }
}

module.exports = Customer;
