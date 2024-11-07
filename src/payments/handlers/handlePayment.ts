import { bot } from "../../../bot";

interface IPaymentResponse {
  id: number;
  order_id: string;
  amount: number;
  in_amount: number;
  data: any;
  createdDateTime: string;
  status: "PAID";
}

// @ts-ignore
export const handlePayment = (req, res) => {
  const { id, order_id, amount, in_amount, data, createdDateTime, status } =
    req.body as unknown as IPaymentResponse;

  const userTelegramId = order_id.split("-")[0];
  const orderId = order_id.split("-")[1];

  console.log(`Payment received: ${JSON.stringify(req.body)}`);

  if (status === "PAID") {
    console.log(userTelegramId);
    bot.api.sendMessage(
      userTelegramId,
      `Успешный платеж, номер заказа: ${orderId}`
    );
  } else {
    console.log("not paid");
  }

  res.send("OK");
};
