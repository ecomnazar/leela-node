import express, { Response } from "express";
import { handlePayment } from "../handlers/handlePayment";
import { bot } from "../../bot/main";

export const router = express.Router();

// @ts-ignore
router.post("/notification/rukassa", handlePayment);

router.post("/webhook-h", (req, res) => {
  bot
    .handleUpdate(req.body)
    .then(() => {
      res.sendStatus(200); // Успешно обработано — отправляется один ответ
    })
    .catch((error) => {
      console.error(error);
      if (!res.headersSent) {
        // Проверяем, что заголовки еще не были отправлены
        res.sendStatus(500); // Ошибка обработки — отправляется только один ответ
      }
    });
});
