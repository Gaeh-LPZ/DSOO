import { prisma } from "@/lib/prisma";
import { Product } from "../domain/Product";

interface IProduct {
    id: string;
    name: string;
    sku: string
    price: number
    cost: number
    isActive: boolean
    imageUrl: string | null
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
            data.isActive,
            data.imageUrl
        );
    }

    // Metodo busca por ID
    async findById(id: string): Promise<IProduct | null> {
        const data = await prisma.product.findUnique({
            where: { id }
        });

        if (!data) return null;

        return {
            id: data.id,
            name: data.name,
            sku: data.sku,
            price: data.price,
            cost: data.cost,
            isActive: data.isActive,
            imageUrl: data.imageUrl,
        };
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
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl
            }
        });
        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive,
            data.imageUrl
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
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl
            }
        });

        return new Product(
            data.id,
            data.name,
            data.sku,
            data.price,
            data.cost,
            data.isActive,
            data.imageUrl
        );
    }

    // Metodo pa buscar productos (con y sin limite)
    async findAll(limit?: number): Promise<Product[]> {
        const data = await prisma.product.findMany({
            ...(limit ? { take: limit } : {})
        });


        return data.map((p: IProduct) => new Product(
            p.id,
            p.name,
            p.sku,
            p.price,
            p.cost,
            p.isActive,
            p.imageUrl
        ));
    }
}