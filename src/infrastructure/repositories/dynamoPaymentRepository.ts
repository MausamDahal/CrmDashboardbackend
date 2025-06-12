import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Payment } from "../../domain/types/payment";
import { PaymentRepository } from "../../domain/repositories/paymentRepository";

import { Subscription } from "../../domain/types/subscription";

export interface SubscriptionRepository {
    save(subdomain: string, subscription: Subscription): Promise<void>;
    updateStatus(subdomain: string, id: string, status: string): Promise<void>;
    updateFields(subdomain: string, id: string, updateFields: Partial<Subscription>): Promise<void>; 
    getByTenantId(subdomain: string, tenantId: string): Promise<Subscription[]>;
    getByStripeId(subdomain: string, stripeSubscriptionId: string): Promise<Subscription | null>;
}
export class DynamoPaymentRepository implements PaymentRepository {
    getTableName(subdomain: string): string {
        return `NestCRM-${subdomain}-Payment`;
    }

    async savePayment(subdomain: string, payment: Payment): Promise<void> {
        const client = await initDynamoDB();
        const customerId = payment.associations.id || payment.associations.email;
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: {
                    id: customerId,
                    ...payment,
                },
            })
        );
    }

    async getPayments(subdomain: string): Promise<Payment[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Payment[];
    }    
}
