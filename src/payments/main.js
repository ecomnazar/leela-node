"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainPayment = void 0;
const bot_1 = require("../../bot");
const main_1 = require("../bot/main");
const paymentRoutes_1 = require("./routes/paymentRoutes");
const express_1 = __importDefault(require("express"));
const mainPayment = () => {
    main_1.app.use(express_1.default.json());
    main_1.app.use("", paymentRoutes_1.router);
    main_1.app.listen(process.env.PAYMENT_BACKEND_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
        const webhookUrl = "https://leela.steamp2e.com/webhook-h";
        yield bot_1.bot.api.setWebhook(webhookUrl);
        console.log(`Вебхук зарегистрирован на ${webhookUrl}`);
        console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
    }));
};
exports.mainPayment = mainPayment;
