import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { loadSecrets } from "../utils/secretManager";
import { v4 as uuidv4 } from "uuid";

async function createTestTenant() {
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

        // Create test tenant
        const tenantId = uuidv4();
        const tenant = {
            ID: tenantId,  //  ID field for subscription service
            TenantId: tenantId,  //  TenantId for DynamoDB primary key
            CompanyName: "Test Company",
            Email: "test@example.com",
            Password: "test123", 
            Subdomain: "test",
            Domain: "test.nestcrm.com.au",
            Status: "active",
            CreatedAt: new Date().toISOString()
        };

        // Save tenant to DynamoDB
        await docClient.send(new PutCommand({
            TableName: "NestCRM-Tenant",
            Item: tenant
        }));

        console.log(' Test tenant created successfully:', tenant);
        console.log('\nTenant ID:', tenantId);
        console.log('Subdomain:', tenant.Subdomain);
        console.log('Email:', tenant.Email);

    } catch (error) {
        console.error(' Error creating test tenant:', error);
    }
}

createTestTenant(); 