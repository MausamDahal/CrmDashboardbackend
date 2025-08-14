import { Request, Response } from "express";
import { DynamoCustomFieldRepository } from "../../infrastructure/repositories/dynamoCustomFieldRepository";
import { PythonModelService } from "../../infrastructure/services/pythonModelService";
import { AIPredictionUseCase } from "../../application/usecases/prediction/AIPredictionUseCase";
import { DynamoPredictionRepository } from "../../infrastructure/repositories/dynamoPredictionRepository";
import { DynamoRiskAlertRepository } from "../../infrastructure/repositories/dynamoRiskAlertRepository";

const repository = new DynamoCustomFieldRepository();
const modelService = new PythonModelService();
const predictionRepository = new DynamoPredictionRepository();
const riskAlertRepository = new DynamoRiskAlertRepository();
const useCase = new AIPredictionUseCase(repository, predictionRepository, modelService, riskAlertRepository);

export class AIController {
    static async predictChurn(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            return res.status(400).json({ error: "Missing subdomain" });
        }

        try {
            const result = await useCase.predict(subdomain);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getPredictions(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            return res.status(400).json({ error: "Missing subdomain" });
        }

        try {
            const result = await useCase.getLatestPredictions(subdomain);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getChurnRateByPeriod(req: Request, res: Response) {
        try {
            const subdomain = req.tenant?.Subdomain!;
            const period = req.query.period as "daily" | "monthly" | "yearly" | "quarterly" || "monthly";
            const results = await useCase.getChurnRateByPeriod(subdomain, period);
            res.json(results);
        } catch (error: any) {
            console.error("Error getting churn rate:", error);
            res.status(500).json({ error: error.message || "Failed to get churn rate" });
        }
    }
}
