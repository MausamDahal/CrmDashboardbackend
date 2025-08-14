<<<<<<< HEAD
import { initDynamoDB } from '../database/dynamoDBClient';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getTenantBySubdomain(subdomain: string) {
    const client = await initDynamoDB();

    const result = await client.send(
        new QueryCommand({
            TableName: "CRM-Tenant",
            IndexName: "Subdomain-index",
            KeyConditionExpression: "#sub = :val",
            ExpressionAttributeNames: { "#sub": "Subdomain" },
            ExpressionAttributeValues: { ":val": subdomain },
        })
    );

    return result.Items?.[0] || null;
}
=======
import { initDynamoDB } from '../database/dynamoDBClient';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function getTenantBySubdomain(subdomain: string) {
    const client = await initDynamoDB();

    const result = await client.send(
        new QueryCommand({
            TableName: "CRM-Tenant",
            IndexName: "Subdomain-index",
            KeyConditionExpression: "#sub = :val",
            ExpressionAttributeNames: { "#sub": "Subdomain" },
            ExpressionAttributeValues: { ":val": subdomain },
        })
    );

    return result.Items?.[0] || null;
}
>>>>>>> 14c74a517d247caf3c8a839c29c062bc853858c3
