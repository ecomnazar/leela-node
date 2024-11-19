import { bot } from "../main";

const IMG_URI = "https://nazarly.digital/Untitled2.png";

export const handleStartCommand = async () => {
  bot.command("start", async (ctx) => {
    // return ctx.replyWithInvoice(
    //   "Neco",
    //   "Итоговое списание происходит в валюте Telegram stars. Подтвердите оплату подписки за 3 месяца за $X.",
    //   "{}",
    //   "XTR",
    //   [{ amount: 150, label: "Подтвердить 150 ⭐" }],
    //   {
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           {
    //             text: "Оплатить 150⭐",
    //             pay: true,
    //           },
    //         ],
    //       ],
    //     },
    //   }
    // );

    // ctx.reply("Hi!");
    // ctx.reply("<b>Задание 1</b>\n\nSalam", {
    //   parse_mode: "HTML",
    // });

    const userId = ctx.message?.chat.id!;
    bot.api.sendPhoto(userId, IMG_URI, {
      caption:
        "Приветствую! Я Neco – ваш личный помощник, использую базу знаний более 1000 экспертов, работаю на вас без выходных и перерывов на обед. Для начала определим, что для вас сегодня важно. \n\nОпишите ваш вопрос, проблему или запрос.",
    });
  });
};
