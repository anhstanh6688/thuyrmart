const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/logs', inventoryController.getLogs);
router.post('/adjust', inventoryController.adjustStock);
router.put('/adjust', inventoryController.adjustStock);
router.post('/', inventoryController.createLog);

module.exports = router;
