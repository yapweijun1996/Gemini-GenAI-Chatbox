
import { GenerativeAIClient } from "@google/generative-ai";

async function main() {
  const client = new GenerativeAIClient({ apiKey: process.env.API_KEY });

  const response = await client.chat.completions.create({
    model: "models/chat-bison-001",
    messages: [{ author: "user", content: "Who won the 2024 Olympics?" }]
  });

  console.log("Chatbot says:", response.choices[0].message.content);
}

main();
