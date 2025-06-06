import { CustomFieldType } from "../../domain/types/customFields";

export interface CustomFieldDTO {
    key: string;
    label: string;
    type: CustomFieldType;
    required: boolean;
    options?: string[];
}