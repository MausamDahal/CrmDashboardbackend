import { initDynamoDB } from '../database/dynamoDBClient';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getTenantBySubdomain(subdomain: string) {
    const client = await initDynamoDB();

    const result = await client.send(
        new QueryCommand({
            TableName: "NestCRM-Tenant",
            IndexName: "Subdomain-index",
            KeyConditionExpression: "#sub = :val",
            ExpressionAttributeNames: { "#sub": "Subdomain" },
            ExpressionAttributeValues: { ":val": subdomain },
        })
    );

    return result.Items?.[0] || null;
}
