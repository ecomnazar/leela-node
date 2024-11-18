import express from "express";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { handleStartCommand } from "./commands/start";
import { callbackHandler } from "./handlers/callbackHandler";
import { messageHandler } from "./handlers/messageHandler";
import { SESSION } from "./constants/session";
import { mainPayment } from "../payments/main";

require("dotenv").config();

interface SessionData
  extends Record<(typeof SESSION)[keyof typeof SESSION], any> {}

// const ttlInSeconds = 72 * 60 * 60; // 72 часа в секундах
// const redisInstance = new IORedis("redis://localhost:6379/0");
// const storage = new RedisAdapter({
//   instance: redisInstance,
//   ttl: ttlInSeconds,
// });

const initial = (): SessionData => {
  console.log("Initializing session data");
  return {
    step11Question: [],
    step11Answers: [],
    step11CurrentQuestionIndex: 0,
    stepPaymentQuestionsCurrentQuestionIndex: 0,
    stepPaymentTotalPrice: 0,
    paymentQuestionMessageId: 0,
    tenQuestionMessageId: 0,
    sessionFirstPaymentPlanUrl: "",
    sessionSecondPaymentPlanUrl: "",
  };
};

// redisInstance
//   .ping()
//   .then((res) => {
//     console.log("Redis ping:", res); // Ожидается, что вернется "PONG"
//   })
//   .catch((err) => {
//     console.error("Redis connection error:", err);
//   });

type MyContext = Context & SessionFlavor<SessionData>;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

export const app = express();

bot.use(session({ initial }));

mainPayment();

app.listen(process.env.PAYMENT_BACKEND_PORT, async () => {
  await bot.api.deleteWebhook();
  await bot.init();
  const webhookUrl = "https://leela.steamp2e.com/webhook-h";
  await bot.api.setWebhook(webhookUrl);
  console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
  console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
});

handleStartCommand();
callbackHandler();
messageHandler();

bot.on("pre_checkout_query", async (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});

// Map is used for simplicity. For production use a database
const paidUsers = new Map();

bot.on("message:successful_payment", (ctx) => {
  console.log(ctx.message.successful_payment);
  if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
    return;
  }

  console.log(ctx.from.id);
  console.log(JSON.stringify(ctx.message.successful_payment));
  console.log(ctx.message.successful_payment);

  paidUsers.set(
    ctx.from.id,
    ctx.message.successful_payment.telegram_payment_charge_id
  );
});

bot.command("status", (ctx) => {
  // @ts-ignore
  // const message = paidUsers.has(ctx.from.id)
  //   ? "You have paid"
  //   : "You have not paid yet";
  // return ctx.reply(message);
});

// bot.start();
