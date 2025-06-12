import { PutCommand, ScanCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { SubscriptionRepository } from "../../domain/repositories/subscriptionRepository";
import { Subscription } from "../../domain/types/subscription";

export class DynamoSubscriptionRepository implements SubscriptionRepository {
    getTableName(subdomain: string = "NestCRM-Subscription"): string {
        return `NestCRM-Subscription`;
    }

    
    async save(subdomain: string, subscription: Subscription): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: subscription,
            })
        );
    }

    async updateStatus(subdomain: string, id: string, status: string): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: { ID: id },
                UpdateExpression: "SET #status = :status, UpdatedAt = :now",
                ExpressionAttributeNames: { "#status": "Status" },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":now": new Date().toISOString(),
                },
            })
        );
    }

    async getByTenantId(subdomain: string, tenantId: string): Promise<Subscription[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new QueryCommand({
                TableName: this.getTableName(subdomain),
                IndexName: "TenantID-index",
                KeyConditionExpression: "TenantID = :tenantId",
                ExpressionAttributeValues: {
                    ":tenantId": tenantId,
                },
            })
        );
        return (result.Items as Subscription[]) || [];
    }

    async getByStripeId(subdomain: string, stripeSubscriptionId: string): Promise<Subscription | null> {
        const client = await initDynamoDB();
        const result = await client.send(
            new QueryCommand({
                TableName: this.getTableName(subdomain),
                IndexName: "StripeSubscriptionID-index",
                KeyConditionExpression: "StripeSubscriptionID = :sid",
                ExpressionAttributeValues: {
                    ":sid": stripeSubscriptionId,
                },
            })
        );
        return result.Items?.[0] as Subscription || null;
    }
    async updateFields(subdomain: string, id: string, updateFields: Partial<Subscription>): Promise<void> {
        
    }  
}
