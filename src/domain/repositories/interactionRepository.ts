import { Interaction } from "../types/interaction";

export interface InteractionRepository {
    saveInteraction(subdomain: string, interaction: Interaction): Promise<void>;
    getInteractions(subdomain: string): Promise<Interaction[]>;
}
