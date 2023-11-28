import { QdrantClient } from "@qdrant/qdrant-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const collectionName = "test_documents_collection";

  const client = new QdrantClient({ url: "http://127.0.0.1:6333" });

  //  -------- Add points -------------

  const embeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "Alien invasion",
  });

  console.log("embeddings: ", embeddings);

  const result = await client.search(collectionName, {
    vector: embeddings.data[0].embedding,
  });

  console.log("Result: ", result);
  console.log("---------------");

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
