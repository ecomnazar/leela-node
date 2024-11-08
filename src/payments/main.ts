import { app } from "../bot/main";
import { router } from "./routes/paymentRoutes";
import express from "express";

export const mainPayment = () => {
  app.use(express.json());
  app.use("", router);
};
