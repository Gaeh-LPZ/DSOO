export interface ICustomer {
    id: string;
    name: string;
    email: string | null,
    password: string;
    phone: string | null ,
    birthDate: Date | null,
    rfc: string | null
}

export interface ILoyaltyAccount {
    id: string;
    customerId: string;
    points: number;
    cardNumber: string;
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