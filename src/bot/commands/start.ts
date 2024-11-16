import { bot } from "../main";

const IMG_URI = "https://nazarly.digital/Untitled2.png";

export const handleStartCommand = async () => {
  bot.command("start", async (ctx) => {
    // return ctx.reply(
    //   "Отлично! Мы готовим ваш тариф. Сейчас Neco работает в тестовом режиме до 25.12.2024. Поэтому дарим вам доступ на 3 месяца по цене одного.",
    //   {
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           { text: "За 1 день: 150 ⭐", callback_data: "plan_1", pay: true },
    //           { text: "За 3 месяца: 2500 ⭐", callback_data: "plan_2" },
    //         ],
    //       ],
    //     },
    //   }
    // );

    return ctx.replyWithInvoice(
      "Neco", // Product title
      "Подтверждение оплаты: подписка за 1 день - 150 ⭐", // Product description
      "{}", // Product payload, not required for now
      "XTR", // Stars Currency
      [
        { amount: 150, label: "Подтвердить 150 ⭐" }, // Product variants
      ]
    );

    return;

    const userId = ctx.message?.chat.id!;
    // const postResponse = await moveToNextScenarioApi({
    //   code: 1,
    //   index: 0,
    //   message: "болит голова",
    // });
    bot.api.sendPhoto(userId, IMG_URI, {
      caption:
        "Приветствую! Я Neco – ваш личный помощник, использую базу знаний более 1000 экспертов, работаю на вас без выходных и перерывов на обед. Для начала определим, что для вас сегодня важно. \n\nОпишите ваш вопрос, проблему или запрос.",
    });
  });
};
