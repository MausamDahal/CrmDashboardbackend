import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { OrderRepository } from "../../domain/repositories/orderRepository";
import { Order } from "../../domain/types/order";

export class DynamoOrderRepository implements OrderRepository {
    getTableName(subdomain: string): string {
        return `NestCRM-${subdomain}-Order`;
    }

    async saveOrder(subdomain: string, order: Order): Promise<void> {
        const client = await initDynamoDB();
        await client.send(new PutCommand({
            TableName: this.getTableName(subdomain),
            Item: order
        }));
    }

    async getOrders(subdomain: string): Promise<Order[]> {
        const client = await initDynamoDB();
        const result = await client.send(new ScanCommand({
            TableName: this.getTableName(subdomain)
        }));
        return result.Items as Order[];
    }
}
