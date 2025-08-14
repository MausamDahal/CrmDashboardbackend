export type FieldCategory = 'Customer' | 'Order' | 'Payment' | 'Interaction' | 'Support';

export type CustomField = {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'number' | 'boolean';
    required: boolean;
    options?: string[];
    uiConfig?: {
        type?: string;
        tooltip?: string;
        colorMap?: Record<string, string>;
        [key: string]: any;
    };
};
