import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { loadSecrets } from "../utils/secretManager";
import { v4 as uuidv4 } from "uuid";

async function createTestSubscription() {
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

        // Get the tenant ID from the test tenant
        const tenantResult = await docClient.send(new ScanCommand({
            TableName: "NestCRM-Tenant",
            FilterExpression: "Subdomain = :subdomain",
            ExpressionAttributeValues: {
                ":subdomain": "test"
            }
        }));

        if (!tenantResult.Items || tenantResult.Items.length === 0) {
            throw new Error("Test tenant not found");
        }

        const tenant = tenantResult.Items[0];
        const now = new Date().toISOString();

        // Create test subscription
        const subscription = {
            ID: uuidv4(),
            TenantID: tenant.ID,
            StripeCustomerID: 'cus_test123',
            StripeSubscriptionID: 'sub_test123',
            PlanID: 'plan_basic',
            Currency: 'USD',
            Interval: 'month',
            Amount: 29.99,
            TrialDays: 14,
            Status: 'active',
            StartDate: now,
            CurrentPeriodStart: now,
            CurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            TrialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
            CancelAtPeriodEnd: false,
            CanceledAt: null,
            CreatedAt: now,
            UpdatedAt: now
        };

        // Save subscription to DynamoDB
        await docClient.send(new PutCommand({
            TableName: "NestCRM-Subscription",
            Item: subscription
        }));

        console.log(' Test subscription created successfully:', subscription);
        console.log('\nSubscription ID:', subscription.ID);
        console.log('Tenant ID:', subscription.TenantID);
        console.log('Plan:', subscription.PlanID);
        console.log('Status:', subscription.Status);

    } catch (error) {
        console.error(' Error creating test subscription:', error);
    }
}

createTestSubscription(); 