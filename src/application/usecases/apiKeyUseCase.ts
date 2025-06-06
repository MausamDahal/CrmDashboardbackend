import { ApiKeyRepository } from "../../domain/repositories/apiKeyRepository";
import { ApiKeyRecord } from "../../domain/types/apiKey";
import { generateApiKey } from "../../utils/generateApiKey";
import { v4 as uuidv4 } from "uuid";

export class ApiKeyUseCase {
    constructor(private repository: ApiKeyRepository) { }

    async createApiKey(subdomain: string, description?: string): Promise<{ id: string; rawKey: string; createdAt: string }> {
        const { raw, hash } = generateApiKey();
        const id = uuidv4();
        const createdAt = new Date().toISOString();

        const record: ApiKeyRecord = {
            id,
            hashedKey: hash,
            description,
            createdAt,
            active: true,
        };

        await this.repository.save(subdomain, record);

        return { id, rawKey: raw, createdAt };
    }

    async listApiKeys(subdomain: string): Promise<Omit<ApiKeyRecord, "hashedKey">[]> {
        const keys = await this.repository.getAll(subdomain);
        return keys.map(({ hashedKey, ...rest }) => rest); // Hide hashedKey
    }

    async getApiKeyById(subdomain: string, id: string): Promise<Omit<ApiKeyRecord, "hashedKey"> | null> {
        const key = await this.repository.getById(subdomain, id);
        if (key?.active === false) return { id: key.id, description: key.description, createdAt: key.createdAt, active: key.active };
        if (!key) return null;
        return key;
    }


    async revokeApiKey(subdomain: string, id: string): Promise<void> {
        await this.repository.revoke(subdomain, id);
    }
}
