export type Prediction = {
    customer_id: string;
    churn_prediction: "Yes" | "No";
    churn_probability: number;
    risk_level: "Low Risk" | "Medium Risk" | "High Risk";
    type: "CHURN_PREDICTION";
    key_factors: {
        feature: string;
        contribution: number;
    }[];
    created_at: string;
    latest_prediction_at: string;
    is_latest?: boolean;
};
