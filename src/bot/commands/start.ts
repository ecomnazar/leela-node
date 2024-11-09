import { moveToNextScenarioApi } from "../api/scenarioApi";
import { bot } from "../main";

const IMG_URI = "https://nazarly.digital/Untitled2.png";

export const handleStartCommand = async () => {
  bot.command("start", async (ctx) => {
    const userId = ctx.message?.chat.id!;
    const postResponse = await moveToNextScenarioApi({
      code: 1,
      index: 0,
      message: "болит голова",
    });
    bot.api.sendPhoto(userId, IMG_URI, {
      caption:
        "Приветствую! Я Neco – ваш личный помощник, использую базу знаний более 1000 экспертов, работаю на вас без выходных и перерывов на обед. Для начала определим, что для вас сегодня важно. \n\nОпишите ваш вопрос, проблему или запрос.",
    });
  });
};
