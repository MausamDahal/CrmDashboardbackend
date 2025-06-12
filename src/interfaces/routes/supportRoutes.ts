import { Router } from "express";
import { SupportController } from "../controllers/supportController";
import { SubscriptionController } from "../controllers/SubscriptionController";

export const supportRoutes = Router();

supportRoutes.post("/", SupportController.saveSupport);
supportRoutes.get("/", SupportController.getSupports);
supportRoutes.get("/", SubscriptionController.getStatus);
supportRoutes.post("/upsert", SubscriptionController.upsertSubscription);
supportRoutes.post("/cancel", SubscriptionController.cancelSubscription);
supportRoutes.post("/update", SubscriptionController.updateSubscription); 

export default Router;
