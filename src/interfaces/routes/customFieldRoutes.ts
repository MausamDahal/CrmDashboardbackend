import { Router } from "express";
import { CustomFieldController } from "../controllers/customFieldController";

export const customFieldRoutes = Router();

customFieldRoutes.post("/custom-fields", CustomFieldController.saveFields);
customFieldRoutes.get("/custom-fields", CustomFieldController.getFields);

customFieldRoutes.post("/prediction-mapping", CustomFieldController.savePredictionPayload);
customFieldRoutes.get("/prediction-mapping", CustomFieldController.getPredictionFieldMappings);
