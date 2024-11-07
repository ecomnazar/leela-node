import { Bot } from "grammy";
import { InlineKeyboardButton } from "grammy/types";
import { createPayment } from "./src/bot/handlers/payment";

const IMG_URI = "https://nazarly.digital/Untitled2.png";
export const bot = new Bot("7472733171:AAGMZuGCVkgvUb6VPzP6SH_83TAM4PPZ3t4");

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

bot.command("start", async (ctx) => {
  const userId = ctx.message?.chat.id!;
  //   createPayment();
  //   sendFirstQuestion(userId);
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
});

bot.start();
