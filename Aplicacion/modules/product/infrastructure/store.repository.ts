import { prisma } from "@/lib/prisma";
import { Store } from "../domain/Store";

export class StoreRepository {
    // Metodo para crear tienda
    async create(name: string): Promise<Store> {
        const data = await prisma.store.create({
            data: {
                id: crypto.randomUUID(),
                name
            }
        });

        return new Store(data.id, data.name);
    }

    //Metodo para buscar tienda por id
    async findById(id: string): Promise<Store | null> {
        const data = await prisma.store.findUnique({
            where: { id }
        });

        if (!data) return null;

        return new Store(data.id, data.name);
    }

    //Metodo para buscar todas las tienda
    async findAll(): Promise<Store[]> {
        const data = await prisma.store.findMany();

        return data.map((s: { id: string; name: string; }) => new Store(s.id, s.name));
    }
}