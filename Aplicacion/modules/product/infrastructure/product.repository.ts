import { prisma } from "@/lib/prisma";
import { Product } from "../domain/Product";

export class ProductRepository {

    private toEntity(data: {
        id: string;
        name: string;
        sku: string;
        price: number;
        cost: number;
        isActive: boolean;
        imageUrl: string | null;
        categories: { category: { name: string } }[];
    }): Product {
        return new Product(
            data.id,
            data.name,
            data.sku,
            data.categories.map(pc => pc.category.name),
            data.price,
            data.cost,
            data.isActive,
            data.imageUrl
        );
    }

    private includeCategories = {
        categories: { include: { category: true } }
    }

    async findBySKU(sku: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({
            where: { sku },
            include: this.includeCategories
        });
        if (!data) return null;
        return this.toEntity(data);
    }

    async findById(id: string): Promise<Product | null> {
        const data = await prisma.product.findUnique({
            where: { id },
            include: this.includeCategories
        });
        if (!data) return null;
        return this.toEntity(data);
    }

    async create(product: Product): Promise<Product> {
        const data = await prisma.product.create({
            data: {
                id: product.id,
                name: product.getName(),
                sku: product.getSku(),
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl,
                categories: {
                    create: product.categories.map(name => ({   // conecta cada categoría por nombre
                        category: { connect: { name } }
                    }))
                }
            },
            include: this.includeCategories
        });
        return this.toEntity(data);
    }

    async update(product: Product): Promise<Product> {
        const data = await prisma.product.update({
            where: { id: product.id },
            data: {
                name: product.getName(),
                price: product.getPrice(),
                cost: product.getCost(),
                isActive: product.getIsActive(),
                imageUrl: product.imageUrl,
                categories: {
                    deleteMany: {},                              // borra todas las relaciones actuales
                    create: product.categories.map(name => ({   // crea las nuevas
                        category: { connect: { name } }
                    }))
                }
            },
            include: this.includeCategories
        });
        return this.toEntity(data);
    }

    async findAll(limit?: number, categoria?: string): Promise<Product[]> {
        const data = await prisma.product.findMany({
            where: {
                isActive: true,
                ...(categoria ? {
                    categories: {
                        some: { category: { name: categoria } }
                    }
                } : {})
            },
            include: this.includeCategories,
            ...(limit ? { take: limit } : {})
        });
        return data.map(p => this.toEntity(p));
    }
}