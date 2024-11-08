import { CALLBACK_ACTIONS } from "../constants/callbackActions";
import { callbackKeyboardMaker } from "../lib/callbackKeyboardMaker";
import { bot } from "../main";

const IMG_URI = "https://nazarly.digital/Untitled2.png";

const sendFirstQuestion = async (userId: number) => {
  const inline_keyboard = callbackKeyboardMaker([
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

export const handleStartCommand = () => {
  bot.command("start", async (ctx) => {
    const userId = ctx.message?.chat.id!;
    ctx.reply("Привет! Я бот-помощник. Начнем?");
    // sendFirstQuestion(userId);
  });
};
