# Module 1 - AI Auto-Category and Tag Generator

## Overview

This module analyzes a product's name and description with AI and generates structured metadata.
It reduces manual catalog work by assigning product categories, generating SEO tags, and suggesting sustainability filters.

The service is built with Node.js, Express.js, MongoDB, and OpenRouter.

## Features

- Auto-assigns a primary product category from a predefined list
- Suggests a relevant subcategory
- Generates 5 to 10 SEO tags
- Suggests sustainability filters (for example: plastic-free, biodegradable, recycled)
- Returns strict JSON output
- Stores analyzed products in MongoDB
- Logs AI interactions to `logs/ai.log`
- Keeps AI service logic separate from controller/business flow

## Tech Stack

Backend:
- Node.js
- Express.js

AI Integration:
- OpenRouter API (LLM)

Database:
- MongoDB
- Mongoose

Utilities:
- Axios
- dotenv
- cors

## System Flow

1. Client sends request to `POST /api/products/analyze`
2. `productController` validates input
3. `aiService` calls OpenRouter and enforces strict JSON schema
4. Response is validated (`category`, `subcategory`, `seo_tags`, `sustainability_filters`)
5. Prompt/response is logged to `logs/ai.log`
6. Result is saved in MongoDB
7. API returns saved product document

## Project Structure

```text
module_1
|-- server.js
|-- package.json
|-- .env
|-- logs/
|   `-- ai.log
`-- src/
    |-- app.js
    |-- config/
    |   `-- db.js
    |-- controllers/
    |   `-- productController.js
    |-- models/
    |   `-- Product.js
    |-- routes/
    |   |-- healthRoutes.js
    |   `-- productRoutes.js
    `-- utils/
        |-- errorHandler.js
        `-- logger.js
```

## API Endpoints

### Health Check

- Method: `GET`
- URL: `/api/health`

Sample response:

```json
{
  "status": "ok",
  "message": "Service is healthy",
  "uptime": 123.45,
  "timestamp": "2026-03-07T00:00:00.000Z"
}
```

### Analyze Product

- Method: `POST`
- URL: `/api/products/analyze`

Request body:

```json
{
  "name": "Bamboo Toothbrush",
  "description": "Eco-friendly bamboo toothbrush made from natural bamboo"
}
```

Sample response:

```json
{
  "success": true,
  "data": {
    "name": "Bamboo Toothbrush",
    "description": "Eco-friendly bamboo toothbrush made from natural bamboo",
    "category": "Personal Care",
    "subcategory": "Oral Care",
    "seo_tags": [
      "bamboo toothbrush",
      "eco-friendly",
      "sustainable oral care",
      "natural toothbrush",
      "plastic-free"
    ],
    "sustainability_filters": [
      "plastic-free",
      "biodegradable"
    ],
    "ai_prompt": "stored prompt",
    "ai_response": {
      "category": "Personal Care",
      "subcategory": "Oral Care",
      "seo_tags": ["..."],
      "sustainability_filters": ["..."]
    },
    "_id": "<mongo-id>",
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
}
```

## Predefined Categories

The AI must choose `category` from:

- Personal Care
- Kitchen
- Office Supplies
- Packaging
- Home & Living
- Food & Beverage
- Stationery

## AI Prompt Rules

The prompt enforces:

- strict JSON-only output
- required keys: `category`, `subcategory`, `seo_tags`, `sustainability_filters`
- `seo_tags` length between 5 and 10
- category restriction to the predefined list

## Database Schema

Stored product shape (simplified):

```json
{
  "name": "String",
  "description": "String",
  "category": "String",
  "subcategory": "String",
  "seo_tags": ["String"],
  "sustainability_filters": ["String"],
  "ai_prompt": "String",
  "ai_response": "Object",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
# Optional
OPENROUTER_MODEL=openai/gpt-4o-mini
```

3. Start the server:

```bash
npm run dev
```

Server URL:

```text
http://localhost:5000
```

## Testing

Use Postman or Thunder Client.

Example request:

- `POST http://localhost:5000/api/products/analyze`

```json
{
  "name": "Reusable Steel Water Bottle",
  "description": "Durable stainless steel bottle designed to replace single-use plastic bottles"
}
```

## Future Improvements

- Add caching for repeated AI responses
- Add sustainability impact scoring
- Add product image analysis
- Add batch product processing

## Author

Nitn kapil
LinkedIn: https://www.linkedin.com/in/nitin-kapil-313188328/