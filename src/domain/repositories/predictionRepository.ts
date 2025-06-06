import { Prediction } from "../types/prediction";

export interface PredictionRepository {
    savePrediction(subdomain: string, prediction: Prediction): Promise<void>;
    getPredictions(subdomain: string): Promise<Prediction[]>;
    getLatestPrediction(subdomain: string, customerId: string): Promise<Prediction | null>;
    updateIsLatestFlag(subdomain: string, customerId: string, latestAt: string, isLatest: boolean): Promise<void>;
}
