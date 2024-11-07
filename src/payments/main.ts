require("dotenv").config();

import express from "express";
import { router } from "./routes/paymentRoutes";

const app = express();

app.use(express.json());

app.use("", router);

app.listen(process.env.PAYMENT_BACKEND_PORT, () => {
  console.log(`Server is running on port ${process.env.PAYMENT_BACKEND_PORT}`);
});
