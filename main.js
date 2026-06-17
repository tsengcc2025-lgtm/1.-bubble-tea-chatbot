import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { ChatManager } from "./lib/ChatManager.js";
import { BUBBLE_TEA_EXPERT_PROMPT } from "./lib/systemPrompt.js";

if (!OPENAI_API_KEY) {
  console.error("請在 .env 設定 OPENAI_API_KEY（可複製 .env.example）");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 120_000,
});
const chat = new ChatManager(client, { systemPrompt: BUBBLE_TEA_EXPERT_PROMPT });

await chat.initialize();

console.log("手搖飲推薦達人 — 輸入 exit 結束\n");

try {
  while (true) {
    const userQuestion = (await input({ message: "請輸入你的問題：" })).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const reply = await chat.sendUserMessage(userQuestion);
    console.log(`\n${reply}\n`);
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
