const express = require('express');
const { analyzeProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/analyze', analyzeProduct);

module.exports = router;
