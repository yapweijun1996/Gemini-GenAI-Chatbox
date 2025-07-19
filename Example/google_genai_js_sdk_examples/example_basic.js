
import { GenerativeAIClient } from "@google/generative-ai";

async function main() {
  const client = new GenerativeAIClient({ apiKey: process.env.API_KEY });

  const response = await client.generateText({
    model: "models/text-bison-001",
    prompt: "Write a friendly greeting message."
  });

  console.log("Generated Text:", response.text);
}

main();
