export class StockNotification {
    constructor(
        public id: string,
        public userId: string,
        public storeId: string,
        public productId: string,
        public message: string
    ){}
}