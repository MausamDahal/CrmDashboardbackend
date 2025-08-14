import { CustomFieldRepository } from "../../../domain/repositories/customFieldRepository";
import { PredictionRepository } from "../../../domain/repositories/predictionRepository";
import { RiskAlertRepository } from "../../../domain/repositories/riskAlertRepository";
import { ModelService } from "../../../domain/services/aiServices";
import { Prediction } from "../../../domain/types/prediction";
import { ChurnRate } from "../../../domain/types/churnRate";

import { normalizeAndSplitData } from "./processRawData";
import { processPredictionBatches } from "./predictionBatchProcessor";
import { calculateChurnRate } from "./churnRateCalculator";

export class AIPredictionUseCase {
    constructor(
        private fieldRepo: CustomFieldRepository,
        private predictionRepo: PredictionRepository,
        private modelService: ModelService,
        private riskAlertRepo: RiskAlertRepository
    ) { }

    async predict(tenantId: string): Promise<Prediction[]> {
        console.log(tenantId, "tenantId in predict method");
        const mappings = await this.fieldRepo.getPredictionFieldMappings(tenantId);
        if (!mappings || mappings.length === 0) throw new Error("No field mapping found");

        const rawData = await this.fieldRepo.getCustomerData(tenantId, mappings);
        if (!rawData || rawData.length === 0) throw new Error("No data found to predict");

        const { fullBatch, lightBatch } = normalizeAndSplitData(rawData, mappings);

        return await processPredictionBatches({
            tenantId,
            fullBatch,
            lightBatch,
            modelService: this.modelService,
            predictionRepo: this.predictionRepo,
            riskAlertRepo: this.riskAlertRepo
        });
    }

    async getLatestPredictions(tenantId: string): Promise<Prediction[]> {
        return this.predictionRepo.getPredictions(tenantId);
    }

    async getChurnRateByPeriod(
        tenantId: string,
        period: "daily" | "monthly" | "yearly" | "quarterly" = "monthly"
    ): Promise<ChurnRate[]> {
        const predictions = await this.predictionRepo.getPredictions(tenantId);
        return calculateChurnRate(predictions, period);
    }
}
