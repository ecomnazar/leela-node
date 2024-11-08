import express, { Response } from "express";
import { handlePayment } from "../handlers/handlePayment";
import { bot } from "../../bot/main";

export const router = express.Router();

// @ts-ignore
router.post("/notification/rukassa", handlePayment);

router.post("/webhook-h", (req, res) => {
  // Передаем обновление от Telegram в bot.handleUpdate
  bot
    .handleUpdate(req.body)
    .then(() => res.sendStatus(200)) // Успешно обработано — статус 200
    .catch(() => res.sendStatus(500)); // Ошибка обработки — статус 500
});
