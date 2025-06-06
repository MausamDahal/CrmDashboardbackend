import { SubscriptionRepository } from "../../domain/repositories/subscriptionRepository";
import { Subscription } from "../../domain/types/subscription";
import crypto from "crypto";

export class SubscriptionUseCase {
    constructor(private repo: SubscriptionRepository) { }

    async isSubscriptionValid(subdomain: string, tenantId: string): Promise<{
        subscribed: boolean;
        subscription_tier: string;
        subscription_end: string | null;
    }> {
        const subs = await this.repo.getByTenantId(subdomain, tenantId);
        const sub = subs?.[0];

        const subscribed = !!(sub &&
            (sub.Status === "active" || sub.Status === "trialing") &&
            (!sub.CancelAtPeriodEnd || new Date(sub.CanceledAt || "") > new Date())
        );

        return {
            subscribed,
            subscription_tier: sub?.PlanID || "none",
            subscription_end: sub?.CurrentPeriodEnd || null
        };
    }

    async upsertSubscription(subdomain: string, tenantId: string, payload: Partial<Subscription>) {
        const now = new Date().toISOString();
        const existing = await this.repo.getByTenantId(subdomain, tenantId);
        if (existing.length > 0) {
            await this.repo.updateStatus(subdomain, payload.StripeSubscriptionID!, payload.Status!);
        } else {
            const sub: Subscription = {
                ID: crypto.randomUUID(),
                TenantID: tenantId,
                CreatedAt: now,
                UpdatedAt: now,
                CancelAtPeriodEnd: false,
                CanceledAt: null,
                ...payload,
            } as Subscription;
            await this.repo.save(subdomain, sub);
        }
    }

    async cancelSubscription(subdomain: string, tenantId: string) {
        const subs = await this.repo.getByTenantId(subdomain, tenantId);
        const current = subs?.[0];
        if (!current) throw new Error("Subscription not found");

        await this.repo.updateStatus(subdomain, current.ID, "canceled");
    }
}