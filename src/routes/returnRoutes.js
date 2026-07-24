const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');

router.post('/:id/return', returnController.returnSaleItems);

module.exports = router;
