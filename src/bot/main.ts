import { Bot, Context, session, SessionFlavor } from "grammy";
import express from "express";
import { handleStartCommand } from "./commands/start";
import { callbackHandler } from "./handlers/callbackHandler";
import { messageHandler } from "./handlers/messageHandler";
import { SESSION } from "./constants/session";
import { RedisAdapter } from "@grammyjs/storage-redis";
import IORedis from "ioredis";

require("dotenv").config();

interface SessionData
  extends Record<(typeof SESSION)[keyof typeof SESSION], any> {}

const ttlInSeconds = 72 * 60 * 60; // 72 часа в секундах
const redisInstance = new IORedis("redis://localhost:6379/0");
const storage = new RedisAdapter({
  instance: redisInstance,
  ttl: ttlInSeconds,
});

const initial = (): SessionData => {
  console.log("Initializing session data");
  return {
    step11Question: [],
    step11Answers: [],
    step11CurrentQuestionIndex: 0,
  };
};

redisInstance
  .ping()
  .then((res) => {
    console.log("Redis ping:", res); // Ожидается, что вернется "PONG"
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

type MyContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

export const app = express();

bot.use(session({ initial }));

// mainPayment();

app.listen(process.env.PAYMENT_BACKEND_PORT, async () => {
  await bot.api.deleteWebhook();
  await bot.init();
  // const webhookUrl = "https://leela.steamp2e.com/webhook-h";
  // await bot.api.setWebhook(webhookUrl);
  // console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
  console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
});

handleStartCommand();
callbackHandler();
messageHandler();

bot.start();
