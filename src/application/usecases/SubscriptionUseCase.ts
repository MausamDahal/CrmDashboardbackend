import { SubscriptionRepository } from "../../domain/repositories/subscriptionRepository";
import { Subscription } from "../../domain/types/subscription";
import crypto from "crypto";

export class SubscriptionUseCase {
    constructor(private repo: SubscriptionRepository) {}

    async isSubscriptionValid(subdomain: string, tenantId: string): Promise<{
        subscribed: boolean;
        subscription_tier: string;
        subscription_end: string | null;
    }> {
        const subscriptions = await this.repo.getByTenantId(subdomain, tenantId);
        const activeSub = subscriptions?.[0];

        const isSubscribed = !!(
            activeSub &&
            (activeSub.Status === "active" || activeSub.Status === "trialing") &&
            (!activeSub.CancelAtPeriodEnd || new Date(activeSub.CanceledAt ?? "") > new Date())
        );

        return {
            subscribed: isSubscribed,
            subscription_tier: activeSub?.PlanID ?? "none",
            subscription_end: activeSub?.CurrentPeriodEnd ?? null,
        };
    }

    async upsertSubscription(subdomain: string, tenantId: string, payload: Partial<Subscription>): Promise<void> {
        const now = new Date().toISOString();
        const existing = await this.repo.getByTenantId(subdomain, tenantId);

        if (existing.length > 0) {
            const stripeSubId = payload.StripeSubscriptionID;
            const newStatus = payload.Status;
            if (!stripeSubId || !newStatus) {
                throw new Error("Missing StripeSubscriptionID or Status for update");
            }
            await this.repo.updateStatus(subdomain, stripeSubId, newStatus);
        } else {
            const newSubscription: Subscription = {
                ID: crypto.randomUUID(),
                TenantID: tenantId,
                CreatedAt: now,
                UpdatedAt: now,
                CancelAtPeriodEnd: false,
                CanceledAt: null,
                ...payload,
            } as Subscription;

            await this.repo.save(subdomain, newSubscription);
        }
    }

    async cancelSubscription(subdomain: string, tenantId: string): Promise<void> {
        const subscriptions = await this.repo.getByTenantId(subdomain, tenantId);
        const currentSub = subscriptions?.[0];

        if (!currentSub) {
            throw new Error("No active subscription found to cancel");
        }

        await this.repo.updateStatus(subdomain, currentSub.ID, "canceled");
    }
    async updateSubscription(subdomain: string, tenantId: string, updateFields: Partial<Subscription>): Promise<void> {
        const subscriptions = await this.repo.getByTenantId(subdomain, tenantId);
        const currentSub = subscriptions?.[0];
        if (!currentSub) throw new Error("No active subscription found to update");

        if (!updateFields.Status) {
            throw new Error("Status is required to update the subscription");
        }

        await this.repo.updateStatus(subdomain, currentSub.ID, updateFields.Status);
    }
}
