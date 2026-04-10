import { Product } from "../domain/Product";
import { ProductRepository } from "../infrastructure/product.repository";

export class ProductService {
    constructor(private repo: ProductRepository) {}

    // Caso de Uso: Crear Producto
    async createProduct(data: {name: string; sku: string; price: number; cost: number; }): Promise<Product> {

        const existing = await this.repo.findBySKU(data.sku);               // Busca por SKU (unico)
        if (existing) throw new Error("El SKU ya existe");

        const product = new Product(                                        // Si ve que no hay producto co ese SKU
            crypto.randomUUID(),                                            // crea un nuevo producto
            data.name,
            data.sku,
            data.price,
            data.cost
        );

        return this.repo.create(product);
    }

    // Caso de uso: Actualizar Producto
    async updateProduct( id: string, data: { name?: string; price?: number; cost?: number; }): Promise<Product> {

        const product = await this.repo.findById(id);                       // Busca producto por ID
        if (!product) throw new Error("Producto no encontrado");            // No encuentra sale alerta

        if (data.name !== undefined) product.changeName(data.name);         // Condicion de que si cambia nombre trae el cambio
        if (data.price !== undefined) product.changePrice(data.price);      // Condicion que si cambia Precio trae el cambio VALIDADO
        if (data.cost !== undefined) product.changeCost(data.cost);         // Condicion que si cambia costo trae el cambio VALIDADO

        return this.repo.update(product);
    }

    async deactivateProduct(id: string): Promise<Product> {
        const product = await this.repo.findById(id);                       // Trae el producto por ID
        if (!product) throw new Error("Producto no encontrado");

        product.desactive();    

        return this.repo.update(product);                                   // Actualiza el isActive con false
    }

    // Caso de uso: Lista de Prodcutos (Implicito)
    async listProducts(cantidad: number): Promise<Product[]> {              // Trae lista de producto depende de cantidad
        return this.repo.findAll(cantidad);
    }
}