import { Product } from "../domain/Product";
import { ProductRepository } from "../infrastructure/product.repository";

export class ProductService {
    constructor(private repo: ProductRepository) { }

    // Caso de Uso: Crear Producto
    async createProduct(data: {name: string;sku: string;categories?: string[];   price: number;cost: number;imageUrl?: string;}): Promise<Product> {
        const existing = await this.repo.findBySKU(data.sku);
        if (existing) throw new Error("El SKU ya existe");

        const product = new Product(
            crypto.randomUUID(),
            data.name,
            data.sku,
            data.categories ?? [],     
            data.price,
            data.cost,
            true,
            data.imageUrl ?? null
        );

        return this.repo.create(product);
    }

    // Caso de uso: Actualizar Producto
    async updateProduct(id: string, data: { name?: string; categories?: string[]; price?: number; cost?: number; imageUrl?: string;}): Promise<Product> {
        const product = await this.repo.findById(id);
        if (!product) throw new Error("Producto no encontrado");

        if (data.name !== undefined) product.changeName(data.name);
        if (data.price !== undefined) product.changePrice(data.price);  // valida en dominio
        if (data.cost !== undefined) product.changeCost(data.cost);     // valida en dominio
        if (data.imageUrl !== undefined) product.imageUrl = data.imageUrl;
        if (data.categories !== undefined) product.categories = data.categories;

        return this.repo.update(product);
    }

    // Caso de uso: Desactivar Producto
    async deactivateProduct(id: string): Promise<Product> {
        const product = await this.repo.findById(id);
        if (!product) throw new Error("Producto no encontrado");

        product.desactive();   // lanza error si ya está inactivo (validación en dominio)

        return this.repo.update(product);
    }

    // Caso de uso: Lista de Productos
    async listProducts(cantidad?: number, categoria?: string): Promise<Product[]> {
        return this.repo.findAll(cantidad, categoria);
    }

    // Caso de uso: Obtener Producto por ID
    async getProductById(id: string): Promise<Product> {
        const product = await this.repo.findById(id);
        if (!product) throw new Error("Producto no encontrado");
        return product;
    }
}