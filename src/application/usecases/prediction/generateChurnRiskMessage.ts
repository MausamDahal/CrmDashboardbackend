import { Prediction } from "../../../domain/types/prediction";

export function generateChurnRiskMessage(factors: Prediction["key_factors"]): string {
    const reasons = factors.map(({ feature, contribution }) => {
        const score = contribution.toFixed(2);
        switch (feature) {
            case "Usage_Frequency":
                return `low platform usage (impact: ${score})`;
            case "Payment_Delay":
                return `payment delays (impact: ${score})`;
            case "Support_Calls":
                return `many support calls (impact: ${score})`;
            case "Days_Since_Last_Interaction":
                return `long time since last interaction (impact: ${score})`;
            case "Age":
                return `age-related behavior (impact: ${score})`;
            case "Dependents":
                return `number of dependents (impact: ${score})`;
            case "Partner":
                return `relationship status impact (impact: ${score})`;
            case "Tenure":
                return `short tenure (impact: ${score})`;
            case "Total_Spend":
                return `low total spend (impact: ${score})`;
            case "Subscription_Type":
                return `subscription type impact (impact: ${score})`;
            case "Contract_Length":
                return `short contract length (impact: ${score})`;
            default:
                return `${feature} (impact: ${score})`;
        }
    });

    return reasons.length ? `High churn risk due to: ${reasons.join(", ")}.` : "This customer is at high risk of churn.";
}
