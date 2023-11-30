import { QdrantClient } from "@qdrant/qdrant-js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import {
  FINAL_DATA_FILENAME,
  FINAL_DATA_OUT_PATH,
  JSON_OUT_PATH,
  OPENAI_API_KEY,
} from "./configs.js";
import { FinalData } from "./types.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
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
const finalData: FinalData[] = JSON.parse(fileData.toString());

console.log("finalData: ", finalData);

// Step 2: Create embeddings

for (const data of finalData.slice(0, 5)) {
  console.log("data: ", data.id, data.description);
  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: doc.description,
  });
}

// await client.createCollection(collectionName, {
//   vectors: {
//     size: 1536,
//     distance: "Cosine",
//   },
//   optimizers_config: {
//     default_segment_number: 2,
//   },
//   replication_factor: 2,
// });

//  -------- Create payload indexes -------------

// await client.createPayloadIndex(collectionName, {
//   field_name: "description",
//   field_schema: "text",
//   wait: true,
// });

//  -------- Add points -------------

// let id = 5;
// for (const doc of [{ description: "hello" }]) {
//   const embeddings = await openai.embeddings.create({
//     model: "text-embedding-ada-002",
//     input: doc.description,
//   });

//   console.log("Created embeddings for id: ", embeddings);

//   await client.upsert(collectionName, {
//     wait: true,
//     points: [
//       {
//         id,
//         vector: embeddings.data[0].embedding,
//         payload: doc,
//       },
//     ],
//   });

//   console.log("Upsert doc for id: ", id);
//   console.log("---------------");
//   id++;
// }
