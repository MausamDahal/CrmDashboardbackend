import { Request, Response } from "express";
import { OrderUseCase } from "../../application/usecases/orderUseCase";
import { DynamoOrderRepository } from "../../infrastructure/repositories/dynamoOrderRepository";

const repository = new DynamoOrderRepository();
const useCase = new OrderUseCase(repository);

export class OrderController {
    static async save(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        try {
            await useCase.save(subdomain, req.body);
            res.status(201).json({ message: "Order saved successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        const result = await useCase.getAll(subdomain);
        res.status(200).json(result);
    }
}
