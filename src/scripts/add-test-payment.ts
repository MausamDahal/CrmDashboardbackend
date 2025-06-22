import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { loadSecrets } from '../utils/loadSecrets';

async function addTestPayment() {
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

        // Test payment data
        const testPayment = {
            id: 'test-payment-1',
            amount: 100.00,
            currency: 'USD',
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customerId: 'test-customer-1',
            description: 'Test payment for development'
        };

        // Add payment to the table
        const command = new PutCommand({
            TableName: 'NestCRM-test-Payment',
            Item: testPayment
        });

        await docClient.send(command);
        console.log('Test payment added successfully:', testPayment);

    } catch (error) {
        console.error('Error adding test payment:', error);
    }
}


addTestPayment(); 