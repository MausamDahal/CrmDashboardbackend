import { CustomFieldRepository } from "../../domain/repositories/customFieldRepository";
import { CustomField, FieldCategory } from "../../domain/types/customFields";
import { Associations } from "../../domain/types/associations";
import { PredictionPayload } from "../../domain/types/predictionPayload";

export class CustomFieldUseCase {
    constructor(private repository: CustomFieldRepository) { }

    async saveFields(
        tenantId: string,
        payload: {
            fields: CustomField[],
            category: FieldCategory
        }
    ): Promise<void> {
        const { fields, category } = payload;

        if (!fields || !Array.isArray(fields)) {
            throw new Error("Invalid or missing fields array");
        }

        if (!category) {
            throw new Error("Category is required");
        }

        await this.repository.saveFields(tenantId, fields, category);
    }

    async getFields(tenantId: string, category: FieldCategory): Promise<CustomField[]> {
        return await this.repository.getFields(tenantId, category);
    }

    async savePredictionFieldMappings(
        tenantId: string,
        mappings: {
            modelField: string;
            tenantField: string;
            category: string;
        }[]
    ): Promise<void> {
        await this.repository.savePredictionFieldMappings(tenantId, mappings);
    }

    async getAllFieldsGroupedByCategory(tenantId: string): Promise<Record<string, CustomField[]>> {
        return await this.repository.getAllFieldsGroupedByCategory(tenantId);
    }

    async getPredictionFieldMappings(tenantId: string): Promise<{
        modelField: string;
        tenantField: string;
        category: string;
    }[]> {
        return await this.repository.getPredictionFieldMappings(tenantId);
    }
}
