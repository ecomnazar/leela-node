import { SESSION } from "../constants/session";

export const calculatePrice = (ctx: any, type: "day" | "month") => {
  const totalPrice = ctx.session[SESSION.PAYMENT_TOTAL_PRICE];
  if (type === "day") {
    return (Number(totalPrice) / 20).toFixed(0);
  } else {
    return totalPrice;
  }
};
