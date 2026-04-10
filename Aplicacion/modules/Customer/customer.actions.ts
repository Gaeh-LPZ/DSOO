import { registerCustomerSchema, addPointsSchema } from "./customer.schema";
import { CustomerService } from "./application/customer.service";
import { CustomerRepository } from "./infrastructure/customer.repository";

const customerRepo = new CustomerRepository();
const customerService = new CustomerService(customerRepo);

export async function registerCustomerAction(data: any) {
    const parsed = registerCustomerSchema.parse(data);
    return customerService.register(parsed);
}

export async function addPointsAction(data: any) {
    const parsed = addPointsSchema.parse(data);
    return customerService.addPointsFromSale(parsed.customerId, parsed.totalAmount);
}