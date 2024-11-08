import { Bot } from "grammy";
import { InlineKeyboardButton, InputFile } from "grammy/types";
import { createPayment } from "./handlers/payment";
import express from "express";
import { mainPayment } from "../payments/main";

require("dotenv").config();

const IMG_URI = "https://nazarly.digital/Untitled2.png";
export const bot = new Bot(process.env.BOT_TOKEN!);

export const app = express();

mainPayment();

app.listen(process.env.PAYMENT_BACKEND_PORT, async () => {
  // await bot.api.deleteWebhook();
  const webhookUrl = "https://leela.steamp2e.com/webhook-h";
  await bot.api.setWebhook(webhookUrl);
  console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
  console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
});

const CALLBACK_ACTIONS = {
  QUESTION_1_OPTION_1: "1.1",
  QUESTION_1_OPTION_2: "1.2",
  QUESTION_2_OPTION_1: "2.1",
  QUESTION_2_OPTION_2: "2.2",
  QUESTION_2_OPTION_3: "2.3",
};

const PENDING_STATES = {
  WAITING_FOR_SECOND_QUESTION: "waiting_for_second_question",
  WAITING_FOR_THIRD_QUESTION: "waiting_for_third_question",
};

const userStates: { [key: number]: string } = {};

const keyboardMaker = (
  options: { text: string; callbackData: string }[]
): InlineKeyboardButton[][] => {
  return options.map((option) => [
    {
      text: option.text,
      callback_data: option.callbackData,
    },
  ]);
};

const sendFirstQuestion = async (userId: number) => {
  const inline_keyboard = keyboardMaker([
    {
      text: "У меня есть вопрос, проблема, запрос",
      callbackData: CALLBACK_ACTIONS.QUESTION_1_OPTION_1,
    },
    {
      text: "Не знаю, хочу пройти тест",
      callbackData: CALLBACK_ACTIONS.QUESTION_1_OPTION_2,
    },
  ]);
  await bot.api.sendPhoto(userId, IMG_URI, {
    reply_markup: { inline_keyboard },
  });
};

const sendSecondQuestion = async (userId: number) => {
  const messageText =
    "Выберите, к какому направлению больше подходит ваш случай";
  const inline_keyboard = keyboardMaker([
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
            url: createPayment(userId, 100),
          },
        ],
        [
          {
            text: "Тариф 200",
            url: createPayment(userId, 200),
          },
        ],
        [
          {
            text: "Тариф 300",
            url: createPayment(userId, 300),
          },
        ],
      ],
    },
  });
};

bot.command("start", async (ctx) => {
  const userId = ctx.message?.chat.id!;
  // createPayment(userId, 100);
  // 0;
  // sendFirstQuestion(userId);

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  // bot.api.sendAudio(
  //   userId,
  //   "https://cdn.pixabay.com/download/audio/2024/10/26/audio_00a1d6db0d.mp3?filename=midnight-quirk-255361.mp3"
  // );

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  // bot.api.sendVideo(
  //   userId,
  //   "https://media.istockphoto.com/id/173045943/nl/video/sunrise-at-sea-loopable.mp4?s=mp4-640x640-is&k=20&c=suoYxxNONbOQgeIu9J9fIqYj7vV5DpNik0ZHI74P74Y="
  // );
});

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
