const User = require('../models/User');

module.exports = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
        return next(); // If no user ID provided, skip (could be a public route or login)
    }

    try {
        let user = await User.getById(userId);
        if (!user) {
            const Customer = require('../models/Customer');
            const customer = await Customer.getById(userId);
            if (customer) {
                user = {
                    id: customer.id,
                    username: customer.name,
                    full_name: customer.name,
                    phone: customer.phone,
                    role: 'customer',
                    status: true
                };
            }
        }
        if (!user || !user.status) {
            return res.status(403).json({ 
                error: 'Account Locked', 
                message: 'Tài khoản của bạn đã bị khóa hoặc không tồn tại. Vui lòng đăng xuất.' 
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Auth Error' });
    }
};
