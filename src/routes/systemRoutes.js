const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
router.post('/reset', systemController.resetTestData);
router.get('/backup', systemController.exportBackup);
router.post('/restore', systemController.importBackup);

module.exports = router;
