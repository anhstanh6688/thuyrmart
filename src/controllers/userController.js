const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        const { username, password, full_name, phone, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = await User.create({
            username,
            password: hashedPassword,
            full_name,
            phone,
            role
        });
        res.status(201).json({ id, message: 'Tạo người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        const { full_name, phone, role, status, password } = req.body;
        const updateData = { full_name, phone, role, status };
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        await User.update(req.params.id, updateData);
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        await User.delete(req.params.id);
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        const user = await User.getById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
