export interface ICustomer {
    id: string;
    name: string;
    email: string | null;
}

export interface ILoyaltyAccount {
    id: string;
    customerId: string;
    points: number;
}

export interface ICustomerWithLoyalty extends ICustomer {
    loyalty: ILoyaltyAccount | null;
}

export interface ICreditAccount {
    id: string;
    customerId: string;
    balance: number;
    interest: number;
    dueDate: Date;
}