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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const IMG_URI = "https://nazarly.digital/Untitled2.png";
exports.bot = new grammy_1.Bot("7472733171:AAGMZuGCVkgvUb6VPzP6SH_83TAM4PPZ3t4");
const CALLBACK_ACTIONS = {
    QUESTION_1_OPTION_1: "1.1",
    QUESTION_1_OPTION_2: "1.2",
    QUESTION_2_OPTION_1: "2.1",
    QUESTION_2_OPTION_2: "2.2",
    QUESTION_2_OPTION_3: "2.3",
};
const PENDING_STATES = {
    WAITING_FOR_SECOND_QUESTION: "waiting_for_second_question",
    WAITING_FOR_THIRD_QUESTION: "waiting_for_third_question",
};
const userStates = {};
const keyboardMaker = (options) => {
    return options.map((option) => [
        {
            text: option.text,
            callback_data: option.callbackData,
        },
    ]);
};
const sendFirstQuestion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const inline_keyboard = keyboardMaker([
        {
            text: "У меня есть вопрос, проблема, запрос",
            callbackData: CALLBACK_ACTIONS.QUESTION_1_OPTION_1,
        },
        {
            text: "Не знаю, хочу пройти тест",
            callbackData: CALLBACK_ACTIONS.QUESTION_1_OPTION_2,
        },
    ]);
    yield exports.bot.api.sendPhoto(userId, IMG_URI, {
        reply_markup: { inline_keyboard },
    });
});
const sendSecondQuestion = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messageText = "Выберите, к какому направлению больше подходит ваш случай";
    const inline_keyboard = keyboardMaker([
        {
            text: "Button 3",
            callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_1,
        },
        {
            text: "Button 4",
            callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_2,
        },
        {
            text: "Button 5",
            callbackData: CALLBACK_ACTIONS.QUESTION_2_OPTION_3,
        },
    ]);
    yield exports.bot.api.sendMessage(userId, messageText, {
        reply_markup: { inline_keyboard },
    });
});
exports.bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    //   createPayment();
    //   sendFirstQuestion(userId);
}));
exports.bot.on("callback_query:data", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const callbackData = ctx.callbackQuery.data;
    const chatId = (_a = ctx.callbackQuery.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    switch (callbackData) {
        case CALLBACK_ACTIONS.QUESTION_1_OPTION_1:
        case CALLBACK_ACTIONS.QUESTION_1_OPTION_2:
            userStates[chatId] = PENDING_STATES.WAITING_FOR_SECOND_QUESTION;
            yield ctx.reply("Опишите ваш вопрос, проблему или вопрос");
            break;
        case CALLBACK_ACTIONS.QUESTION_2_OPTION_1:
        case CALLBACK_ACTIONS.QUESTION_2_OPTION_2:
        case CALLBACK_ACTIONS.QUESTION_2_OPTION_3:
            userStates[chatId] = PENDING_STATES.WAITING_FOR_THIRD_QUESTION;
            yield ctx.reply("Крайний шаг и мы начинаем! Как вас зовут?");
            break;
    }
    yield ctx.answerCallbackQuery();
}));
exports.bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chatId = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    const firstName = ctx.message.chat.first_name;
    if (userStates[chatId] === PENDING_STATES.WAITING_FOR_SECOND_QUESTION) {
        delete userStates[chatId]; // Clear the state
        yield sendSecondQuestion(chatId);
    }
    if (userStates[chatId] === PENDING_STATES.WAITING_FOR_THIRD_QUESTION) {
        delete userStates[chatId]; // Clear the state
        yield ctx.reply(`${firstName} спасибо за ответы! Мы свяжемся с вами в ближайшее время`);
    }
}));
exports.bot.start();
