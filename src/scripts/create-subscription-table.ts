import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { loadSecrets } from '../utils/loadSecrets';

async function createSubscriptionTable() {
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

        const tableName = 'NestCRM-Subscription';

        // Check if table exists
        try {
            await client.send(new CreateTableCommand({
                TableName: tableName,
                KeySchema: [
                    { AttributeName: 'ID', KeyType: 'HASH' }  // Partition key
                ],
                AttributeDefinitions: [
                    { AttributeName: 'ID', AttributeType: 'S' },
                    { AttributeName: 'TenantID', AttributeType: 'S' },
                    { AttributeName: 'StripeSubscriptionID', AttributeType: 'S' }
                ],
                GlobalSecondaryIndexes: [
                    {
                        IndexName: 'TenantID-index',
                        KeySchema: [
                            { AttributeName: 'TenantID', KeyType: 'HASH' }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        }
                    },
                    {
                        IndexName: 'StripeSubscriptionID-index',
                        KeySchema: [
                            { AttributeName: 'StripeSubscriptionID', KeyType: 'HASH' }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        },
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5
                        }
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            }));

            console.log(`Table ${tableName} created successfully!`);
            console.log('\nTable Schema:');
            console.log('- Primary Key: ID (String)');
            console.log('- Global Secondary Indexes:');
            console.log('  1. TenantID-index');
            console.log('  2. StripeSubscriptionID-index');
            console.log('\nAttributes:');
            console.log('- ID: String (Partition Key)');
            console.log('- TenantID: String');
            console.log('- StripeCustomerID: String');
            console.log('- StripeSubscriptionID: String');
            console.log('- PlanID: String');
            console.log('- Currency: String');
            console.log('- Interval: String');
            console.log('- Amount: Number');
            console.log('- TrialDays: Number');
            console.log('- Status: String');
            console.log('- StartDate: String');
            console.log('- CurrentPeriodStart: String');
            console.log('- CurrentPeriodEnd: String');
            console.log('- TrialEndDate: String');
            console.log('- CancelAtPeriodEnd: Boolean');
            console.log('- CanceledAt: String');
            console.log('- CreatedAt: String');
            console.log('- UpdatedAt: String');

        } catch (error: any) {
            if (error.name === 'ResourceInUseException') {
                console.log(`Table ${tableName} already exists.`);
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('Error creating subscription table:', error);
    }
}

// Run the script
createSubscriptionTable(); 