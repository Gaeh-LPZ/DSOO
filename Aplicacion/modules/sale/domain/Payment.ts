export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  CREDIT = "CREDIT"
}

export class Payment{
    constructor(
        public id: string,
        public saleId: string,
        public amount: number,
        public method: PaymentMethod,
    ){}
}