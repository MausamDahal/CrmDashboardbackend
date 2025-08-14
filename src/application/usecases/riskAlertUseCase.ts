// application/usecases/riskAlertUseCase.ts
import { RiskAlert } from "../../domain/types/riskAlert";
import { RiskAlertRepository } from "../../domain/repositories/riskAlertRepository";
import { v4 as uuidv4 } from "uuid";

export class RiskAlertUseCase {
    constructor(private repo: RiskAlertRepository) { }

    async createAlert(subdomain: string, data: Omit<RiskAlert, "id" | "created_at">) {
        const alert: RiskAlert = {
            id: uuidv4(),
            created_at: new Date().toISOString(),
            ...data,
        };
        await this.repo.saveAlert(subdomain, alert);
        return alert;
    }

    async getAllAlerts(subdomain: string): Promise<RiskAlert[]> {
        return this.repo.getAlerts(subdomain);
    }

    async updateAlertStatus(subdomain: string, id: string, status: string) {
        await this.repo.updateAlertStatus(subdomain, id, status);
        return { id, status };
    }
}
