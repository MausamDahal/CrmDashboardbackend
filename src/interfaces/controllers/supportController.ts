import { Request, Response } from "express";
import { DynamoSupportRepository } from "../../infrastructure/repositories/dynamoSupportRepository";
import { SupportUseCase } from "../../application/usecases/supportUseCase";

const repository = new DynamoSupportRepository();
const useCase = new SupportUseCase(repository);

export class SupportController {
    static async saveSupport(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        try {
            await useCase.saveSupport(subdomain, req.body);
            res.status(201).json({ message: "Support created successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getSupports(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        const supports = await useCase.getSupports(subdomain);
        res.status(200).json(supports);
    }
}
