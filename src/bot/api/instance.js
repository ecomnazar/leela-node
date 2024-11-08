"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const axios_1 = __importDefault(require("axios"));
exports.instance = axios_1.default.create({
    baseURL: `${process.env.BACKEND_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});
exports.instance.interceptors.request.use((config) => {
    const token = process.env.TOKEN;
    config.headers["x-auth-token"] = `Bearer ${token}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});
