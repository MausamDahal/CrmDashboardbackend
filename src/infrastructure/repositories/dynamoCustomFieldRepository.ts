import { CustomFieldRepository } from "../../domain/repositories/customFieldRepository";
import { PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { initDynamoDB } from "../database/dynamoDBClient";
import { CustomField, FieldCategory } from "../../domain/types/customFields";

export class DynamoCustomFieldRepository implements CustomFieldRepository {
    async saveFields(
        tenantId: string,
        fields: CustomField[],
        category: FieldCategory,
    ): Promise<void> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;
        const pk = `CustomFieldSet#${category}`;

        await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                PK: pk,
                Category: category,
                Fields: fields
            },
        }));
    }

    async getFields(tenantId: string, category: FieldCategory): Promise<CustomField[]> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;
        const pk = `CustomFieldSet#${category}`;

        const result = await client.send(new GetCommand({
            TableName: tableName,
            Key: { PK: pk },
        }));

        return result.Item?.Fields || [];
    }

    async getAllFieldsGroupedByCategory(tenantId: string): Promise<Record<FieldCategory, CustomField[]>> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;

        const result = await client.send(new ScanCommand({
            TableName: tableName,
            FilterExpression: "begins_with(PK, :prefix)",
            ExpressionAttributeValues: {
                ":prefix": "CustomFieldSet#"
            }
        }));

        const groupedFields: Record<FieldCategory, CustomField[]> = {
            Customer: [],
            Order: [],
            Payment: [],
            Interaction: [],
            Support: [],
        };

        for (const item of result.Items || []) {
            const category = item.Category as FieldCategory;
            if (category in groupedFields) {
                groupedFields[category] = item.Fields || [];
            }
        }

        return groupedFields;
    }

    async savePredictionFieldMappings(
        tenantId: string,
        mappings: {
            modelField: string;
            tenantField: string;
            category: string;
        }[]
    ): Promise<void> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;

        await client.send(new PutCommand({
            TableName: tableName,
            Item: {
                PK: "PredictionMapping",
                Mappings: mappings
            }
        }));
    }

    async getPredictionFieldMappings(tenantId: string): Promise<{
        modelField: string;
        tenantField: string;
        category: string;
    }[]> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;

        const result = await client.send(new GetCommand({
            TableName: tableName,
            Key: { PK: "PredictionMapping" }
        }));

        const rawMappings = result.Item?.Mappings || [];
        return rawMappings.map((m: any) => ({
            modelField: m.modelField || m.M?.modelField?.S,
            tenantField: m.tenantField || m.M?.tenantField?.S,
            category: m.category || m.M?.category?.S
        }));
    }

    async getPredictionMappings(tenantId: string): Promise<{ modelField: string; tenantField: string; category: string }[]> {
        const client = await initDynamoDB();
        const tableName = `NestCRM-${tenantId}-CustomFields`;
        const result = await client.send(new GetCommand({
            TableName: tableName,
            Key: { PK: "PredictionMapping" }
        }));

        return result.Item?.Mappings || [];
    }

    async getCustomerData(
        tenantId: string,
        mapping: { modelField: string; tenantField: string; category: string }[]
    ): Promise<Record<string, any>[]> {
        const client = await initDynamoDB();
        const groupedByTable: Record<string, Set<string>> = {};

        for (const { tenantField, category } of mapping) {
            if (!groupedByTable[category]) groupedByTable[category] = new Set();
            groupedByTable[category].add(tenantField);
        }

        const customerTable = `NestCRM-${tenantId}-Customer`;
        const result = await client.send(new ScanCommand({ TableName: customerTable }));
        return result.Items || [];
    }

}
