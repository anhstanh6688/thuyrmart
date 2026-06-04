const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllCustomers);
router.post('/login', customerController.loginCustomer);           // ✅ specific before /:id
router.post('/find-or-create', customerController.findOrCreateCustomer); // ✅ for checkout flow
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
