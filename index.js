const TelegramBot = require("node-telegram-bot-api");
const Configuration = require("openai");
const OpenAIApi = require("openai");

const { config } = require("dotenv");
config();

const TOKEN = process.env.TELEGRAM_TOKEN;
console.log(
  TelegramBot,
  "------------------------- running open ai chat bot service ------------------------------"
);
const bot = new TelegramBot(TOKEN, { polling: true });
let firstMsg = true;
var openai;
bot.on("message", (message) => {
  if (firstMsg) {
    bot.sendMessage(
      message.chat.id,
      `Hello ${message.chat.first_name}, use "/prompt" followed by your query`
    );
    firstMsg = false;
  }
  console.log("question asked  ---------------------- ", message.text);
  sendMessage();
});

const sendMessage = () => {
  bot.onText(/\/prompt (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const messageText = match[1];
    try {
      openai.chat.completions
        .create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: messageText }],
        })
        .then((res) => {
          const result = res.choices[0].message.content;
          console.log("response ---------------------- ", result);
          bot.sendMessage(chatId, result);
        });
    } catch (e) {
      console.log(
        "----------------------------------- error ----------------------------------",
        e
      );
    }
  });
};

const hello = () => {
  try {
    openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
  } catch (e) {
    console.log(
      "--------------------------------- error -------------------------------------",
      e
    );
  }
};
hello();
