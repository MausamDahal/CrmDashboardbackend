import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { DynamoApiKeyRepository } from "../../infrastructure/repositories/dynamoApiKeyRepository";
import { ApiKeyUseCase } from "../../application/usecases/apiKeyUseCase";

const useCase = new ApiKeyUseCase(new DynamoApiKeyRepository());

export class ApiKeyController {
    static async create(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            res.status(400).json({ error: "Missing tenant context" });
            return;
        }

        const { description } = req.body;
        const result = await useCase.createApiKey(subdomain, description);
        res.status(201).json(result); // don't return this
    }

    static async list(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            res.status(400).json({ error: "Missing tenant context" });
            return;
        }

        const keys = await useCase.listApiKeys(subdomain);
        res.status(200).json(keys);
    }

    static async getById(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            res.status(400).json({ error: "Missing tenant context" });
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Missing API key ID" });
            return;
        }

        const key = await useCase.getApiKeyById(subdomain, id);
        if (!key) {
            res.status(404).json({ error: "API key not found" });
            return;
        }

        res.status(200).json(key);
    }


    static async revoke(req: Request, res: Response): Promise<void> {
        const subdomain = req.tenant?.Subdomain;
        if (!subdomain) {
            res.status(400).json({ error: "Missing tenant context" });
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Missing API key ID" });
            return;
        }

        await useCase.revokeApiKey(subdomain, id);
        res.status(200).json({ message: "API key revoked" });
    }
}
