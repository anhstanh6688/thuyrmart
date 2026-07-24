const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

const returnController = require('../controllers/returnController');

router.get('/', saleController.getAllSales);
router.get('/customer/:customerId', saleController.getSalesByCustomerId); // ✅ specific route BEFORE dynamic
router.get('/webhook-logs', saleController.getWebhookLogs); // ✅ Register specific route before /:id
router.get('/:id', saleController.getSaleById);
router.post('/checkout', saleController.checkout);
router.post('/:id/return', returnController.returnSaleItems);
router.put('/:id/cancel', saleController.cancelSale);
router.put('/:id/pay', saleController.paySale);
router.put('/:id/status', saleController.updateStatus);
router.put('/:id/mock-pay', saleController.mockPaymentSuccess);
router.put('/:id/renew-timer', saleController.renewTimer);
router.post('/webhook', saleController.bankTransferWebhook);

module.exports = router;
