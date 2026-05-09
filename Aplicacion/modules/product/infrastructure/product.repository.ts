import { prisma } from "@/lib/prisma";
import { Product } from "../domain/Product";

export class ProductRepository {

    private toEntity(data: {
        id: string;
        name: string;
        sku: string;
        category: string;
        price: number;
        cost: number;
        isActive: boolean;
        imageUrl: string | null;
    }): Product {
        return new Product(
            data.id,
            data.name,
            data.sku,
            data.category,
            data.price,
            data.cost,
            data.isActive,
            data.imageUrl
        );
    }

    async findBySKU(sku: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({ where: { sku } });
        if (!data) return null;
        return this.toEntity(data);
    }

    async findById(id: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({ where: { id } });
        if (!data) return null;
        return this.toEntity(data); 
    }

    async create(product: Product): Promise<Product> {
        const data = await prisma.product.create({
            data: {
                id: product.id,
                name: product.getName(),
                sku: product.getSku(),
                category: product.category,  
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl
            }
        });
        return this.toEntity(data);
    }

    async update(product: Product): Promise<Product> {
        const data = await prisma.product.update({
            where: { id: product.id },
            data: {
                name: product.getName(),
                category: product.category,  
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl
            }
        });
        return this.toEntity(data);
    }

    async findAll(limit?: number): Promise<Product[]> {
        const data = await prisma.product.findMany({
            where: { isActive: true },
            ...(limit ? { take: limit } : {})
        });
        return data.map(p => this.toEntity(p)); 
    }
}