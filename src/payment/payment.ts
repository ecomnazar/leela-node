import axios from "axios";

interface ISuccessPaymentResponse {
  id: number;
  hash: string;
  url: string;
}

export const createPayment = async () => {
  const BASE_URL = process.env.RU_KASSA_BASE_URL;
  const TOKEN = process.env.RU_KASSA_TOKEN;
  const SHOP_ID = process.env.RU_KASSA_SHOP_ID;

  const response = await axios.post(
    `${BASE_URL}?shop_id=${SHOP_ID}&order_id=5&amount=100&token=${TOKEN}&user_code=770936906`
  );
  const data = response.data;
  console.log(data);

  return data;
};
