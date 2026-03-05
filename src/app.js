const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
