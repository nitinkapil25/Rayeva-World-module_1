const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

const CATEGORY_LIST = [
  'Personal Care',
  'Kitchen',
  'Office Supplies',
  'Packaging',
  'Home & Living',
  'Food & Beverage',
  'Stationery'
];

const extractJsonObject = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('AI response content is empty or not a string');
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (_err) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('AI response does not contain valid JSON');
    }

    try {
      return JSON.parse(match[0]);
    } catch (_parseErr) {
      throw new Error('AI response JSON is malformed');
    }
  }
};

const validateAiPayload = (payload) => {
  const hasKeys =
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'category' in payload &&
    'subcategory' in payload &&
    'seo_tags' in payload &&
    'sustainability_filters' in payload;

  if (!hasKeys) {
    throw new Error('AI response JSON missing required keys');
  }

  if (typeof payload.category !== 'string' || !payload.category.trim()) {
    throw new Error('AI response category must be a non-empty string');
  }

  if (!CATEGORY_LIST.includes(payload.category.trim())) {
    throw new Error('AI response category is not in predefined category list');
  }

  if (typeof payload.subcategory !== 'string') {
    throw new Error('AI response subcategory must be a string');
  }

  if (!Array.isArray(payload.seo_tags)) {
    throw new Error('AI response seo_tags must be an array');
  }

  if (payload.seo_tags.length < 5 || payload.seo_tags.length > 10) {
    throw new Error('AI response seo_tags must contain 5 to 10 items');
  }

  if (!payload.seo_tags.every((tag) => typeof tag === 'string' && tag.trim())) {
    throw new Error('AI response seo_tags must only contain non-empty strings');
  }

  if (!Array.isArray(payload.sustainability_filters)) {
    throw new Error('AI response sustainability_filters must be an array');
  }

  if (
    !payload.sustainability_filters.every(
      (filter) => typeof filter === 'string' && filter.trim()
    )
  ) {
    throw new Error(
      'AI response sustainability_filters must only contain non-empty strings'
    );
  }

  return {
    category: payload.category.trim(),
    subcategory: payload.subcategory.trim(),
    seo_tags: payload.seo_tags.map((tag) => tag.trim()),
    sustainability_filters: payload.sustainability_filters.map((filter) =>
      filter.trim()
    )
  };
};

const analyzeProductWithAI = async (name, description) => {
  if (!name || !description) {
    throw new Error('Both name and description are required for AI analysis');
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const prompt = [
    'You are an AI assistant for product categorization.',
    'Analyze the product and return ONLY strict JSON with no markdown and no extra text.',
    'Pick category only from this list:',
    CATEGORY_LIST.join(', '),
    'Generate:',
    '- category',
    '- subcategory',
    '- seo_tags (array of 5 to 10 strings)',
    '- sustainability_filters (array of relevant values like plastic-free, compostable, vegan, recycled, biodegradable)',
    'Required output schema:',
    '{',
    '  "category": "",',
    '  "subcategory": "",',
    '  "seo_tags": [],',
    '  "sustainability_filters": []',
    '}',
    '',
    `Product name: ${name}`,
    `Product description: ${description}`
  ].join('\n');

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;
    const parsed = extractJsonObject(content);
    return validateAiPayload(parsed);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        'OpenRouter API error';
      throw new Error(`OpenRouter request failed (${status}): ${message}`);
    }

    if (
      error.message.includes('AI response') ||
      error.message.includes('required') ||
      error.message.includes('configured')
    ) {
      throw error;
    }

    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

module.exports = {
  analyzeProductWithAI
};
