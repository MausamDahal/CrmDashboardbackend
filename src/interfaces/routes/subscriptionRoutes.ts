// subscriptionRoutes.ts
import express from "express";
import { SubscriptionController } from "../controllers/SubscriptionController";

const router = express.Router();

router.get("/status", SubscriptionController.getStatus);
router.post("/upsert", SubscriptionController.upsertSubscription);
router.post("/cancel", SubscriptionController.cancelSubscription);
router.post("/switch", SubscriptionController.switchSubscription);
router.post("/update", SubscriptionController.updateSubscription);

export { router as subscriptionRoutes };
