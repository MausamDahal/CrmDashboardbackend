import { CustomField, FieldCategory } from "../types/customFields";

export interface CustomFieldRepository {
    saveFields(
        tenantId: string,
        fields: CustomField[],
        category: FieldCategory,
    ): Promise<void>;

    getFields(tenantId: string, category: FieldCategory): Promise<CustomField[]>;
    getAllFieldsGroupedByCategory(tenantId: string): Promise<Record<string, CustomField[]>>;
    savePredictionFieldMappings(
        tenantId: string,
        mappings: {
            modelField: string;
            tenantField: string;
            category: string;
        }[]
    ): Promise<void>;

    getPredictionFieldMappings(tenantId: string): Promise<{
        modelField: string;
        tenantField: string;
        category: string;
    }[]>;
    getCustomerData(
        tenantId: string,
        mapping: { modelField: string; tenantField: string; category: string }[]
    ): Promise<Record<string, any>[]>
    getPredictionMappings(tenantId: string): Promise<{ modelField: string; tenantField: string; category: string }[]>
}
