import { Request, Response } from "express";
import { SubscriptionUseCase } from "../../application/usecases/SubscriptionUseCase";
import { DynamoSubscriptionRepository } from "../../infrastructure/repositories/dynamoSubscriptionRepository";

const useCase = new SubscriptionUseCase(new DynamoSubscriptionRepository());

export class SubscriptionController {
    static async getStatus(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;

        if (!subdomain || !tenantId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            const result = await useCase.isSubscriptionValid(subdomain, tenantId);
            res.status(200).json(result);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    static async upsertSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        if (!subdomain || !tenantId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            await useCase.upsertSubscription(subdomain, tenantId, req.body);
            res.status(200).json({ message: "Subscription updated" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async cancelSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        if (!subdomain || !tenantId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        try {
            await useCase.cancelSubscription(subdomain, tenantId);
            res.status(200).json({ message: "Subscription cancelled" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
