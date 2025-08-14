import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { loadSecrets } from '../utils/loadSecrets';
import crypto from 'crypto';

async function testSubscription() {
    try {
        // Load secrets
        await loadSecrets();
        console.log('Secrets loaded into process.env');

        // Initialize DynamoDB client
        const client = new DynamoDBClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });

        const docClient = DynamoDBDocumentClient.from(client);
        const subdomain = 'test';
        const tenantId = 'test-tenant-1';
        const now = new Date().toISOString();

        // Test subscription data
        const testSubscription = {
            ID: crypto.randomUUID(),
            TenantID: tenantId,
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

        //   creating a test subscription
        console.log('\n1. Testing subscription creation...');
        await docClient.send(new PutCommand({
            TableName: 'NestCRM-Subscription',
            Item: testSubscription
        }));
        console.log('✓ Subscription created successfully');

        //  Test retrieving subscription
        console.log('\n2. Testing subscription retrieval...');
        const getResult = await docClient.send(new QueryCommand({
            TableName: 'NestCRM-Subscription',
            IndexName: 'TenantID-index',
            KeyConditionExpression: 'TenantID = :tenantId',
            ExpressionAttributeValues: {
                ':tenantId': tenantId
            }
        }));
        console.log('✓ Subscription retrieved successfully');
        console.log('Retrieved subscription:', getResult.Items?.[0]);

        // Testing switch subscription
        console.log('\n3. Testing subscription switch...');
        const newPlanId = 'plan_premium';
        await docClient.send(new PutCommand({
            TableName: 'NestCRM-Subscription',
            Item: {
                ...testSubscription,
                ID: crypto.randomUUID(),
                PlanID: newPlanId,
                Status: 'active',
                StartDate: now,
                CurrentPeriodStart: now,
                CurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                CreatedAt: now,
                UpdatedAt: now
            }
        }));
        console.log('✓ Subscription switched successfully');

        //  Testing  canceling subscription
        console.log('\n4. Testing subscription cancellation...');
        await docClient.send(new PutCommand({
            TableName: 'NestCRM-Subscription',
            Item: {
                ...testSubscription,
                Status: 'canceled',
                CancelAtPeriodEnd: true,
                CanceledAt: now,
                UpdatedAt: now
            }
        }));
        console.log('✓ Subscription cancelled successfully');

        console.log('\nAll subscription tests completed successfully!');
        console.log('\nTo verify the results, you can:');
        console.log('1. Check the DynamoDB table "NestCRM-Subscription"');
        console.log('2. Use the API endpoints:');
        console.log('   - GET /api/subscription/status');
        console.log('   - POST /api/subscription/switch');
        console.log('   - POST /api/subscription/cancel');

    } catch (error) {
        console.error('Error testing subscription:', error);
    }
}


testSubscription(); 