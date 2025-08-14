export type RiskSeverity = "Low" | "Medium" | "High" | "Critical";
export type RiskCategory =
    | "Churn Risk"
    | "Activity Drop"
    | "Payment Issue"
    | "Support Escalation"
    | "Contract Termination"
    | "Billing Dispute"
    | "Demographic Risk"
    | "Behavioral Pattern Risk"
    | "Usage Spike"
    | "Subscription Downgrade"
    | "Feature Request Surge";


export type RiskAlertStatus = "New" | "In Progress" | "Resolved";

export type RiskAlert = {
    id: string;
    category: RiskCategory;
    severity: RiskSeverity;
    message: string;
    status: RiskAlertStatus;
    assigned_to?: string | null;
    created_at: string;
};
