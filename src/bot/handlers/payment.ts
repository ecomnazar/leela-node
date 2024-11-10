import axios from "axios";
import { bot } from "../main";

interface ISuccessPaymentResponse {
  id: number;
  hash: string;
  url: string;
}

export const createPayment = async (userId: number, amount: number) => {
  const BASE_URL = process.env.RU_KASSA_BASE_URL;
  const TOKEN = process.env.RU_KASSA_TOKEN;
  const SHOP_ID = process.env.RU_KASSA_SHOP_ID;

  const timestamp = Date.now();
  const orderID = `${userId}-${timestamp}`;

  const cards = [
    "card",
    "card_kzt",
    "card_uzs",
    "card_azn",
    "card_kgs",
    "skinpay",
    "yandexmoney",
    "payeer",
    "crypta",
    "sbp",
    "clever",
  ];

  const body = {
    user_code: orderID,
    currency: "USD",
    list: cards,
  };

  // cards
  //     .map((n, index) => `list[${index}]=${n}`)
  //     .join("&")

  console.log(20);

  const response = await axios.post(
    `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderID}&amount=${20}&token=${TOKEN}&user_code=${orderID}&currency=USD`,
    body
  );

  const data = response.data as ISuccessPaymentResponse;

  console.log(data);

  if (!data.url) {
    return bot.api.sendMessage(userId, "Произошла ошибка при создании платежа");
  }
  bot.api.sendMessage(userId, "Оплатите по этой ссылке", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Оплатить",
            url: data.url,
          },
        ],
      ],
    },
  });
};
