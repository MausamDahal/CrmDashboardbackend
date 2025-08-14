// interfaces/routes/riskAlertRoutes.ts
import { Router } from "express";
import { RiskAlertController } from "../controllers/riskAlertController";

const riskAlertRoutes = Router();

riskAlertRoutes.post("/", RiskAlertController.create);
riskAlertRoutes.get("/", RiskAlertController.list);
riskAlertRoutes.patch("/:id/status", RiskAlertController.updateStatus);

export default riskAlertRoutes;
