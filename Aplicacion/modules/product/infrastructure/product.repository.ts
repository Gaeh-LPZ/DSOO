import { prisma } from "@/lib/prisma";
import { Product } from "../domain/Product";

interface Iproduct {
    id: string;
    name: string;
    sku: string
    price: number
    cost: number
    isActive: boolean
}

export class ProductRepository {
    // Metodo pa buscar por SKU (Identificador unico)
    async findBySKU(sku: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({
            where: { sku }
        });
        if (!data) return null;
        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive
        );
    }

    // Metodo busca por ID
    async findById(id: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({
            where: { id }
        });

        if (!data) return null;

        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive
        );
    }

    // Metodo para crear Producto
    async create(product: Product): Promise<Product> {
        const data = await prisma.product.create({
            data: {
                id: product.id,
                name: product.getName(),                    // Llamada a los metodos de la clase padre (Productos)
                sku: product.getSku(),                  
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive()
            }
        });
        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive
        );
    }

    // Metodo para actualizarlo
    async update(product: Product): Promise<Product> {
        const data = await prisma.product.update({
            where: { id: product.id },
            data: {
                name: product.getName(),                   // Llamada a los metodos de la clase padre (Productos)
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive()
            }
        });

        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive
        );
    }

    // Metodo pa buscar productos (con y sin limite)
    async findAll(limit?: number): Promise<Product[]> {
        const data = await prisma.product.findMany({
            ...(limit ? { take: limit } : {})
        });


        return data.map((p: Iproduct) => new Product(
            p.id,
            p.name,
            p.sku,
            p.price,
            p.cost,
            p.isActive
        ));
    }
}