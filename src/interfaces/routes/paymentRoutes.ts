import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";

export const paymentRoutes = Router();

paymentRoutes.post("/", PaymentController.savePayment);
paymentRoutes.get("/", PaymentController.getPayments);
