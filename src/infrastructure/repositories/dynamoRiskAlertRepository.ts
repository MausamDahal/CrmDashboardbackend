// infrastructure/repositories/dynamoRiskAlertRepository.ts
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { RiskAlertRepository } from "../../domain/repositories/riskAlertRepository";
import { RiskAlert } from "../../domain/types/riskAlert";

export class DynamoRiskAlertRepository implements RiskAlertRepository {
    getTableName(subdomain: string): string {
        return `CRM-${subdomain}-RiskAlert`;
    }

    async saveAlert(subdomain: string, alert: RiskAlert): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: alert,
            })
        );
    }

    async getAlerts(subdomain: string): Promise<RiskAlert[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
            })
        );
        console.log(result.Items);
        return result.Items as RiskAlert[];
    }

    async updateAlertStatus(subdomain: string, id: string, status: string): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new UpdateCommand({
                TableName: this.getTableName(subdomain),
                Key: { id },
                UpdateExpression: "SET #status = :status",
                ExpressionAttributeNames: { "#status": "status" },
                ExpressionAttributeValues: { ":status": status },
            })
        );
    }
}
