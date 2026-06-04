const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/logs', inventoryController.getLogs);
router.post('/adjust', inventoryController.adjustStock);

module.exports = router;
