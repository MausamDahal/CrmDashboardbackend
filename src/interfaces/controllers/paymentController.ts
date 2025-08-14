import { Request, Response } from "express";
import { DynamoPaymentRepository } from "../../infrastructure/repositories/dynamoPaymentRepository";
import { PaymentUseCase } from "../../application/usecases/paymentUseCase";

const repository = new DynamoPaymentRepository();
const useCase = new PaymentUseCase(repository);

export class PaymentController {
    static async savePayment(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        try {
            await useCase.savePayment(subdomain, req.body);
            res.status(201).json({ message: "Payment saved successfully" });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getPayments(req: Request, res: Response): Promise<any> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) return res.status(400).json({ error: "Missing subdomain" });

        const payments = await useCase.getPayments(subdomain);
        res.status(200).json(payments);
    }
}
