import { SupportRepository } from "../../domain/repositories/supportRepository";
import { Support } from "../../domain/types/support";
import { v4 as uuidv4 } from "uuid";

export class SupportUseCase {
    constructor(private repository: SupportRepository) { }

    async saveSupport(subdomain: string, payload: Support): Promise<void> {
        const { associations, customFields } = payload;

        if (!associations?.id && !associations?.email) {
            throw new Error("You must provide at least id or email for association");
        }

        const supportId = associations?.id || uuidv4();

        const support: Support = {
            customFields: customFields || {},
            associations,
            id: supportId
        };

        await this.repository.saveSupport(subdomain, support);
    }

    async getSupports(subdomain: string): Promise<Support[]> {
        return await this.repository.getSupports(subdomain);
    }
}
