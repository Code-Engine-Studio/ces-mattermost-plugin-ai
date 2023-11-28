import { QdrantClient } from "@qdrant/qdrant-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const collectionName = "test_documents_collection";

  const client = new QdrantClient({ url: "http://127.0.0.1:6333" });

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

  await client.createPayloadIndex(collectionName, {
    field_name: "description",
    field_schema: "text",
    wait: true,
  });

  //  -------- Add points -------------

  let id = 5;
  for (const doc of [{ description: "hello" }]) {
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: doc.description,
    });

    console.log("Created embeddings for id: ", embeddings);

    await client.upsert(collectionName, {
      wait: true,
      points: [
        {
          id,
          vector: embeddings.data[0].embedding,
          payload: doc,
        },
      ],
    });

    console.log("Upsert doc for id: ", id);
    console.log("---------------");
    id++;
  }

  return 0;
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
