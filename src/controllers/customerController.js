const Customer = require('../models/Customer');
const mongoose = require('mongoose');

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.getAll();
        const SaleModel = mongoose.model('SaleOrder');
        
        // Calculate dynamic debt for each customer based on actual unpaid sales
        const debtStats = await SaleModel.aggregate([
            { $match: { status: { $nin: ['cancelled', 'expired'] } } },
            { $group: {
                _id: "$customer_id",
                totalFinal: { $sum: "$final_amount" },
                totalPaid: { $sum: "$paid_amount" }
            }}
        ]);
        
        const debtMap = new Map();
        debtStats.forEach(d => {
            if (d._id) {
                const unpaid = Math.max(0, d.totalFinal - d.totalPaid);
                debtMap.set(d._id.toString(), unpaid);
            }
        });

        const updatedCustomers = customers.map(c => {
            const calculatedDebt = debtMap.has(c.id) ? debtMap.get(c.id) : 0;
            return {
                ...c,
                debt: calculatedDebt
            };
        });

        res.json(updatedCustomers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.getById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Dùng cho Admin hoặc khách đăng ký tài khoản mới
exports.createCustomer = async (req, res) => {
    try {
        let { phone, email } = req.body;

        // Chuẩn hóa và làm sạch dữ liệu
        if (phone) {
            phone = phone.trim().replace(/\s+/g, '');
            req.body.phone = phone; // cập nhật lại req.body
        }
        if (email) {
            email = email.trim().toLowerCase();
            req.body.email = email; // cập nhật lại req.body
        }

        // 1. Kiểm tra trùng Số điện thoại trong Customer và User
        if (phone) {
            const existingCustomer = await Customer.findByPhone(phone);
            const User = require('../models/User');
            const existingUser = await User.findByPhone(phone);
            
            if (existingCustomer || existingUser) {
                return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký tài khoản.' });
            }
        }

        // 2. Kiểm tra trùng Email (nếu có)
        if (email) {
            const existingEmail = await Customer.findByEmail(email);
            if (existingEmail) {
                return res.status(400).json({ error: 'Email này đã được sử dụng.' });
            }
        }

        const id = await Customer.create(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Dùng khi khách hàng Checkout - tìm hoặc tạo mới để tránh trùng lặp
exports.findOrCreateCustomer = async (req, res) => {
    try {
        if (req.body.phone) {
            req.body.phone = req.body.phone.trim().replace(/\s+/g, '');
        }
        if (req.body.email) {
            req.body.email = req.body.email.trim().toLowerCase();
        }
        const customer = await Customer.findOrCreate(req.body);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        let { phone, email } = req.body;
        const customerId = req.params.id;

        // Chuẩn hóa và làm sạch dữ liệu
        if (phone) {
            phone = phone.trim().replace(/\s+/g, '');
            req.body.phone = phone;
        }
        if (email) {
            email = email.trim().toLowerCase();
            req.body.email = email;
        }

        // 1. Kiểm tra trùng Số điện thoại khi cập nhật
        if (phone) {
            const existingPhone = await Customer.findByPhone(phone);
            if (existingPhone && existingPhone.id !== customerId) {
                return res.status(400).json({ error: 'Số điện thoại này đã thuộc về tài khoản khác.' });
            }
        }

        // 2. Kiểm tra trùng Email khi cập nhật
        if (email) {
            const existingEmail = await Customer.findByEmail(email);
            if (existingEmail && existingEmail.id !== customerId) {
                return res.status(400).json({ error: 'Email này đã thuộc về tài khoản khác.' });
            }
        }

        await Customer.update(customerId, req.body);
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Permission Denied', message: 'Chỉ có Admin mới có quyền thực hiện thao tác này' });
    }
    try {
        await Customer.delete(req.params.id);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginCustomer = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại' });
        }

        const customer = await Customer.findByPhone(phone);

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với số điện thoại này' });
        }

        // If customer has a password set, verify it
        if (customer._password) {
            if (!password || password !== customer._password) {
                return res.status(401).json({ success: false, message: 'Mật khẩu không đúng' });
            }
        }
        // If no password set (walk-in customers added by admin), allow login by phone only

        // Return safe customer object (without password)
        const safeCustomer = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            avatar: customer.avatar
        };

        res.json({ success: true, customer: safeCustomer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
