const User = require('../models/User');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    // We accept phone (and for legacy support, username)
    const { phone, username, password } = req.body;
    let loginIdentifier = phone || username;

    if (!loginIdentifier) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại hoặc tên đăng nhập' });
    }
    
    // Normalize phone number if it contains spaces
    loginIdentifier = loginIdentifier.trim().replace(/\s+/g, '');

    try {
        // 1. Check if it's an Admin/Staff
        let user = null;
        if (phone) {
            user = await User.findByPhone(phone);
        }
        if (!user && username) {
            user = await User.findByUsername(username);
        }
        if (!user && loginIdentifier) { // Fallback, treat identifier as username
            user = await User.findByUsername(loginIdentifier);
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            if (!user.status) {
                return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa' });
            }
            return res.json({ 
                success: true, 
                user: { id: user.id, name: user.full_name, role: user.role } 
            });
        }

        // 2. Check if it's a Customer
        const customer = await Customer.findByPhone(loginIdentifier);
        
        if (customer) {
            if (customer._password) {
                if (password === customer._password) {
                    return res.json({ 
                        success: true, 
                        user: { 
                            id: customer.id, 
                            name: customer.name, 
                            phone: customer.phone, 
                            address: customer.address,
                            avatar: customer.avatar,
                            role: 'customer' // Explicitly set role for FE routing
                        } 
                    });
                } else {
                    return res.status(401).json({ success: false, message: 'Mật khẩu không đúng' });
                }
            } else {
                // If customer has no password set (e.g. walk-in), we might block login or allow it.
                // Currently allowing it (from previous logic)
                return res.json({ 
                    success: true, 
                    user: { 
                        id: customer.id, 
                        name: customer.name, 
                        phone: customer.phone, 
                        address: customer.address,
                        avatar: customer.avatar,
                        role: 'customer' 
                    } 
                });
            }
        }

        res.status(401).json({ success: false, message: 'Sai số điện thoại hoặc mật khẩu' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
