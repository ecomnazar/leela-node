"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = void 0;
const createPayment = (userId, amount) => {
    const BASE_URL = process.env.RU_KASSA_BASE_URL;
    const TOKEN = process.env.RU_KASSA_TOKEN;
    const SHOP_ID = process.env.RU_KASSA_SHOP_ID;
    const timestamp = Date.now();
    const orderId = `${userId}-${timestamp}`;
    // const response = await axios.post(
    //   `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`
    // );
    const url = `${BASE_URL}?shop_id=${SHOP_ID}&order_id=${orderId}&amount=${amount}&token=${TOKEN}&user_code=${userId}`;
    // const data = response.data;
    // console.log(`Create payment data: ${JSON.stringify(data)}`);
    return url;
};
exports.createPayment = createPayment;
