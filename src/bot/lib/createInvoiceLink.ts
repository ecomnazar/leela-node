import axios from "axios";

require("dotenv").config();

export const createInvoiceLink = async (chatId: number, usdAmount: number) => {
  const token = process.env.BOT_TOKEN;
  const payload = Date.now();
  const amount = usdAmount * 50;
  const prices = JSON.stringify([{ label: "Plan", amount }]);
  const url = `https://api.telegram.org/bot${token}/createInvoiceLink?chat_id=${chatId}&title=Test&description=testDesc&payload=${payload}&currency=XTR&prices=${prices}`;

  const response = await axios.get(url);

  return response.data.result;
};
