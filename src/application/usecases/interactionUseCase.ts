import { InteractionRepository } from "../../domain/repositories/interactionRepository";
import { Interaction } from "../../domain/types/interaction";
import { v4 as uuidv4 } from "uuid";

export class InteractionUseCase {
    constructor(private repository: InteractionRepository) { }

    async saveInteraction(subdomain: string, payload: Interaction): Promise<void> {
        const { associations, customFields } = payload;

        if (!associations?.id && !associations?.email) {
            throw new Error("You must provide at least id or email for association");
        }

        const finalInteractionId = associations?.id || uuidv4();


        const interaction: Interaction = {
            customFields: customFields || {},
            associations,
            id: finalInteractionId,
        };

        await this.repository.saveInteraction(subdomain, interaction);
    }

    async getInteractions(subdomain: string): Promise<Interaction[]> {
        return await this.repository.getInteractions(subdomain);
    }
}
