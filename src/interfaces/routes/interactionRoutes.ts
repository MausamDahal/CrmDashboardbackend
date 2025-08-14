import { Router } from "express";
import { InteractionController } from "../controllers/interactionController";

export const interactionRoutes = Router();

interactionRoutes.post("/", InteractionController.saveInteraction);
interactionRoutes.get("/", InteractionController.getInteractions);
