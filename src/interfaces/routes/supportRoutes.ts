import { Router } from "express";
import { SupportController } from "../controllers/supportController";

export const supportRoutes = Router();

supportRoutes.post("/", SupportController.saveSupport);
supportRoutes.get("/", SupportController.getSupports);
