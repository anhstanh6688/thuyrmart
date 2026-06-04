const Sale = require('../models/Sale');

exports.getAllSales = async (req, res) => {
    try {
        const sales = await Sale.getAll();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.getById(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalesByCustomerId = async (req, res) => {
    try {
        const sales = await Sale.getByCustomerId(req.params.customerId);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        const { order, items } = req.body;
        // Default user_id to 1 (admin) if not provided
        order.user_id = order.user_id || 1;
        
        const saleId = await Sale.create(order, items);
        res.status(201).json({ success: true, saleId });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.cancelSale = async (req, res) => {
    try {
        const success = await Sale.updateStatus(req.params.id, 'cancelled');
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Đã hủy đơn hàng' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.paySale = async (req, res) => {
    try {
        const success = await Sale.updateStatus(req.params.id, 'completed');
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Thanh toán thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const success = await Sale.updateStatus(req.params.id, status);
        if (!success) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

let webhookLogs = [];

exports.getWebhookLogs = (req, res) => {
    res.json(webhookLogs);
};

exports.mockPaymentSuccess = async (req, res) => {
    try {
        const sale = await Sale.getById(req.params.id);
        if (!sale) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        
        const SaleModel = require('mongoose').model('SaleOrder');
        await SaleModel.findByIdAndUpdate(req.params.id, { paid_amount: sale.final_amount });
        
        res.json({ success: true, message: 'Giả lập chuyển tiền thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.renewTimer = async (req, res) => {
    try {
        const result = await Sale.renewTimer(req.params.id);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.bankTransferWebhook = async (req, res) => {
    try {
        console.log('--- Received Bank Transfer Webhook ---');
        console.log('Headers:', JSON.stringify(req.headers));
        console.log('Body:', JSON.stringify(req.body));
        
        // Save to global logs for debugging
        webhookLogs.unshift({
            timestamp: new Date().toISOString(),
            headers: req.headers,
            body: req.body
        });
        if (webhookLogs.length > 20) webhookLogs.pop();
        
        // 1. Verify Secure Token (Optional)
        const authorizationHeader = req.headers['authorization'];
        const expectedToken = process.env.PAYMENT_WEBHOOK_TOKEN;
        if (expectedToken && authorizationHeader !== expectedToken) {
            console.warn('Unauthorized payment webhook request!');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // 2. Extract transaction details (Support SePay and Casso)
        let description = '';
        let amount = 0;
        
        // Check SePay
        if (req.body.transactionContent || req.body.body) {
            description = req.body.transactionContent || req.body.body;
            amount = Number(req.body.transferAmount || req.body.amountIn || 0);
        } 
        // Check Casso
        else if (req.body.data && Array.isArray(req.body.data)) {
            const item = req.body.data[0];
            if (item) {
                description = item.description;
                amount = Number(item.amount || 0);
            }
        }
        // Generic fallback or query parameter fallback for testing
        else {
            description = req.body.description || req.query.description || '';
            amount = Number(req.body.amount || req.query.amount || 0);
        }
        
        if (!description) {
            console.warn('Invalid webhook payload: no description/content found.');
            return res.status(400).json({ error: 'Nội dung chuyển khoản trống' });
        }
        
        // 3. Extract Order ID (24-character Mongoose ObjectId)
        // VietQR generates description like "ThuyRMart CK HD60d5ec49f1b29a2c286d5e75"
        // We match exactly a 24-character hexadecimal string
        const match = description.match(/[0-9a-fA-F]{24}/);
        if (!match) {
            console.log(`Could not find a 24-character order ID in description: "${description}"`);
            return res.status(200).json({ success: false, message: 'Nội dung chuyển khoản không chứa mã đơn hàng hợp lệ' });
        }
        
        const orderId = match[0];
        console.log(`Extracted Order ID: ${orderId}, Amount: ${amount}`);
        
        // 4. Retrieve order from database
        const SaleModel = require('mongoose').model('SaleOrder');
        const order = await SaleModel.findById(orderId);
        
        if (!order) {
            console.log(`Order with ID ${orderId} not found in database.`);
            return res.status(200).json({ success: false, message: `Không tìm thấy đơn hàng #${orderId}` });
        }
        
        // If already paid, do nothing but return success
        if (order.paid_amount >= order.final_amount) {
            console.log(`Order ${orderId} is already paid.`);
            return res.status(200).json({ success: true, message: 'Đơn hàng đã được thanh toán trước đó' });
        }
        
        // 5. Update payment details
        const totalPaidSoFar = order.paid_amount + amount;
        
        if (totalPaidSoFar >= order.final_amount) {
            // Fully paid: update status to completed using the service class logic (debt, inventory, logs)
            const SaleService = require('../models/Sale');
            await SaleService.updateStatus(orderId, 'completed');
            console.log(`Order ${orderId} marked as fully paid and completed.`);
        } else {
            // Partially paid: increment paid_amount
            await SaleModel.findByIdAndUpdate(orderId, { $inc: { paid_amount: amount } });
            console.log(`Order ${orderId} updated with partial payment. Paid so far: ${totalPaidSoFar}`);
        }
        
        return res.status(200).json({ success: true, message: 'Xử lý thanh toán thành công' });
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: error.message });
    }
};
