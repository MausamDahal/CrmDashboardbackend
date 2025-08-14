import { RiskAlert } from "../types/riskAlert";

export interface RiskAlertRepository {
    saveAlert(subdomain: string, alert: RiskAlert): Promise<void>;
    getAlerts(subdomain: string): Promise<RiskAlert[]>;
    updateAlertStatus(subdomain: string, id: string, status: string): Promise<void>;
}
