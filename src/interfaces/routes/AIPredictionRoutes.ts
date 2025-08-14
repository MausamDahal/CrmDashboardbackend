import { Router } from "express";
import { AIController } from "../controllers/AIPredictionController";

export const AIPredictionRoutes = Router();

AIPredictionRoutes.post("/predict", AIController.predictChurn);
AIPredictionRoutes.get("/predict", AIController.getPredictions);
AIPredictionRoutes.get("/churn", AIController.getChurnRateByPeriod);