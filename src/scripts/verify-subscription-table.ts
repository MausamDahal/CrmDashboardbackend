import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { loadSecrets } from '../utils/loadSecrets';
import crypto from 'crypto';

async function verifySubscriptionTable() {
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
        const tableName = 'NestCRM-Subscription';

        // 1. Check if table exists and get its details
        console.log('\n1. Checking table details...');
        try {
            const tableDetails = await client.send(new DescribeTableCommand({
                TableName: tableName
            }));
            console.log('✓ Table exists!');
            console.log('Table Status:', tableDetails.Table?.TableStatus);
            console.log('Number of items:', tableDetails.Table?.ItemCount);
        } catch (error: any) {
            if (error.name === 'ResourceNotFoundException') {
                console.error(' Table does not exist!');
                return;
            }
            throw error;
        }

        // 2. Add a test subscription
        console.log('\n2. Adding test subscription...');
        const testSubscription = {
            ID: crypto.randomUUID(),
            TenantID: 'test-tenant-1',
            StripeCustomerID: 'cus_test123',
            StripeSubscriptionID: 'sub_test123',
            PlanID: 'plan_basic',
            Currency: 'USD',
            Interval: 'month',
            Amount: 29.99,
            TrialDays: 14,
            Status: 'active',
            StartDate: new Date().toISOString(),
            CurrentPeriodStart: new Date().toISOString(),
            CurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            TrialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            CancelAtPeriodEnd: false,
            CanceledAt: null,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: tableName,
            Item: testSubscription
        }));
        console.log('✓ Test subscription added successfully!');

        //  Query the test subscription
        console.log('\n3. Querying test subscription...');
        const queryResult = await docClient.send(new QueryCommand({
            TableName: tableName,
            IndexName: 'TenantID-index',
            KeyConditionExpression: 'TenantID = :tenantId',
            ExpressionAttributeValues: {
                ':tenantId': 'test-tenant-1'
            }
        }));

        console.log('✓ Query successful!');
        console.log('\nRetrieved subscription:');
        console.log(JSON.stringify(queryResult.Items?.[0], null, 2));

        console.log('\nVerification complete! The subscription table is working correctly.');
        console.log('\nYou can now use the API endpoints:');
        console.log('1. GET /api/subscription/status');
        console.log('2. POST /api/subscription/switch');
        console.log('3. POST /api/subscription/cancel');

    } catch (error) {
        console.error('Error verifying subscription table:', error);
    }
}


verifySubscriptionTable(); 