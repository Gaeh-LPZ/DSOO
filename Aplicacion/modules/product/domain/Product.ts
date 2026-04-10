
export class Product {
    constructor(
        public id: string,
        public name: string,
        public sku: string,
        public price: number,
        public cost: number,
        public isActive: Boolean = true,
    ){
        if (price <= 0) throw new Error("Precio inválido");
        if (cost <=0) throw new Error("Costo inválido");
        if (!sku) throw new Error("SKU requerido");
    }

    // Desactivar Producto
    desactive(){
        if(!this.isActive){
            throw new Error('Producto ya inactivo')
        }
        this.isActive = false;
    }

    // Cambio de precio con validacion (Caso Uso) 
    changePrice(newPrice: number) {
        if (newPrice <= 0) throw new Error("Precio inválido");
        this.price = newPrice;
    }

    // Cambio de nombre
    changeName (newName: string){
        this.name = newName;
    }

    // Cambio de Costo
    changeCost (newCost: number){
        if (newCost <= 0) throw new Error('Costo invalido');
        this.cost = newCost;
    }

    // Traer nombre
    getName() {
        return this.name;
    }

    // Traer SKU
    getSku() {
        return this.sku;
    }

    // Traer Price
    getPrice() {
        return this.price;
    }

    // Traer Costo
    getCost() {
        return this.cost;
    }

    // Traer Booleano si esta activado
    getIsActive() {
        return this.isActive;
    }
}