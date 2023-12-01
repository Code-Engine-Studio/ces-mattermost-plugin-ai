import { QdrantClient } from "@qdrant/qdrant-js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  EMBEDDINGS_FILENAME,
  EMBEDDINGS_OUT_PATH,
  QDRANT_CONFIGS,
} from "./configs.js";

// Step 1: Read final file from the out dir
if (!existsSync(EMBEDDINGS_OUT_PATH)) {
  throw new Error(
    "Couldn't find the embeddings directory. Maybe you haven't run other steps yet. Please check the README"
  );
}

// Step 2: Create collection if not exists
const qdrantClient = new QdrantClient({ url: QDRANT_CONFIGS.URL });
const collectionNames = (await qdrantClient.getCollections()).collections.map(
  (collection) => collection.name
);

if (!collectionNames.includes(QDRANT_CONFIGS.COLLECTION_NAME)) {
  await qdrantClient.createCollection(QDRANT_CONFIGS.COLLECTION_NAME, {
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
    optimizers_config: {
      default_segment_number: 2,
    },
    replication_factor: 2,
  });
}

// Step 3: Read data from file and upsert to the collection
const fileData = readFileSync(
  path.join(EMBEDDINGS_OUT_PATH, EMBEDDINGS_FILENAME)
);

const embeddingsData = JSON.parse(fileData.toString());

// Step 4: Upsert data to collection
await qdrantClient.upsert(QDRANT_CONFIGS.COLLECTION_NAME, {
  wait: true,
  points: embeddingsData,
});

console.log("Finished upsert to Qdrant database 🎉🎉🎉");
