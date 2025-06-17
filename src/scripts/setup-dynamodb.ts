import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { loadSecrets } from "../utils/loadSecrets";

async function setupDynamoDB() {
    await loadSecrets();
    
    const client = new DynamoDBClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    // Check if table exists
    const listTables = await client.send(new ListTablesCommand({}));
    if (listTables.TableNames?.includes("NestCRM-Tenant")) {
        console.log("Table 'NestCRM-Tenant' already exists");
        return;
    }

    // Create table
    const createTableCommand = new CreateTableCommand({
        TableName: "NestCRM-Tenant",
        KeySchema: [
            { AttributeName: "TenantId", KeyType: "HASH" }, // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "TenantId", AttributeType: "S" },
            { AttributeName: "Subdomain", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "Subdomain-index",
                KeySchema: [
                    { AttributeName: "Subdomain", KeyType: "HASH" },
                ],
                Projection: {
                    ProjectionType: "ALL",
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
    });

    try {
        await client.send(createTableCommand);
        console.log("Table 'NestCRM-Tenant' created successfully");
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

setupDynamoDB().catch(console.error); 