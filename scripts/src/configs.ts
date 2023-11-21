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
export const JSON_OUT_PATH = join(OUT_PATH, "json");
export const PLAINTEXT_OUT_PATH = join(OUT_PATH, "plaintext");
