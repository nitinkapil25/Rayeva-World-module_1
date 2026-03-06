const fs = require("fs");
const path = require("path");

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "ai.log");

const logAIInteraction = async ({ name, prompt, response }) => {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });

    const entry = {
      timestamp: new Date().toISOString(),
      name: name || "",
      prompt: prompt || "",
      response: response || {}
    };

    await fs.promises.appendFile(
      LOG_FILE,
      `${JSON.stringify(entry)}\n`,
      "utf8"
    );
  } catch (error) {
    console.error("AI logging failed:", error.message);
  }
};

module.exports = {
  logAIInteraction
};
