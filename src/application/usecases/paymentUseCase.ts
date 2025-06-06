import { PaymentRepository } from "../../domain/repositories/paymentRepository";
import { Payment } from "../../domain/types/payment";
import { v4 as uuidv4 } from "uuid";

export class PaymentUseCase {
    constructor(private repository: PaymentRepository) { }

    async savePayment(subdomain: string, payload: Payment): Promise<void> {
        const { associations, customFields } = payload;

        if (!associations?.id && !associations?.email) {
            throw new Error("You must provide at least id or email for association");
        }

        const finalPaymentId = associations?.id || uuidv4();

        const payment: Payment = {
            customFields: customFields || {},
            associations,
            id: finalPaymentId
        };

        await this.repository.savePayment(subdomain, payment);
    }

    async getPayments(subdomain: string): Promise<Payment[]> {
        return await this.repository.getPayments(subdomain);
    }
}
