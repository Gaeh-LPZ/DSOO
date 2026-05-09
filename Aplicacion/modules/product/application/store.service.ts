import { Store } from "../domain/Store";
import { StoreRepository } from "../infrastructure/store.repository";

export class StoreService {
    constructor(private repo: StoreRepository) { }

    // Caso de uso: Crear Tienda
    async createStore(name: string): Promise<Store> {
        if (!name) throw new Error("Nombre requerido");             // Espera nombre sino marca error

        return this.repo.create(name);
    }

    // Caso de uso: Listar Tiendas
    async listStores(): Promise<Store[]> {
        return this.repo.findAll();                                 // Manda a buscar todas
    }

    // Caso de uso: ObtenerTienda
    async getStore(id: string): Promise<Store> {
        const store = await this.repo.findById(id);                 // Manda a buscar por Id
        if (!store) throw new Error("Tienda no encontrada");        // Sino hay marca error

        return store;
    }

    async getStoreReport(startDate: Date, endDate: Date) {
        const stores = await this.repo.getStoreReport(startDate, endDate)

        return stores.map(store => {
            const ventas = store.sales

            // Ingresos totales
            const totalIngresos = ventas.reduce((sum, s) => sum + s.total, 0)

            // Ticket promedio
            const ticketPromedio = ventas.length > 0
                ? totalIngresos / ventas.length
                : 0

            // Desglose por método de pago
            const pagos = ventas.flatMap(s => s.payments)
            const ingresoEfectivo = pagos
                .filter(p => p.method === "CASH")
                .reduce((sum, p) => sum + p.amount, 0)
            const ingresoTarjeta = pagos
                .filter(p => p.method === "CARD")
                .reduce((sum, p) => sum + p.amount, 0)
            const ingresoCredito = pagos
                .filter(p => p.method === "CREDIT")
                .reduce((sum, p) => sum + p.amount, 0)

            // Devoluciones
            const totalDevoluciones = ventas.reduce(
                (sum, s) => sum + s.returns.length, 0
            )

            // Top producto — el más vendido por cantidad
            const conteoProductos: Record<string, { nombre: string; cantidad: number }> = {}
            ventas.flatMap(s => s.items).forEach(item => {
                if (!conteoProductos[item.productId]) {
                    conteoProductos[item.productId] = {
                        nombre: item.product.name,
                        cantidad: 0
                    }
                }
                conteoProductos[item.productId].cantidad += item.quantity
            })

            const topProducto = Object.values(conteoProductos)
                .sort((a, b) => b.cantidad - a.cantidad)[0] ?? null

            // Ventas por día para la gráfica
            const ventasPorDia: Record<string, number> = {}
            ventas.forEach(s => {
                const dia = s.createdAt.toISOString().split("T")[0] // "2024-01-15"
                ventasPorDia[dia] = (ventasPorDia[dia] ?? 0) + s.total
            })

            return {
                storeId: store.id,
                storeName: store.name,
                totalIngresos,
                totalVentas: ventas.length,
                ticketPromedio,
                ingresoEfectivo,
                ingresoTarjeta,
                ingresoCredito,
                totalDevoluciones,
                topProducto,
                ventasPorDia: Object.entries(ventasPorDia)
                    .map(([fecha, ingresos]) => ({ fecha, ingresos }))
                    .sort((a, b) => a.fecha.localeCompare(b.fecha))
            }
        })
    }
}