import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { ApiKeyRepository } from "../../domain/repositories/apiKeyRepository";
import { ApiKeyRecord } from "../../domain/types/apiKey";

export class DynamoApiKeyRepository implements ApiKeyRepository {
    getTableName(subdomain: string): string {
        return `NestCRM-${subdomain}-ApiKey`;
    }

    async save(subdomain: string, record: ApiKeyRecord): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: record,
            })
        );
    }

    async revoke(subdomain: string, id: string): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: { id },
                UpdateExpression: "set active = :false",
                ExpressionAttributeValues: { ":false": false },
            })
        );
    }

    async getAll(subdomain: string): Promise<ApiKeyRecord[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
            })
        );
        return (result.Items as ApiKeyRecord[]) || [];
    }

    async getById(subdomain: string, id: string): Promise<ApiKeyRecord | null> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
                FilterExpression: "id = :id",
                ExpressionAttributeValues: {
                    ":id": id,
                },
            })
        );
        return result.Items?.[0] as ApiKeyRecord || null;
    }


    async getByHashedKey(subdomain: string, hashedKey: string): Promise<ApiKeyRecord | null> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
                FilterExpression: "hashedKey = :hashedKey",
                ExpressionAttributeValues: {
                    ":hashedKey": hashedKey,
                },
            })
        );
        return result.Items?.[0] as ApiKeyRecord || null;
    }
}
