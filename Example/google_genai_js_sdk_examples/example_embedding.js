
import { GenerativeAIClient } from "@google/generative-ai";

async function main() {
  const client = new GenerativeAIClient({ apiKey: process.env.API_KEY });

  const response = await client.embedText({
    model: "models/textembedding-gecko-001",
    text: ["Sample sentence to embed."]
  });

  console.log("Embedding vector:", response.embeddings[0].embedding);
}

main();
