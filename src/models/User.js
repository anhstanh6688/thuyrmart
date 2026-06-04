const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String },
    phone: { type: String }, // added for unified login
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
    status: { type: Boolean, default: true }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

class User {
    static async findByUsername(username) {
        const user = await UserModel.findOne({ username });
        if (!user) return null;
        return {
            id: user._id.toString(),
            username: user.username,
            password: user.password,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            status: user.status
        };
    }

    static async findByPhone(phone) {
        const user = await UserModel.findOne({ phone });
        if (!user) return null;
        return {
            id: user._id.toString(),
            username: user.username,
            password: user.password,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            status: user.status
        };
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const user = await UserModel.findById(id, '-password');
        if (!user) return null;
        return {
            id: user._id.toString(),
            username: user.username,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            status: user.status
        };
    }

    static async getAll() {
        const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });
        return users.map(u => ({
            id: u._id.toString(),
            username: u.username,
            full_name: u.full_name,
            phone: u.phone,
            role: u.role,
            status: u.status
        }));
    }

    static async create(data) {
        const user = new UserModel(data);
        const result = await user.save();
        return result._id.toString();
    }

    static async update(id, data) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        // If password is being updated, it should be hashed (handled in controller usually)
        await UserModel.findByIdAndUpdate(id, data);
    }

    static async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return;
        await UserModel.findByIdAndDelete(id);
    }
}

module.exports = User;
