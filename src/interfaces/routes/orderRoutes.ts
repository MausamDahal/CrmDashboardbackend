import { Router } from "express";
import { OrderController } from "../controllers/orderController";

export const orderRoutes = Router();

orderRoutes.post("/", OrderController.save);
orderRoutes.get("/", OrderController.getAll);
