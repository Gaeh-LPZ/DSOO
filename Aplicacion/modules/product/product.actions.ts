"use server"
import { requireRole } from "@/share/auth"
import { ProductService } from "./application/product.service"
import { ProductRepository } from "./infrastructure/product.repository"
import { createProductSchema, updateProductSchema, deactivateProductSchema, listProductsSchema, getProductByIdSchema } from "./product.schema"

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
    const products = await productService.listProducts(parsed.cantidad)
    
    return products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        cost: p.cost,
        isActive: p.isActive,
        imageUrl: p.imageUrl
    }))
}

export async function getProductByIdAction(data: any) {
    const parsed = getProductByIdSchema.parse(data)
    return await productService.getProductById(parsed.id);
}