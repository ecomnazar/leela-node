import { callbackKeyboardMaker } from "../lib/callbackKeyboardMaker";
import { CALLBACK_ACTIONS } from "../constants/callbackActions";
import { moveToNextScenarioApi } from "../api/scenarioApi";
import { createPayment } from "../handlers/payment";
import { bot } from "../main";
import { SESSION } from "../constants/session";

const replyAfterStep8 = async ({
  ctx,
  chatId,
  stepMessage,
}: {
  ctx: any;
  chatId: number;
  stepMessage: string;
}) => {
  const postResponse = await moveToNextScenarioApi({
    code: 1,
    index: 8,
    message: stepMessage,
  });

  const responseText = postResponse.responseText;
  ctx.reply(responseText);

  const author = postResponse.task.author;
  const reward = postResponse.task.reward;
  const description = postResponse.task.description;

  const taskText = `Задание 2\n\n${description}\n\nАвтор: ${author}\nНаграда в монетах: ${reward}`;

  bot.api.sendMessage(chatId, taskText, {
    reply_markup: {
      inline_keyboard: callbackKeyboardMaker([
        {
          text: "Отклонить",
          callbackData: CALLBACK_ACTIONS.STEP_9_BUTTON_REJECT,
        },
        {
          text: "Запросить доступ",
          callbackData: CALLBACK_ACTIONS.STEP_9_BUTTON_REQUEST_ACCESS,
        },
      ]),
    },
  });
};

const replyAfterStep9 = async ({
  ctx,
  chatId,
  stepMessage,
}: {
  ctx: any;
  chatId: number;
  stepMessage: string;
}) => {
  await moveToNextScenarioApi({
    code: 1,
    index: 9,
    message: stepMessage,
  });

  const postResponse = await moveToNextScenarioApi({
    code: 1,
    index: 10,
  });
  console.log(postResponse);

  const responseText = postResponse.responseText;
  ctx.reply(responseText);

  const author = postResponse.task.author;
  const reward = postResponse.task.reward;
  const description = postResponse.task.description;

  const taskText = `Задание 3\n\n${description}\n\nАвтор: ${author}\nНаграда в монетах: ${reward}`;

  bot.api.sendMessage(chatId, taskText, {
    reply_markup: {
      inline_keyboard: callbackKeyboardMaker([
        {
          text: "Отклонить",
          callbackData: CALLBACK_ACTIONS.STEP_10_BUTTON_REJECT,
        },
        {
          text: "Начать",
          callbackData: CALLBACK_ACTIONS.STEP_10_BUTTON_START,
        },
      ]),
    },
  });
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

const sendNextQuestion = async (ctx: any) => {
  const currentQuestionIndex =
    ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX];
  const questions = ctx.session[SESSION.STEP_11_QUESTIONS];
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestionIndex === questions.length) {
    const answers = ctx.session[SESSION.STEP_11_ANSWERS];
    const message = answers.join(", ");
    console.log(message);

    const postResponse = await moveToNextScenarioApi({
      code: 1,
      index: 12,
      message: message,
    });
    ctx.reply(postResponse.responseText);

    const postStep13Response = await moveToNextScenarioApi({
      code: 1,
      index: 13,
    });
    console.log(postStep13Response);

    return;
  }
  ctx.reply(`Вопрос ${currentQuestion}`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Ответ 1",
            callback_data: CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_1,
          },
          {
            text: "Ответ 2",
            callback_data: CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_2,
          },
          {
            text: "Ответ 3",
            callback_data: CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_3,
          },
        ],
      ],
    },
  });
};

const replyAfterStep10 = async ({
  ctx,
  chatId,
  stepMessage,
}: {
  ctx: any;
  chatId: number;
  stepMessage: string;
}) => {
  const postResponse = await moveToNextScenarioApi({
    code: 1,
    index: 11,
    message: stepMessage,
  });

  const responseText = postResponse.responseText;
  const arrayOfQuestions = (responseText as string).split("Вопрос").slice(1);

  ctx.session[SESSION.STEP_11_QUESTIONS] = arrayOfQuestions;
  ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX] = 0;
  ctx.session[SESSION.STEP_11_ANSWERS] = [];

  sendNextQuestion(ctx);

  // for (let index = 0; index < arrayOfQuestions.length; index++) {
  //   console.log(`Вопрос ${arrayOfQuestions[index]}`);
  //   console.log("---------");
  //   console.log("---------");
  // }
};

const selectAnswer = (ctx: any, answerNumber: number) => {
  console.log("Session data:", ctx.session);
  const currentQuestionIndex =
    ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX];
  const questions = ctx.session[SESSION.STEP_11_QUESTIONS];
  const currentQuestion = questions[currentQuestionIndex];
  console.log(currentQuestion);

  const answer = currentQuestion.split("Ответ").slice(1)[answerNumber - 1];
  ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX] =
    currentQuestionIndex + 1;
  ctx.session[SESSION.STEP_11_ANSWERS].push(answer);
  console.log(ctx.session[SESSION.STEP_11_ANSWERS]);

  // --- --- --- ---

  sendNextQuestion(ctx);
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

export const callbackHandler = () => {
  bot.on("callback_query:data", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const chatId = ctx.callbackQuery.message?.chat.id!;

    // Подтверждаем callbackQuery сразу после начала обработки

    await ctx.answerCallbackQuery();
    try {
      await ctx.answerCallbackQuery();
    } catch (error) {
      console.error("Ошибка при ответе на callback_query:", error);
    }
    switch (callbackData) {
      case "plan_100":
        createPayment(chatId, 100);
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_8_BUTTON_REJECT:
        try {
          replyAfterStep8({ ctx, chatId, stepMessage: "BUTTON_2" });
        } catch (error) {
          console.log("error in STEP_8_BUTTON_REJECT", error);
        }
        break;

      case CALLBACK_ACTIONS.STEP_8_BUTTON_ACCEPT:
        try {
          replyAfterStep8({ ctx, chatId, stepMessage: "BUTTON_1" });
        } catch (error) {
          console.log("error in STEP_8_BUTTON_ACCEPT", error);
        }
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_9_BUTTON_REJECT:
        try {
          replyAfterStep9({ ctx, chatId, stepMessage: "BUTTON_1" });
        } catch (error) {
          console.log("error in STEP_9_BUTTON_REJECT", error);
        }
        break;

      case CALLBACK_ACTIONS.STEP_9_BUTTON_REQUEST_ACCESS:
        try {
          replyAfterStep9({ ctx, chatId, stepMessage: "BUTTON_2" });
        } catch (error) {
          console.log("error in STEP_9_BUTTON_REQUEST_ACCESS", error);
        }
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_10_BUTTON_REJECT:
        try {
          replyAfterStep10({ ctx, chatId, stepMessage: "BUTTON_1" });
        } catch (error) {
          console.log("error in STEP_10_BUTTON_REJECT", error);
        }
        break;

      case CALLBACK_ACTIONS.STEP_10_BUTTON_START:
        try {
          replyAfterStep10({ ctx, chatId, stepMessage: "BUTTON_2" });
        } catch (error) {
          console.log("error in STEP_10_BUTTON_REQUEST_ACCESS", error);
        }
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_1:
        selectAnswer(ctx, 1);
        break;
      case CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_2:
        selectAnswer(ctx, 2);
        break;
      case CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_3:
        selectAnswer(ctx, 3);
        break;
    }

    // Ensure the callback query is recent before answering
    if (ctx.callbackQuery.id) {
      await ctx.answerCallbackQuery();
    }
  });
};
