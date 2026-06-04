const express = require('express');
const router = express.Router();
const supplierPaymentController = require('../controllers/supplierPaymentController');

router.post('/pay', supplierPaymentController.payDebt);
router.get('/supplier/:id', supplierPaymentController.getPaymentsBySupplier);

module.exports = router;
