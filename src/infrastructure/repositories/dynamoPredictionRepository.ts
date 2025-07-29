import { PutCommand, QueryCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { PredictionRepository } from "../../domain/repositories/predictionRepository";
import { Prediction } from "../../domain/types/prediction";

export class DynamoPredictionRepository implements PredictionRepository {
    getTableName(subdomain: string): string {
        return `CRM-${subdomain}-Prediction`;
    }

    async savePrediction(subdomain: string, prediction: Prediction): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: {
                    id: prediction.customer_id,
                    ...prediction
                },
            })
        );
    }

    async getLatestPrediction(subdomain: string, customerId: string): Promise<any> {
        const client = await initDynamoDB();
        const result = await client.send(
            new QueryCommand({
                TableName: this.getTableName(subdomain),
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: {
                    ":id": customerId,
                },
                ScanIndexForward: false,
                Limit: 1,
            })
        );
        return result.Items?.[0] ?? null;
    }

    async updateIsLatestFlag(subdomain: string, customerId: string, latestAt: string, isLatest: boolean): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: {
                    id: customerId,
                    latest_prediction_at: latestAt,
                },
                UpdateExpression: "SET is_latest = :flag",
                ExpressionAttributeValues: {
                    ":flag": isLatest,
                },
            })
        );
    }

    async getPredictions(subdomain: string): Promise<Prediction[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
                FilterExpression: "is_latest = :trueVal",
                ExpressionAttributeValues: {
                    ":trueVal": true
                }
            })
        );
        return result.Items as Prediction[];
    }
}
