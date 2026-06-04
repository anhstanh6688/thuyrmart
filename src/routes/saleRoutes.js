const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAllSales);
router.get('/customer/:customerId', saleController.getSalesByCustomerId); // ✅ specific route BEFORE dynamic
router.get('/:id', saleController.getSaleById);
router.post('/checkout', saleController.checkout);
router.put('/:id/cancel', saleController.cancelSale);
router.put('/:id/pay', saleController.paySale);
router.put('/:id/status', saleController.updateStatus);
router.put('/:id/mock-pay', saleController.mockPaymentSuccess);
router.post('/webhook', saleController.bankTransferWebhook);
router.get('/webhook-logs', saleController.getWebhookLogs);

module.exports = router;
