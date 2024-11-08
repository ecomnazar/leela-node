"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const handlePayment_1 = require("../handlers/handlePayment");
const main_1 = require("../../bot/main");
exports.router = express_1.default.Router();
// @ts-ignore
exports.router.post("/notification/rukassa", handlePayment_1.handlePayment);
exports.router.post("/webhook-h", (req, res) => {
    // Передаем обновление от Telegram в bot.handleUpdate
    main_1.bot
        .handleUpdate(req.body)
        .then(() => res.sendStatus(200)) // Успешно обработано — статус 200
        .catch(() => res.sendStatus(500)); // Ошибка обработки — статус 500
});
