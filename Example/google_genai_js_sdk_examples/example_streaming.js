
import { GenerativeAIClient } from "@google/generative-ai";

async function main() {
  const client = new GenerativeAIClient({ apiKey: process.env.API_KEY });

  console.log("Streaming response:");
  for await (const chunk of client.chat.completions.stream({
    model: "models/chat-bison-001",
    messages: [{ author: "user", content: "Tell me a joke." }]
  })) {
    process.stdout.write(chunk.choices[0].message.content);
  }
  console.log("\nDone.");
}

main();
