const TelegramBot = require("node-telegram-bot-api");
const OpenAIApi = require("openai");
const { config } = require("dotenv");

config();

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
let openai;

// Initialize OpenAI API
const initOpenAI = () => {
  try {
    openai = new OpenAIApi({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (e) {
    console.log("Error initializing OpenAI:", e);
  }
};
initOpenAI();

console.log(
  "------------------------- running open ai chat bot service ------------------------------"
);

bot.on("message", (message) => {
  if (message.text.startsWith("/prompt")) {
    const chatId = message.chat.id;
    const messageText = message.text.replace("/prompt", "").trim();

    console.log("Asked:", messageText);


    if (!openai) {
      bot.sendMessage(
        chatId,
        "OpenAI not initialized yet. Please try again later."
      );
      return;
    }

    openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: messageText }],
      })
      .then((res) => {
        const result = res.choices[0].message.content;
        console.log("Response:", result);
        bot.sendMessage(chatId, result);
      })
      .catch((err) => {
        console.log("Error generating response:", err);
        bot.sendMessage(chatId, "An error occurred. Please try again later.");
      });
  } else {
    bot.sendMessage(
      message.chat.id,
      `Hello ${message.from.first_name}, use "/prompt" followed by your query`
    );
  }
});
