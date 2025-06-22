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
        const existing = await this.getByTenantId(subdomain, id);
        if (!existing || existing.length === 0) throw new Error("Subscription not found");

        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: { ID: existing[0].ID },
                UpdateExpression: "SET #Status = :status, UpdatedAt = :now",
                ExpressionAttributeNames: {
                    "#Status": "Status"
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":now": new Date().toISOString()
                }
            })
        );
    }

    async updateFields(subdomain: string, id: string, updateFields: Partial<Subscription>): Promise<void> {
        const client = await initDynamoDB();
        const existing = await this.getByTenantId(subdomain, id);
        if (!existing || existing.length === 0) throw new Error("Subscription not found");

        const updateExp: string[] = [];
        const attrNames: Record<string, string> = {};
        const attrValues: Record<string, any> = { ":now": new Date().toISOString() };
        let idx = 0;

        // Add UpdatedAt field
        updateExp.push("UpdatedAt = :now");

        // Add other fields to update
        for (const key in updateFields) {
            if (key !== 'UpdatedAt' && updateFields[key as keyof Partial<Subscription>] !== undefined) {
                const nameKey = `#field${idx}`;
                const valueKey = `:val${idx}`;
                updateExp.push(`${nameKey} = ${valueKey}`);
                attrNames[nameKey] = key;
                attrValues[valueKey] = updateFields[key as keyof Partial<Subscription>];
                idx++;
            }
        }

        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: { ID: existing[0].ID },
                UpdateExpression: "SET " + updateExp.join(", "),
                ExpressionAttributeNames: attrNames,
                ExpressionAttributeValues: attrValues,
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
                ScanIndexForward: false, // Get the most recent subscriptions first
            })
        );

        // Filter out canceled subscriptions unless they're the only ones
        const subscriptions = (result.Items as Subscription[]) || [];
        const activeSubscriptions = subscriptions.filter(sub => 
            sub.Status === "active" || sub.Status === "trialing" || 
            (sub.Status === "canceled" && !sub.CancelAtPeriodEnd)
        );

        return activeSubscriptions.length > 0 ? activeSubscriptions : subscriptions;
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
}
