import { PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Customer } from "../../domain/types/customer";
import { CustomerRepository } from "../../domain/repositories/customerRepository";

export class DynamoCustomerRepository implements CustomerRepository {
    getTableName(subdomain: string): string {
        return `CRM-${subdomain}-Customer`;
    }

    async saveCustomer(subdomain: string, customer: Customer): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: customer,
            })
        );
    }

    async getCustomers(subdomain: string): Promise<Customer[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Customer[];
    }

    async findById(subdomain: string, id: string): Promise<any> {
        const client = await initDynamoDB();
        const result = await client.send(
            new QueryCommand({
                TableName: this.getTableName(subdomain),
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: { ":id": id }
            })
        );
        return result.Items?.[0] ?? null;
    }

    async findByEmail(subdomain: string, email: string): Promise<any> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({
                TableName: this.getTableName(subdomain),
                FilterExpression: "associations.email = :email",
                ExpressionAttributeValues: { ":email": email }
            })
        );
        return result.Items?.[0] ?? null;
    }
}