import express from "express";
import { ApiKeyController } from "../controllers/apiKeyController";

const router = express.Router();

router.post("/", ApiKeyController.create);
router.get("/", ApiKeyController.list);
router.get("/:id", ApiKeyController.getById);
router.delete("/:id", ApiKeyController.revoke);

export { router as apiKeyRoutes };
