import { Subscription } from "../types/subscription";

export interface SubscriptionRepository {
    save(subdomain: string, subscription: Subscription): Promise<void>;
    updateStatus(subdomain: string, id: string, status: string): Promise<void>;
    getByTenantId(subdomain: string, tenantId: string): Promise<Subscription[]>;
    getByStripeId(subdomain: string, stripeSubscriptionId: string): Promise<Subscription | null>;
}
