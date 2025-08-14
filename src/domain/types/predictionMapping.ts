export type PredictionFieldMapping = {
    modelField: string;
    tenantField: string;
};

export type PredictionFieldMappingSet = {
    PK: string;
    Mappings: PredictionFieldMapping[];
};
