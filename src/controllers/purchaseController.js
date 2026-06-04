const Purchase = require('../models/Purchase');

exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.getAll();
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.getById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPurchase = async (req, res) => {
    try {
        const { purchaseData, items } = req.body;
        purchaseData.user_id = purchaseData.user_id || 1;
        const id = await Purchase.create(purchaseData, items);
        res.status(201).json({ id, ...purchaseData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
