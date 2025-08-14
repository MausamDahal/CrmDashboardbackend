<<<<<<< HEAD
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Interaction } from "../../domain/types/interaction";
import { InteractionRepository } from "../../domain/repositories/interactionRepository";

export class DynamoInteractionRepository implements InteractionRepository {
    getTableName(subdomain: string): string {
        return `CRM-${subdomain}-Interaction`;
    }

    async saveInteraction(subdomain: string, interaction: Interaction): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: interaction
            })
        );
    }

    async getInteractions(subdomain: string): Promise<Interaction[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Interaction[];
    }
}
=======
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { Interaction } from "../../domain/types/interaction";
import { InteractionRepository } from "../../domain/repositories/interactionRepository";

export class DynamoInteractionRepository implements InteractionRepository {
    getTableName(subdomain: string): string {
        return `NestCRM-${subdomain}-Interaction`;
    }

    async saveInteraction(subdomain: string, interaction: Interaction): Promise<void> {
        const client = await initDynamoDB();
        await client.send(
            new PutCommand({
                TableName: this.getTableName(subdomain),
                Item: interaction
            })
        );
    }

    async getInteractions(subdomain: string): Promise<Interaction[]> {
        const client = await initDynamoDB();
        const result = await client.send(
            new ScanCommand({ TableName: this.getTableName(subdomain) })
        );
        return result.Items as Interaction[];
    }
}
>>>>>>> 14c74a517d247caf3c8a839c29c062bc853858c3
