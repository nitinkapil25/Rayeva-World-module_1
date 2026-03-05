const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    seo_tags: {
      type: [String],
      default: []
    },
    sustainability_filters: {
      type: [String],
      default: []
    },
    ai_prompt: {
      type: String
    },
    ai_response: {
      type: Object,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
