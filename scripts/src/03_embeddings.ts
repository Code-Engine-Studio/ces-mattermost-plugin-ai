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
import { sleep, writeEmbeddings } from "./utils.js";

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

const wikiData = JSON.parse(fileData.toString());
const qdrantPoints = [];

// Step 2: Create embeddings
for (let i = 0; i < wikiData.length; i++) {
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: wikiData[i].description,
  });

  qdrantPoints.push({
    id: wikiData[i].id,
    vector: embeddings.data[0].embedding,
    payload: wikiData[i],
  });

  console.log(
    `Created embeddings for page: ${wikiData[i].title} - completed ${i + 1}/${
      wikiData.length
    }`
  );
  await sleep(1000);
}

// Step 4: Write out embeddings to file
await writeEmbeddings({
  value: qdrantPoints,
});

console.log("Finished generated embeddings from the wiki 🚀🚀🚀");
