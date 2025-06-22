import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { loadSecrets } from '../utils/loadSecrets';

async function setupPaymentTable() {
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

        const tableName = 'NestCRM-test-Payment';

        // Check if table exists
        try {
            await client.send(new DescribeTableCommand({ TableName: tableName }));
            console.log(`Table '${tableName}' already exists`);
            return;
        } catch (error: any) {
            if (error.name !== 'ResourceNotFoundException') {
                throw error;
            }
        }

        // Create table
        const command = new CreateTableCommand({
            TableName: tableName,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }  
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        });

        await client.send(command);
        console.log(`Table '${tableName}' created successfully`);

    } catch (error) {
        console.error('Error setting up payment table:', error);
    }
}


setupPaymentTable(); 