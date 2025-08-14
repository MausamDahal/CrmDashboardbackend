import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../infrastructure/database/dynamoDBClient";

async function addTestTenant() {
    const client = await initDynamoDB();

    const testTenant = {
        TenantId: "test-tenant-1",
        Subdomain: "test",
        name: "Test Tenant",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        await client.send(
            new PutCommand({
                TableName: "NestCRM-Tenant",
                Item: testTenant
            })
        );
        console.log("Test tenant added successfully");
    } catch (error) {
        console.error("Error adding test tenant:", error);
    }
}

addTestTenant().catch(console.error); 