import { bot } from "../../bot";
import { app } from "../bot/main";
import { router } from "./routes/paymentRoutes";
import express from "express";

export const mainPayment = () => {
  app.use(express.json());

  app.use("", router);

  app.listen(process.env.PAYMENT_BACKEND_PORT, async () => {
    await bot.api.deleteWebhook();
    const webhookUrl = "https://leela.steamp2e.com/webhook-h";
    await bot.api.setWebhook(webhookUrl);
    console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
    console.log(
      `Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`
    );
  });
};
