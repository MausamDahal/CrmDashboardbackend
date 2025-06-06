import { OrderRepository } from "../../domain/repositories/orderRepository";
import { Order } from "../../domain/types/order";
import { v4 as uuidv4 } from "uuid";

export class OrderUseCase {
    constructor(private repository: OrderRepository) { }

    async save(subdomain: string, order: Order): Promise<void> {
        const { associations, customFields } = order;
        if (!associations?.id && !associations?.email) {
            throw new Error("You must provide at least id or email for association");
        }

        const finalOrderId = associations?.id || uuidv4();

        await this.repository.saveOrder(subdomain, {
            associations,
            customFields: customFields || {},
            id: finalOrderId
        });
    }

    async getAll(subdomain: string): Promise<Order[]> {
        return this.repository.getOrders(subdomain);
    }
}
