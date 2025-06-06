export interface PredictPayload {
    data: Record<string, any>[];
}

export interface ModelService {
    predictChurn(payload: PredictPayload): Promise<any>;
}