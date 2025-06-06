import { CustomerRepository } from "../../domain/repositories/customerRepository";
import { Customer } from "../../domain/types/customer";
import { v4 as uuidv4 } from "uuid";

export class CustomerUseCase {
    constructor(private repository: CustomerRepository) { }

    async saveCustomer(subdomain: string, payload: Customer): Promise<void> {
        const { associations, customFields } = payload;

        if (!associations?.id && !associations?.email) {
            throw new Error("You must provide at least id or email for association");
        }

        if (!customFields || Object.keys(customFields).length === 0) {
            throw new Error("customFields cannot be empty");
        }

        const finalCustomerId = associations.id || uuidv4();

        const customer: Customer & { id: string } = {
            customFields,
            associations: {
                id: associations.id ?? finalCustomerId,
                email: associations.email ?? null,
            },
            id: finalCustomerId
        };

        await this.repository.saveCustomer(subdomain, customer);
    }

    async getCustomers(subdomain: string): Promise<Customer[]> {
        return await this.repository.getCustomers(subdomain);
    }

    async getCustomerByIdOrEmail(subdomain: string, id?: string, email?: string): Promise<Customer | null> {
        if (!id && !email) throw new Error("You must provide either id or email");

        if (id) return await this.repository.findById(subdomain, id);
        return await this.repository.findByEmail(subdomain, email!);
    }

}
