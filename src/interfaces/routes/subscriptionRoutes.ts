// subscriptionRoutes.ts
import express from "express";
import { SubscriptionController } from "../controllers/SubscriptionController";

const router = express.Router();

router.get("/status", SubscriptionController.getStatus);
router.post("/upsert", SubscriptionController.upsertSubscription);
router.post("/cancel", SubscriptionController.cancelSubscription);

export { router as subscriptionRoutes };
