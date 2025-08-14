export function getRiskMessage(feature: string, impact: number): string {
    const impactText = ` (impacto: ${impact.toFixed(2)})`;

    const messages: Record<string, string> = {
        Partner: "The customer's relationship status indicates a high propensity to churn",
        Payment_Delay: "Frequent payment delays indicate a high risk of churn",
        Usage_Frequency: "The platform usage frequency is very low, indicating disengagement",
        Support_Calls: "The high number of support calls suggests dissatisfaction with the service",
        Days_Since_Last_Interaction: "It has been a long time since the last interaction with the platform",
        Subscription_Type: "The current subscription type is associated with high churn rates",
        Tenure: "Customers with shorter tenure tend to cancel more often",
        Age: "The customer's age profile is associated with a higher churn rate",
        Gender: "Analysis shows higher churn among customers with this gender profile",
        Total_Spend: "Lower spending indicates less engagement and a higher risk of churn",
        Contract_Length: "Customers with short-term contracts tend to cancel more frequently",
        Dependents: "The number of dependents may influence the cancellation decision"
    };

    return messages[feature] ? `${messages[feature]}${impactText}` : `Risk detected in ${feature}${impactText}`;

}
