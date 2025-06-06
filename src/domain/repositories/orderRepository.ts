import { Order } from "../types/order";

export interface OrderRepository {
    saveOrder(subdomain: string, order: Order): Promise<void>;
    getOrders(subdomain: string): Promise<Order[]>;
}
