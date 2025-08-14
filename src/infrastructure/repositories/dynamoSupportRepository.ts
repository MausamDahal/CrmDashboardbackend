<<<<<<< HEAD
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Support } from "../../domain/types/support";
import { SupportRepository } from "../../domain/repositories/supportRepository";

export class DynamoSupportRepository implements SupportRepository {
    getTableName(subdomain: string): string {
        return `CRM-${subdomain}-Support`;
    }

    async saveSupport(subdomain: string, support: Support): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: support,
            })
        );
    }

    async getSupports(subdomain: string): Promise<Support[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Support[];
    }
}
=======
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Support } from "../../domain/types/support";
import { SupportRepository } from "../../domain/repositories/supportRepository";

export class DynamoSupportRepository implements SupportRepository {
    getTableName(subdomain: string): string {
        return `NestCRM-${subdomain}-Support`;
    }

    async saveSupport(subdomain: string, support: Support): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: support,
            })
        );
    }

    async getSupports(subdomain: string): Promise<Support[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Support[];
    }
}
>>>>>>> 14c74a517d247caf3c8a839c29c062bc853858c3
