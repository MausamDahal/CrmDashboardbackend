import { Request, Response } from "express";
import { SubscriptionUseCase } from "../../application/usecases/SubscriptionUseCase";
import { DynamoSubscriptionRepository } from "../../infrastructure/repositories/dynamoSubscriptionRepository";

const useCase = new SubscriptionUseCase(new DynamoSubscriptionRepository());

export class SubscriptionController {
    static async getStatus(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;

        if (!subdomain || !tenantId) {
            res.status(401).json({ 
                valid: false, 
                error: "Unauthorized - Missing tenant information" 
            });
            return;
        }

        try {
            const result = await useCase.isSubscriptionValid(subdomain, tenantId);
            res.status(result.subscribed ? 200 : 404).json({
                valid: result.subscribed,
                plan: result.subscription_tier,
                status: result.status,
                expiresAt: result.subscription_end
            });
        } catch (err: any) {
            console.error("Subscription status check failed:", err);
            res.status(500).json({ 
                valid: false, 
                error: "Internal server error",
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    static async upsertSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        
        if (!subdomain || !tenantId) {
            res.status(401).json({ 
                valid: false,
                error: "Unauthorized - Missing tenant information" 
            });
            return;
        }

        try {
            await useCase.upsertSubscription(subdomain, tenantId, req.body);
            res.status(200).json({ 
                valid: true,
                message: "Subscription updated successfully" 
            });
        } catch (err: any) {
            console.error("Subscription upsert failed:", err);
            res.status(400).json({ 
                valid: false, 
                error: err.message,
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }

    static async switchSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        
        if (!subdomain || !tenantId) {
            res.status(401).json({ 
                valid: false, 
                error: "Unauthorized - Missing tenant information" 
            });
            return;
        }

        const { newPlanId, immediate = false } = req.body;

        if (!newPlanId) {
            res.status(400).json({ 
                valid: false, 
                error: "Missing newPlanId in request body" 
            });
            return;
        }

        try {
            await useCase.switchSubscription(subdomain, tenantId, newPlanId, immediate);
            res.status(200).json({ 
                valid: true,
                message: immediate 
                    ? "Subscription switched successfully" 
                    : "Subscription switch scheduled for end of current period"
            });
        } catch (err: any) {
            console.error("Subscription switch failed:", err);
            res.status(400).json({ 
                valid: false, 
                error: err.message,
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }

    static async cancelSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        
        if (!subdomain || !tenantId) {
            res.status(401).json({ 
                valid: false, 
                error: "Unauthorized - Missing tenant information" 
            });
            return;
        }

        const { immediate = false } = req.body;

        try {
            await useCase.cancelSubscription(subdomain, tenantId, immediate);
            res.status(200).json({ 
                valid: true,
                message: immediate 
                    ? "Subscription cancelled immediately" 
                    : "Subscription cancellation scheduled for end of current period"
            });
        } catch (err: any) {
            console.error("Subscription cancellation failed:", err);
            res.status(400).json({ 
                valid: false, 
                error: err.message,
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }

    static async updateSubscription(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        const tenantId = req.tenant?.ID;
        
        if (!subdomain || !tenantId) {
            res.status(401).json({ 
                valid: false, 
                error: "Unauthorized - Missing tenant information" 
            });
            return;
        }

        try {
            await useCase.updateSubscription(subdomain, tenantId, req.body);
            res.status(200).json({ 
                valid: true,
                message: "Subscription updated successfully" 
            });
        } catch (err: any) {
            console.error("Subscription update failed:", err);
            res.status(400).json({ 
                valid: false, 
                error: err.message,
                details: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }
}



