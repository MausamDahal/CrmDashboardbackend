// interfaces/controllers/riskAlertController.ts
import { Request, Response } from "express";
import { DynamoRiskAlertRepository } from "../../infrastructure/repositories/dynamoRiskAlertRepository";
import { RiskAlertUseCase } from "../../application/usecases/riskAlertUseCase";

const repo = new DynamoRiskAlertRepository();
const useCase = new RiskAlertUseCase(repo);

export class RiskAlertController {
    static async create(req: Request, res: Response) {
        const subdomain = req.tenant?.Subdomain!;
        try {
            const alert = await useCase.createAlert(subdomain, req.body);
            res.status(201).json(alert);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async list(req: Request, res: Response) {
        const subdomain = req.tenant?.Subdomain!;
        try {
            const alerts = await useCase.getAllAlerts(subdomain);
            res.status(200).json(alerts);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        const subdomain = req.tenant?.Subdomain!;
        try {
            const result = await useCase.updateAlertStatus(subdomain, req.params.id, req.body.status);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}
