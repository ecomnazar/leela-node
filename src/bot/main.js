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
exports.app = exports.bot = void 0;
const grammy_1 = require("grammy");
const payment_1 = require("./handlers/payment");
const express_1 = __importDefault(require("express"));
const main_1 = require("../payments/main");
require("dotenv").config();
const IMG_URI = "https://nazarly.digital/Untitled2.png";
exports.bot = new grammy_1.Bot(process.env.BOT_TOKEN);
exports.app = (0, express_1.default)();
(0, main_1.mainPayment)();
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
const sendSubscritionPlans = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const messageText = "Выберите тариф";
    yield exports.bot.api.sendMessage(userId, messageText, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Тариф 100",
                        url: (0, payment_1.createPayment)(userId, 100),
                    },
                ],
                [
                    {
                        text: "Тариф 200",
                        url: (0, payment_1.createPayment)(userId, 200),
                    },
                ],
                [
                    {
                        text: "Тариф 300",
                        url: (0, payment_1.createPayment)(userId, 300),
                    },
                ],
            ],
        },
    });
});
exports.bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    // createPayment(userId, 100);
    // 0;
    // sendFirstQuestion(userId);
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    // bot.api.sendAudio(
    //   userId,
    //   "https://cdn.pixabay.com/download/audio/2024/10/26/audio_00a1d6db0d.mp3?filename=midnight-quirk-255361.mp3"
    // );
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --          -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    // bot.api.sendVideo(
    //   userId,
    //   "https://media.istockphoto.com/id/173045943/nl/video/sunrise-at-sea-loopable.mp4?s=mp4-640x640-is&k=20&c=suoYxxNONbOQgeIu9J9fIqYj7vV5DpNik0ZHI74P74Y="
    // );
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
    const messageText = ctx.message.text;
    if (userStates[chatId] === PENDING_STATES.WAITING_FOR_SECOND_QUESTION) {
        delete userStates[chatId]; // Clear the state
        yield sendSecondQuestion(chatId);
    }
    if (userStates[chatId] === PENDING_STATES.WAITING_FOR_THIRD_QUESTION) {
        delete userStates[chatId]; // Clear the state
        yield ctx.reply(`${firstName} спасибо за ответы! Мы свяжемся с вами в ближайшее время`);
    }
    if (messageText === "pay") {
        // createPayment(chatId, 100);
        sendSubscritionPlans(chatId);
    }
}));
exports.bot.start();
