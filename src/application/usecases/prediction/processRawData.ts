const FULL_FEATURES = [
    "Age", "Gender", "Dependents", "Partner", "Tenure",
    "Usage_Frequency", "Total_Spend", "Support_Calls", "Payment_Delay",
    "Subscription_Type", "Contract_Length", "Days_Since_Last_Interaction"
];

const LIGHT_FEATURES = [
    "Age", "Gender", "Partner", "Tenure",
    "Usage_Frequency", "Days_Since_Last_Interaction"
];

export function normalizeAndSplitData(data: any[], mappings: any[]) {
    const fullBatch: any[] = [];
    const lightBatch: any[] = [];

    for (const entry of data) {
        const flat: Record<string, any> = {
            ...entry.customFields,
            ...entry.associations
        };

        const normalized: Record<string, any> = {};
        for (const { modelField, tenantField } of mappings) {
            normalized[modelField] = flat[tenantField];
        }

        normalized.CustomerID = entry.associations?.id ?? entry.id;
        encodeCategoricals(normalized);

        const hasAll = (fields: string[]) => fields.every(f => normalized[f] !== undefined);

        if (hasAll(FULL_FEATURES)) fullBatch.push(normalized);
        else if (hasAll(LIGHT_FEATURES)) lightBatch.push(normalized);
    }

    return { fullBatch, lightBatch };
}

function encodeCategoricals(record: Record<string, any>) {
    const genderMap: any = { Male: 0, Female: 1 };
    const partnerMap: any = { Married: 0, Single: 1, Divorced: 2, Unknown: 3 };
    const subscriptionMap: any = { Basic: 0, Standard: 1, Premium: 2 };
    const contractMap: any = { Monthly: 0, Annual: 1, Quarterly: 2 };

    record.Gender = genderMap[record.Gender] ?? 0;
    record.Partner = partnerMap[record.Partner] ?? partnerMap.Unknown;
    record.Subscription_Type = subscriptionMap[record.Subscription_Type] ?? subscriptionMap.Basic;
    record.Contract_Length = contractMap[record.Contract_Length] ?? contractMap.Monthly;

    return record;
}