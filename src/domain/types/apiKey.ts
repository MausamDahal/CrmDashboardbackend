export interface ApiKeyRecord {
    id: string;
    hashedKey: string;
    description?: string;
    createdAt: string;
    active: boolean;
}
