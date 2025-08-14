import { ApiKeyRecord } from ".././types/apiKey";

export interface ApiKeyRepository {
    save(subdomain: string, record: ApiKeyRecord): Promise<void>;
    revoke(subdomain: string, id: string): Promise<void>;
    getAll(subdomain: string): Promise<ApiKeyRecord[]>;
    getById(subdomain: string, id: string): Promise<ApiKeyRecord | null>;
    getByHashedKey(subdomain: string, hashedKey: string): Promise<ApiKeyRecord | null>;
}
