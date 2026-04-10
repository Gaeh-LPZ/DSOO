
export class Stock {
    constructor(
        public id: string,
        public productId: string,
        public storeId: string,
        public quantity: number,
        public minQuantity: number = 0,

    ) {
        if (quantity < 0) throw new Error('Cantidad Inavalida');
        if (minQuantity < 0) throw new Error('Mínimo inválido');
    }

    // Trar la cantidad
    getQuantity() {
        return this.quantity
    }

    // Traer storeId
    getStoreId(){
        return this.storeId
    }

    // Traer productId
    getProductId(){
        return this.productId
    }


    // Traer la cantidad minima
    getMinQuantity() {
        return this.minQuantity;
    }

    // Incrementa cantidad del prodcuto
    increase(cantidad: number) {
        if (cantidad <= 0) throw new Error("Cantidad inválida");
        this.quantity += cantidad;
    }

    // Decrementa cantidad del prodcuto con validez
    decrease(cantidad: number) {
        if (cantidad <= 0) throw new Error("Cantidad inválida");
        if (this.quantity < cantidad) throw new Error('No puede haber cantidad negativa');

        this.quantity -= cantidad;
    }

    // Alerta si es el hay menor cantidad del minimo puesto
    isBelowMinimum(): boolean {
        return this.quantity <= this.minQuantity;
    }
}


