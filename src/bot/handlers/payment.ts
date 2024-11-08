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
  const orderId = `${userId}-${timestamp}`;

  const response = await axios.post(
    `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`
  );
  // const url = `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`;

  const data = response.data as ISuccessPaymentResponse;

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
