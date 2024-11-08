"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePayment = void 0;
const bot_1 = require("../../../bot");
// @ts-ignore
const handlePayment = (req, res) => {
    const { id, order_id, amount, in_amount, data, createdDateTime, status } = req.body;
    const userTelegramId = order_id.split("-")[0];
    const orderId = order_id.split("-")[1];
    console.log(`Payment received: ${JSON.stringify(req.body)}`);
    if (status === "PAID") {
        console.log(userTelegramId);
        bot_1.bot.api.sendMessage(userTelegramId, `Успешный платеж, номер заказа: ${orderId}`);
    }
    else {
        console.log("not paid");
    }
    res.send("OK");
};
exports.handlePayment = handlePayment;