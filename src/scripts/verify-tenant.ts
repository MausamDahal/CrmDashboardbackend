import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { loadSecrets } from "../utils/secretManager";

async function verifyTenant() {
    try {
        // Load secrets into environment
        await loadSecrets();
        console.log(' Secrets loaded successfully');

        // Initialize DynamoDB client
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
        const docClient = DynamoDBDocumentClient.from(client);

        // Scan for the test tenant
        const result = await docClient.send(new ScanCommand({
            TableName: "NestCRM-Tenant",
            FilterExpression: "Subdomain = :subdomain",
            ExpressionAttributeValues: {
                ":subdomain": "test"
            }
        }));

        console.log('\nFound tenants:', JSON.stringify(result.Items, null, 2));
        
        if (result.Items && result.Items.length > 0) {
            console.log('\n Test tenant exists in database');
            const tenant = result.Items[0];
            console.log('\nTenant structure:');
            console.log('- ID:', tenant.ID);
            console.log('- TenantId:', tenant.TenantId);
            console.log('- Subdomain:', tenant.Subdomain);
            console.log('- Status:', tenant.Status);
        } else {
            console.log('\n Test tenant not found in database');
        }

    } catch (error) {
        console.error(' Error verifying tenant:', error);
    }
}

verifyTenant(); 