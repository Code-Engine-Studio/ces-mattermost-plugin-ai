import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import {
  EMBEDDINGS_OUT_PATH,
  FINAL_DATA_FILENAME,
  FINAL_DATA_OUT_PATH,
  OPENAI_API_KEY,
} from "./configs.js";
import { writeEmbeddings } from "./utils.js";

// Step 1: Create out dirs
if (!existsSync(EMBEDDINGS_OUT_PATH)) {
  await mkdir(EMBEDDINGS_OUT_PATH);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Step 1: Read final file from the out dir
if (!existsSync(FINAL_DATA_OUT_PATH)) {
  throw new Error(
    "Couldn't find the final data output path. Maybe you haven't run other steps yet. Please check the README"
  );
}

const fileData = readFileSync(
  path.join(FINAL_DATA_OUT_PATH, FINAL_DATA_FILENAME)
);

const finalData = JSON.parse(fileData.toString());
const qdrantPoints = [];

// Step 2: Create embeddings
for (const data of finalData.slice(0, 5)) {
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: data.description,
  });

  qdrantPoints.push({
    id: data.id,
    vector: embeddings.data[0].embedding,
    payload: data,
  });
}

// Step 4: Write out embeddings to file
await writeEmbeddings({
  value: qdrantPoints,
});
