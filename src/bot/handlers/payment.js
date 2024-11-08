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
exports.createPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const createPayment = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const BASE_URL = process.env.RU_KASSA_BASE_URL;
    const TOKEN = process.env.RU_KASSA_TOKEN;
    const SHOP_ID = process.env.RU_KASSA_SHOP_ID;
    const timestamp = Date.now();
    const orderId = `${userId}-${timestamp}`;
    const response = yield axios_1.default.post(`${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`);
    // const url = `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`;
    const data = response.data;
    console.log(`Create payment data: ${JSON.stringify(data)}`);
    // return "";
});
exports.createPayment = createPayment;
