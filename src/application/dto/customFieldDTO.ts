import { CustomField } from "../../domain/types/customFields";

export interface CustomFieldDTO {
    key: string;
    label: string;
    type: CustomField;
    required: boolean;
    options?: string[];
}