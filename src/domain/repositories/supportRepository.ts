import { Support } from "../types/support";

export interface SupportRepository {
    saveSupport(subdomain: string, support: Support): Promise<void>;
    getSupports(subdomain: string): Promise<Support[]>;
}
