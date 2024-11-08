import { Bot } from "grammy";
import express from "express";
import { createPayment } from "./handlers/payment";
import { handleStartCommand } from "./commands/start";
import { callbackKeyboardMaker } from "./lib/callbackKeyboardMaker";
import { CALLBACK_ACTIONS } from "./constants/callbackActions";

require("dotenv").config();
export const bot = new Bot(process.env.BOT_TOKEN!);
export const app = express();

// mainPayment();

app.listen(process.env.PAYMENT_BACKEND_PORT, async () => {
  await bot.api.deleteWebhook();
  await bot.init();
  const webhookUrl = "https://leela.steamp2e.com/webhook-h";
  await bot.api.setWebhook(webhookUrl);
  console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
  console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
});

const PENDING_STATES = {
  WAITING_FOR_SECOND_QUESTION: "waiting_for_second_question",
  WAITING_FOR_THIRD_QUESTION: "waiting_for_third_question",
};

const userStates: { [key: number]: string } = {};

const sendSecondQuestion = async (userId: number) => {
  const messageText =
    "Выберите, к какому направлению больше подходит ваш случай";
  const inline_keyboard = callbackKeyboardMaker([
    {
      text: "Button 3",
      callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_1,
    },
    {
      text: "Button 4",
      callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_2,
    },
    {
      text: "Button 5",
      callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_3,
    },
  ]);
  await bot.api.sendMessage(userId, messageText, {
    reply_markup: { inline_keyboard },
  });
};

const sendSubscritionPlans = async (userId: number) => {
  const messageText = "Выберите тариф";
  await bot.api.sendMessage(userId, messageText, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Тариф 100",
            callback_data: "plan_100",
          },
        ],
        [
          {
            text: "Тариф 200",
            callback_data: "plan_200",
          },
        ],
        [
          {
            text: "Тариф 300",
            callback_data: "plan_300",
          },
        ],
      ],
    },
  });
};

bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const chatId = ctx.callbackQuery.message?.chat.id!;

  switch (callbackData) {
    case CALLBACK_ACTIONS.QUESTION_1_OPTION_1:
    case CALLBACK_ACTIONS.QUESTION_1_OPTION_2:
      userStates[chatId] = PENDING_STATES.WAITING_FOR_SECOND_QUESTION;
      await ctx.reply("Опишите ваш вопрос, проблему или вопрос");
      break;

    case CALLBACK_ACTIONS.QUESTION_2_OPTION_1:
    case CALLBACK_ACTIONS.QUESTION_2_OPTION_2:
    case CALLBACK_ACTIONS.QUESTION_2_OPTION_3:
      userStates[chatId] = PENDING_STATES.WAITING_FOR_THIRD_QUESTION;
      await ctx.reply("Крайний шаг и мы начинаем! Как вас зовут?");
      break;
    case "plan_100":
      createPayment(chatId, 100);
      break;
    case "plan_200":
      createPayment(chatId, 200);
      break;
    case "plan_300":
      createPayment(chatId, 300);
      break;
  }

  await ctx.answerCallbackQuery();
});

bot.on("message", async (ctx) => {
  const chatId = ctx.message?.chat.id!;
  const firstName = ctx.message.chat.first_name;
  const messageText = ctx.message.text;

  if (userStates[chatId] === PENDING_STATES.WAITING_FOR_SECOND_QUESTION) {
    delete userStates[chatId]; // Clear the state
    await sendSecondQuestion(chatId);
  }
  if (userStates[chatId] === PENDING_STATES.WAITING_FOR_THIRD_QUESTION) {
    delete userStates[chatId]; // Clear the state
    await ctx.reply(
      `${firstName} спасибо за ответы! Мы свяжемся с вами в ближайшее время`
    );
  }

  if (messageText === "pay") {
    // createPayment(chatId, 100);
    sendSubscritionPlans(chatId);
  }
});

// bot.start();
//

handleStartCommand();
