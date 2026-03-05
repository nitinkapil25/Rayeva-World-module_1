const analyzeProduct = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      const error = new Error('Both name and description are required');
      res.status(400);
      throw error;
    }

    return res.status(200).json({
      message: 'Product received for AI analysis',
      product: {
        name,
        description
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  analyzeProduct
};
