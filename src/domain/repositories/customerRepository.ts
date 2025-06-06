import { Customer } from "../types/customer";

export interface CustomerRepository {
    saveCustomer(subdomain: string, customer: Customer): Promise<void>;
    getCustomers(subdomain: string): Promise<Customer[]>;
    findById(subdomain: string, id: string): Promise<Customer | null>;
    findByEmail(subdomain: string, email: string): Promise<Customer | null>;
}