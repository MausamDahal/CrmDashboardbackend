import { ModelService } from "../../../domain/services/aiServices";
import { PredictionRepository } from "../../../domain/repositories/predictionRepository";
import { RiskAlertRepository } from "../../../domain/repositories/riskAlertRepository";
import { Prediction } from "../../../domain/types/prediction";
import { savePredictionIfChanged } from "./savePrediction";

interface BatchInput {
    tenantId: string;
    fullBatch: any[];
    lightBatch: any[];
    modelService: ModelService;
    predictionRepo: PredictionRepository;
    riskAlertRepo: RiskAlertRepository;
}

export async function processPredictionBatches({
    tenantId,
    fullBatch,
    lightBatch,
    modelService,
    predictionRepo,
    riskAlertRepo,
}: BatchInput): Promise<Prediction[]> {
    const results: Prediction[] = [];

    if (fullBatch.length > 0) {
        const fullPredictions = await modelService.predictChurn({ data: fullBatch });
        const saved = await savePredictionIfChanged(tenantId, fullPredictions, predictionRepo, riskAlertRepo);
        results.push(...saved);
    }

    if (lightBatch.length > 0) {
        const lightPredictions = await modelService.predictChurn({ data: lightBatch });
        const saved = await savePredictionIfChanged(tenantId, lightPredictions, predictionRepo, riskAlertRepo);
        results.push(...saved);
    }

    return results;
}