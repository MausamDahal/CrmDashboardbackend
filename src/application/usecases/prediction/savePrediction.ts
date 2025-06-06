import { PredictionRepository } from "../../../domain/repositories/predictionRepository";
import { RiskAlertRepository } from "../../../domain/repositories/riskAlertRepository";
import { Prediction } from "../../../domain/types/prediction";
import { RiskCategory, RiskSeverity } from "../../../domain/types/riskAlert";
import { getRiskMessage } from "../../../utils/getRiskMessageByFeature";
import { generateChurnRiskMessage } from "./generateChurnRiskMessage";

export async function savePredictionIfChanged(
    tenantId: string,
    predictions: Prediction[],
    predictionRepo: PredictionRepository,
    riskAlertRepo: RiskAlertRepository
): Promise<Prediction[]> {
    const saved: Prediction[] = [];

    for (const prediction of predictions) {
        const latest = await predictionRepo.getLatestPrediction(tenantId, prediction.customer_id);

        const isSame = latest &&
            latest.churn_prediction === prediction.churn_prediction &&
            Math.abs(latest.churn_probability - prediction.churn_probability) < 0.01;

        if (!isSame) {
            const now = new Date().toISOString();

            if (latest) await predictionRepo.updateIsLatestFlag(tenantId, latest.customer_id, latest.latest_prediction_at, false);

            const toSave = { ...prediction, latest_prediction_at: now, is_latest: true };
            await predictionRepo.savePrediction(tenantId, toSave);
            saved.push(toSave);

            if (prediction.risk_level === "High Risk") {
                await riskAlertRepo.saveAlert(tenantId, {
                    id: prediction.customer_id,
                    category: "Churn Risk",
                    severity: "Critical",
                    message: generateChurnRiskMessage(prediction.key_factors),
                    status: "New",
                    assigned_to: null,
                    created_at: now,
                });
            }

            for (const factor of prediction.key_factors) {
                const categoryMap: Record<string, RiskCategory> = {
                    Usage_Frequency: "Activity Drop",
                    Payment_Delay: "Payment Issue",
                    Support_Calls: "Support Escalation",
                    Days_Since_Last_Interaction: "Activity Drop",

                    Age: "Demographic Risk",
                    Gender: "Demographic Risk",
                    Dependents: "Demographic Risk",
                    Partner: "Demographic Risk",
                    Tenure: "Demographic Risk",

                    Total_Spend: "Behavioral Pattern Risk",
                    Subscription_Type: "Behavioral Pattern Risk",
                    Contract_Length: "Behavioral Pattern Risk",
                };


                const category = categoryMap[factor.feature] || "Churn Risk";
                const contribution = factor.contribution;

                if (Math.abs(contribution) > 0.3) {
                    const severity: RiskSeverity =
                        contribution >= 1.5 ? "Critical" :
                            contribution >= 1.0 ? "High" :
                                contribution >= 0.5 ? "Medium" : "Low";

                    await riskAlertRepo.saveAlert(tenantId, {
                        id: prediction.customer_id,
                        category,
                        severity,
                        message: getRiskMessage(factor.feature, contribution),
                        status: "New",
                        assigned_to: null,
                        created_at: now
                    });
                }
            }
        }
    }

    return saved;
}