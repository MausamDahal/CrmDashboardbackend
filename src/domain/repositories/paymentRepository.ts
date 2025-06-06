import { Payment } from "../types/payment";

export interface PaymentRepository {
    savePayment(subdomain: string, payment: Payment): Promise<void>;
    getPayments(subdomain: string): Promise<Payment[]>;
}
