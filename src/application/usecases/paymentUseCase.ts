import { PaymentRepository } from "../../domain/repositories/paymentRepository";
import { Payment } from "../../domain/types/payment";
import { v4 as uuidv4 } from "uuid";

export class PaymentUseCase {
    constructor(private repository: PaymentRepository) {}

    async savePayment(subdomain: string, payload: Payment): Promise<void> {
        const { associations, customFields } = payload;

        const hasValidAssociation = associations?.id || associations?.email;
        if (!hasValidAssociation) {
            throw new Error("At least 'id' or 'email' must be provided in associations");
        }

        const generatedId = associations?.id ?? uuidv4();

        const paymentData: Payment = {
            id: generatedId,
            associations,
            customFields: customFields ?? {},
        };

        await this.repository.savePayment(subdomain, paymentData);
    }

    async getPayments(subdomain: string): Promise<Payment[]> {
        const payments = await this.repository.getPayments(subdomain);
        return payments ?? [];
    }
}
