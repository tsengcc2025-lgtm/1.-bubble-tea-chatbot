import { initMessage, addMessage, getMessages } from "../db/messages.js";

const DEFAULT_MODEL = "gpt-5-mini";

/**
 * 管理對話歷史與 OpenAI Chat Completion（對應課程 1.4 記憶模式）
 */
export class ChatManager {
  constructor(client, { systemPrompt, model = DEFAULT_MODEL } = {}) {
    if (!client) throw new Error("ChatManager 需要 OpenAI client");
    if (!systemPrompt) throw new Error("ChatManager 需要 systemPrompt");
    this.client = client;
    this.systemPrompt = systemPrompt;
    this.model = model;
  }

  async initialize() {
    await initMessage(this.systemPrompt);
  }

  async sendUserMessage(userText) {
    await addMessage(userText, "user");

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    await addMessage(content, "assistant");
    return content;
  }
}
