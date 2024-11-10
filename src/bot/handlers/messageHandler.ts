import {
  deleteScenarioStepsApi,
  getScenarioApi,
  moveToNextScenarioApi,
} from "../api/scenarioApi";
import { CALLBACK_ACTIONS } from "../constants/callbackActions";
import { callbackKeyboardMaker } from "../lib/callbackKeyboardMaker";
import { bot } from "../main";

export const messageHandler = () => {
  bot.on("message", async (ctx) => {
    const chatId = ctx.message?.chat.id!;
    const messageText = ctx.message.text;

    if (messageText === "refreshBot") {
      deleteScenarioStepsApi(1);
    }

    const response = await getScenarioApi(1);
    const nextStep = response?.nextStep;

    const postResponse = await moveToNextScenarioApi({
      code: 1,
      index: 0,
      message: messageText || "err",
    });

    console.log(`Next step: ${nextStep}`);
    console.log(`Message text: ${messageText}`);
    console.log(`Get response: ${JSON.stringify(response)}`);
    console.log(`Post response: ${JSON.stringify(postResponse)}`);

    if (response?.currentStep === 0) {
      ctx.reply("Крайний шаг и мы начинаем! Как вас зовут?");
    }
    if (postResponse?.currentStep === 1)
      ctx.reply(postResponse?.responseText || "Step 1 error");

    if (postResponse?.currentStep === 2)
      ctx.reply(postResponse?.responseText || "Step 2 error");

    if (postResponse?.currentStep === 3)
      ctx.reply(postResponse?.responseText || "Step 3 error");

    if (postResponse?.currentStep === 4)
      ctx.reply(postResponse?.responseText || "Step 4 error");

    if (postResponse?.currentStep === 5)
      ctx.reply(postResponse?.responseText || "Step 5 error");

    if (postResponse?.currentStep === 6)
      ctx.reply(postResponse?.responseText || "Step 6 error");

    if (postResponse?.currentStep === 7) {
      const task = `Задание 1\n\n${postResponse.task.description}\n\nАвтор: ${postResponse.task.author}\nНаграда в монетах: ${postResponse.task.reward}`;
      const resources = postResponse.resources;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
      ctx.reply(postResponse.responseText);
      for (let index = 0; index < resources.length; index++) {
        const fileUrl = resources[index].filePath;
        await bot.api.sendAudio(
          chatId,
          `https://necogpt.steamp2e.com/api/storage/getMp3?filePath=${fileUrl}`
        );
      }
      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
      ctx.reply(task, {
        reply_markup: {
          inline_keyboard: callbackKeyboardMaker([
            {
              text: "Отклонить",
              callbackData: CALLBACK_ACTIONS.STEP_8_BUTTON_REJECT,
            },
            {
              text: "Выполнено",
              callbackData: CALLBACK_ACTIONS.STEP_8_BUTTON_ACCEPT,
            },
          ]),
        },
      });
      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    }
  });
};
