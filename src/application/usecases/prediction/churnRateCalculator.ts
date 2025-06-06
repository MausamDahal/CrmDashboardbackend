// calculateChurnRate.ts
import { ChurnRate } from "../../../domain/types/churnRate";
import { Prediction } from "../../../domain/types/prediction";

export function calculateChurnRate(predictions: Prediction[], period: "daily" | "monthly" | "yearly" | "quarterly" = "monthly"): ChurnRate[] {
    const grouped = new Map<string, { churned: number; total: number }>();

    for (const pred of predictions) {
        const date = new Date(pred.latest_prediction_at);
        const key = getGroupingKey(date, period);

        if (!grouped.has(key)) grouped.set(key, { churned: 0, total: 0 });
        const entry = grouped.get(key)!;
        entry.total++;
        if (pred.churn_prediction === "Yes") entry.churned++;
    }

    return Array.from(grouped.entries()).map(([period, { churned, total }]) => ({
        period,
        churn_rate: parseFloat(((churned / total) * 100).toFixed(2))
    })).sort((a, b) => a.period.localeCompare(b.period));
}

function getGroupingKey(date: Date, period: string): string {
    switch (period) {
        case "daily":
            return date.toISOString().split("T")[0];
        case "yearly":
            return `${date.getUTCFullYear()}`;
        case "quarterly":
            return `${date.getUTCFullYear()}-Q${Math.floor(date.getUTCMonth() / 3) + 1}`;
        default:
            return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    }
}
