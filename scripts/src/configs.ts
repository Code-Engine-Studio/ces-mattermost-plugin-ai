import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CES Brains configs
export const WIKI_CONFIGS = {
  WIKI_API_BASE_URL: process.env.WIKI_API_BASE_URL || "",
  TOKEN_ID: process.env.WIKI_TOKEN_ID || "",
  TOKEN_SECRET: process.env.WIKI_TOKEN_SECRET || "",
};

// Out paths
export const OUT_PATH = join(__dirname, "..", "out");
export const BOOKS_OUT_PATH = join(OUT_PATH, "books");
export const PAGES_OUT_PATH = join(OUT_PATH, "pages");
export const FINAL_DATA_OUT_PATH = join(OUT_PATH, "final-data");
export const EMBEDDINGS_OUT_PATH = join(OUT_PATH, "embeddings");

// Filenames
export const FINAL_DATA_FILENAME = "final_data.json";
export const EMBEDDINGS_FILENAME = "embeddings.json";

// OpenAI
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Qdrant configs
export const QDRANT_CONFIGS = {
  COLLECTION_NAME: process.env.QDRANT_COLLECTION_NAME || "test_collection",
  URL: process.env.QDRANT_URL,
};
