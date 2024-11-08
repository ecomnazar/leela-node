"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainPayment = void 0;
const main_1 = require("../bot/main");
const paymentRoutes_1 = require("./routes/paymentRoutes");
const express_1 = __importDefault(require("express"));
const mainPayment = () => {
    main_1.app.use(express_1.default.json());
    main_1.app.use("", paymentRoutes_1.router);
    main_1.app.listen(process.env.PAYMENT_BACKEND_PORT, () => {
        console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
    });
};
exports.mainPayment = mainPayment;
