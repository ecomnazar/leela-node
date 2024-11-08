import { InlineKeyboardButton } from "grammy/types";

export const callbackKeyboardMaker = (
  options: { text: string; callbackData: string }[]
): InlineKeyboardButton[][] => {
  return options.map((option) => [
    {
      text: option.text,
      callback_data: option.callbackData,
    },
  ]);
};
