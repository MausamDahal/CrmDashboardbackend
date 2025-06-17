import { DynamoDBClient, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { loadSecrets } from "../utils/loadSecrets";

async function deleteTable() {
    await loadSecrets();
    
    const client = new DynamoDBClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    try {
        await client.send(
            new DeleteTableCommand({
                TableName: "NestCRM-Tenant"
            })
        );
        console.log("Table 'NestCRM-Tenant' deleted successfully");
    } catch (error) {
        console.error("Error deleting table:", error);
    }
}

deleteTable().catch(console.error); 