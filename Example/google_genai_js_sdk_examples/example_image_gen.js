
import { GenerativeAIClient } from "@google/generative-ai";

async function main() {
  const client = new GenerativeAIClient({ apiKey: process.env.API_KEY });

  const response = await client.image.generate({
    model: "models/image-gecko-001",
    prompt: "A futuristic cityscape at sunset",
    numImages: 1
  });

  console.log("Image URL:", response.data[0].url);
}

main();
