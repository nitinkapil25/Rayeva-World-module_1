const Product = require("../models/Product");
const { analyzeProductWithAI } = require("../services/aiService");
const { logAIInteraction } = require("../utils/logger");

const analyzeProduct = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      const error = new Error("Both name and description are required");
      res.status(400);
      throw error;
    }

    const ai_prompt = "stored prompt";
    const aiResult = await analyzeProductWithAI(name, description);
    await logAIInteraction({
      name,
      prompt: ai_prompt,
      response: aiResult
    });

    const product = new Product({
      name,
      description,
      category: aiResult.category,
      subcategory: aiResult.subcategory,
      seo_tags: aiResult.seo_tags,
      sustainability_filters: aiResult.sustainability_filters,
      ai_prompt,
      ai_response: aiResult
    });

    await product.save();

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  analyzeProduct
};
