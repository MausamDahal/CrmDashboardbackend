// src/infrastructure/database/DynamoDBClient.ts
import { loadSecrets } from "../../utils/loadSecrets";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let docClient: DynamoDBDocumentClient;

export async function initDynamoDB(): Promise<DynamoDBDocumentClient> {
    if (docClient) return docClient;

    await loadSecrets();

    const client = new DynamoDBClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    docClient = DynamoDBDocumentClient.from(client);
    console.log("✅ DynamoDB initialized");
    return docClient;
}
