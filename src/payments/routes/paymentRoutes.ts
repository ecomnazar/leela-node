import express, { Response } from "express";
import { handlePayment } from "../handlers/handlePayment";

export const router = express.Router();

// @ts-ignore
router.post("/notification/rukassa", handlePayment);
