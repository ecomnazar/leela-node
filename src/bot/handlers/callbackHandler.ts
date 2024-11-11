import { callbackKeyboardMaker } from "../lib/callbackKeyboardMaker";
import { PAYMENT_QUESTIONS } from "../constants/paymentQuestions";
import { CALLBACK_ACTIONS } from "../constants/callbackActions";
import { moveToNextScenarioApi } from "../api/scenarioApi";
import { createPayment } from "../handlers/payment";
import { SESSION } from "../constants/session";
import { bot } from "../main";

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
  // it shows 7 statistics those will be shown in miniapp
  // const responseText = postResponse.responseText;
  // ctx.reply(responseText);

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
    // here end questions
    const answers = ctx.session[SESSION.STEP_11_ANSWERS];
    const message = answers.join(", ");
    const postResponse = await moveToNextScenarioApi({
      code: 1,
      index: 12,
      message: message,
    });
    ctx.reply(postResponse.responseText);

    // here should run:
    await showStep13Result(ctx);
    await showStep14Result(ctx);
    showStep15Result(ctx);

    return;
  }

  const splittedQuestion = currentQuestion?.split("\n");
  const answers = splittedQuestion.slice(1);

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  // @ts-ignore
  let answersEveryThirdIndex = answers.filter((_, index) => index % 3 === 0);
  // Step 2: Remove the last element if it's empty
  if (
    answersEveryThirdIndex[answersEveryThirdIndex.length - 1] === undefined ||
    answersEveryThirdIndex[answersEveryThirdIndex.length - 1] === null ||
    answersEveryThirdIndex[answersEveryThirdIndex.length - 1] === ""
  ) {
    answersEveryThirdIndex.pop();
  }

  // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  const question = splittedQuestion[0];
  let productionAnswers = "";

  for (let index = 0; index < answersEveryThirdIndex.length; index++) {
    const element = answersEveryThirdIndex[index];
    if (index === answersEveryThirdIndex.length - 1) {
      // remove break line in last answer
      productionAnswers += `${element}`;
    } else {
      productionAnswers += `${element}\n\n`;
    }
  }

  const post = `Вопрос ${question}\n\n${productionAnswers}`;

  const buttons = [
    CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_1,
    CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_2,
    CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_3,
    CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_4,
  ];

  ctx.reply(post, {
    reply_markup: {
      inline_keyboard: [
        [
          // @ts-ignore
          ...answersEveryThirdIndex.map((_, index) => {
            return {
              text: `Ответ ${index + 1}`,
              callback_data: buttons[index],
            };
          }),
        ],
      ],
    },
  });
};

// 10 QUESTIONS STARTS HERE
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
  const currentQuestionIndex =
    ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX];
  const questions = ctx.session[SESSION.STEP_11_QUESTIONS];
  const currentQuestion = questions[currentQuestionIndex];

  const answer = currentQuestion.split("Ответ").slice(1)[answerNumber - 1];
  ctx.session[SESSION.STEP_11_CURRENT_QUESTION_INDEX] =
    currentQuestionIndex + 1;
  ctx.session[SESSION.STEP_11_ANSWERS].push(answer);

  // --- --- --- ---

  sendNextQuestion(ctx);
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --     works after 10 questions to user     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// show mini app url
export const showStep13Result = async (ctx: any) => {
  const postStep13Response = await moveToNextScenarioApi({
    code: 1,
    index: 13,
  });
  ctx.reply(postStep13Response.responseText, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Смотреть результаты",
            web_app: { url: "https://leela-v1.vercel.app/" }, // it should open miniapp
          },
        ],
      ],
    },
  });
};

// show text
export const showStep14Result = async (ctx: any) => {
  const postResponse = await moveToNextScenarioApi({
    code: 1,
    index: 14,
  });
  ctx.reply(postResponse.responseText);
};

// show button to choose plan
export const showStep15Result = async (ctx: any) => {
  const postResponse = await moveToNextScenarioApi({
    code: 1,
    index: 15,
  });
  ctx.reply(postResponse.responseText, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Создать себе тариф",
            callback_data: CALLBACK_ACTIONS.STEP_15_CREATE_PLAN,
          },
        ],
      ],
    },
  });
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --     works after 10 questions to user     -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

const startPaymentQuestions = (ctx: any) => {
  ctx.session[SESSION.PAYMENT_QUESTIONS_CURRENT_QUESTION_INDEX] = 0;
  ctx.session[SESSION.PAYMENT_TOTAL_PRICE] = 0;
  sendNextPaymentQuestion(ctx);
};

const handlePaymentQuestion = (ctx: any, answer: "yes" | "no") => {
  const currentPaymentQuestionIndex =
    ctx.session[SESSION.PAYMENT_QUESTIONS_CURRENT_QUESTION_INDEX];
  const totalPrice = ctx.session[SESSION.PAYMENT_TOTAL_PRICE];

  if (answer === "yes") {
    ctx.session[SESSION.PAYMENT_TOTAL_PRICE] =
      totalPrice + PAYMENT_QUESTIONS[currentPaymentQuestionIndex].price;
  }

  ctx.session[SESSION.PAYMENT_QUESTIONS_CURRENT_QUESTION_INDEX] =
    currentPaymentQuestionIndex + 1;

  sendNextPaymentQuestion(ctx);
};

const handlePlanSelect = (ctx: any, chatId: number, type: "day" | "month") => {
  const price = calculatePrice(ctx, type);
  createPayment(chatId, price);
};

const calculatePrice = (ctx: any, type: "day" | "month") => {
  const totalPrice = ctx.session[SESSION.PAYMENT_TOTAL_PRICE];
  if (type === "day") {
    return (Number(totalPrice) / 20).toFixed(0);
  } else {
    return totalPrice;
  }
};

const handlePaymentPlansEnd = (ctx: any) => {
  const text = `Отлично! Мы готовим ваш тариф. Сейчас Neco работает в тестовом режиме до 25.12.2024. Поэтому дарим вам доступ на 3 месяца по цене одного.`;
  ctx.reply(text, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `За 1 день: ${calculatePrice(ctx, "day")}$`,
            callback_data: CALLBACK_ACTIONS.SELECT_1_DAY_PLAN,
          },
          {
            text: `За 3 месяца: ${calculatePrice(ctx, "month")}$`,
            callback_data: CALLBACK_ACTIONS.SELECT_3_MONTH_PLAN,
          },
        ],
      ],
    },
  });
};

const sendNextPaymentQuestion = async (ctx: any) => {
  const currentPaymentQuestionIndex =
    ctx.session[SESSION.PAYMENT_QUESTIONS_CURRENT_QUESTION_INDEX];

  // Delete previous payment question message if it exists
  if (ctx.session[SESSION.PAYMENT_QUESTION_MESSAGE_ID]) {
    try {
      await ctx.api.deleteMessage(
        ctx.chat.id,
        ctx.session[SESSION.PAYMENT_QUESTION_MESSAGE_ID]
      );
    } catch (error) {
      console.error(
        "Failed to delete previous payment question message:",
        error
      );
    }
  }

  // Handle end of questions
  if (currentPaymentQuestionIndex === PAYMENT_QUESTIONS.length) {
    handlePaymentPlansEnd(ctx);
    return;
  }

  const text = `${PAYMENT_QUESTIONS[currentPaymentQuestionIndex].text}\n\n+${PAYMENT_QUESTIONS[currentPaymentQuestionIndex].price}$ в месяц`;

  const message = await ctx.replyWithPhoto(
    `https://nazarly.digital/paymentSteps/${
      currentPaymentQuestionIndex + 1
    }.JPG`,
    {
      caption: text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Нет",
              callback_data: CALLBACK_ACTIONS.STEP_PAYMENT_QUESTION_ANSWER_NO,
            },
            {
              text: "Да",
              callback_data: CALLBACK_ACTIONS.STEP_PAYMENT_QUESTION_ANSWER_YES,
            },
          ],
        ],
      },
    }
  );

  // Store the message ID of the current payment question
  ctx.session[SESSION.PAYMENT_QUESTION_MESSAGE_ID] = message.message_id;
};

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

export const callbackHandler = () => {
  bot.on("callback_query:data", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const chatId = ctx.callbackQuery.message?.chat.id!;

    // Подтверждаем callbackQuery сразу после начала обработки
    try {
      await ctx.answerCallbackQuery();
    } catch (error) {
      console.error("Ошибка при ответе на callback_query:", error);
    }

    switch (callbackData) {
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
      case CALLBACK_ACTIONS.STEP_11_QUESTION_QUIZ_ANSWER_4:
        selectAnswer(ctx, 4);
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_13_SEE_RESULT:
        showStep14Result(ctx);
        break;

      case CALLBACK_ACTIONS.STEP_15_CREATE_PLAN:
        // showStep15Result(ctx);
        startPaymentQuestions(ctx);
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.STEP_PAYMENT_QUESTION_ANSWER_YES:
        handlePaymentQuestion(ctx, "yes");
        break;
      case CALLBACK_ACTIONS.STEP_PAYMENT_QUESTION_ANSWER_NO:
        handlePaymentQuestion(ctx, "no");
        break;

      // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

      case CALLBACK_ACTIONS.SELECT_1_DAY_PLAN:
        handlePlanSelect(ctx, chatId, "day");
        break;
      case CALLBACK_ACTIONS.SELECT_3_MONTH_PLAN:
        handlePlanSelect(ctx, chatId, "month");
        break;
    }
  });
};
