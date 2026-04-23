export class Invoice {
    constructor(
        public id: string,
        public saleId: string,
        public xml: string,
        public pdf: string,
    ) { }
}