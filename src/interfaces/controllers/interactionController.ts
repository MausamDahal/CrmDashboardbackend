import { Request, Response } from "express";
import { DynamoInteractionRepository } from "../../infrastructure/repositories/dynamoInteractionRepository";
import { InteractionUseCase } from "../../application/usecases/interactionUseCase";

const repository = new DynamoInteractionRepository();
const useCase = new InteractionUseCase(repository);

export class InteractionController {
    static async saveInteraction(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        try {
            await useCase.saveInteraction(subdomain, req.body);
            res.status(201).json({ message: "Interaction saved successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getInteractions(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        const data = await useCase.getInteractions(subdomain);
        res.status(200).json(data);
    }
}
