"use server"
import { requireRole } from "@/share/auth"
import { ProductService } from "./application/product.service"
import { ProductRepository } from "./infrastructure/product.repository"
import { createProductSchema, updateProductSchema, deactivateProductSchema, listProductsSchema } from "./product.schema"

const productRepo = new ProductRepository()
const productService = new ProductService(productRepo)

export async function createProductAction(data: any) {
    await requireRole("GERENTE")
    const parsed = createProductSchema.parse(data)
    return productService.createProduct(parsed)
}

export async function updateProductAction(data: any) {
    await requireRole("GERENTE")
    const parsed = updateProductSchema.parse(data)
    return productService.updateProduct(parsed.id, parsed)
}

export async function deactivateProductAction(data: any) {
    await requireRole("GERENTE")
    const parsed = deactivateProductSchema.parse(data)
    return productService.deactivateProduct(parsed.id)
}

export async function listProductsAction(data: any) {
    const parsed = listProductsSchema.parse(data)
    return productService.listProducts(parsed.cantidad)
}
export async function getPublicProductsAction() {
    try {
        const productos = await productRepo.findAll()
        return {
            success: true,
            data: productos.filter(p => p.getIsActive()).map(p => ({
                id: p.id,
                name: p.getName(),
                sku: p.getSku(),
                price: p.getPrice(),
                imageUrl: p.imageUrl
            }))
        }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}