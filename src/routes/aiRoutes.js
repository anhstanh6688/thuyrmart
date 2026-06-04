const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/query', aiController.queryAI);

module.exports = router;
