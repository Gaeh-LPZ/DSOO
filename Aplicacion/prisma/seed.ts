import 'dotenv/config'
import { PrismaClient, SaleStatus, PaymentMethod, PurchaseStatus, ShipmentStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { CloudinaryService } from '@/infrastructure/cloudinary/cloudinary.service'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()
const cloudinary = new CloudinaryService()

async function uploadProductImage(filename: string): Promise<string> {
  const imagePath = path.join(__dirname, 'seed-images', filename)
  
  // Pequeña validación por si no encuentra la imagen local
  if (!fs.existsSync(imagePath)) return 'https://via.placeholder.com/300'
  
  const buffer = fs.readFileSync(imagePath)

  try {
    const url = await Promise.race([
      cloudinary.uploadImage(buffer, 'products'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout manual')), 10000)
      )
    ])

    console.log(`${filename} subido`)
    return url as string
  } catch (error) {
    console.error(`Error subiendo ${filename}:`, error)
    return 'https://via.placeholder.com/300'
  }
}

async function main() {
  console.log('Iniciando seed completo con analítica...')

  // Permissions 
  const permissions = await Promise.all([
    prisma.permission.upsert({ where: { name: 'sales:read' }, update: {}, create: { name: 'sales:read' } }),
    prisma.permission.upsert({ where: { name: 'sales:write' }, update: {}, create: { name: 'sales:write' } }),
    prisma.permission.upsert({ where: { name: 'inventory:read' }, update: {}, create: { name: 'inventory:read' } }),
    prisma.permission.upsert({ where: { name: 'inventory:write' }, update: {}, create: { name: 'inventory:write' } }),
    prisma.permission.upsert({ where: { name: 'reports:read' }, update: {}, create: { name: 'reports:read' } }),
    prisma.permission.upsert({ where: { name: 'admin:all' }, update: {}, create: { name: 'admin:all' } }),
  ])
  console.log('Permisos creados')

  // Roles 
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Acceso total al sistema',
      permissions: { create: permissions.map(p => ({ permissionId: p.id })) }
    }
  })

  const cashierRole = await prisma.role.upsert({
    where: { name: 'CAJERO' },
    update: {},
    create: {
      name: 'CAJERO',
      description: 'Puede registrar ventas',
      permissions: { create: [ { permissionId: permissions[0].id }, { permissionId: permissions[1].id }, { permissionId: permissions[2].id } ] }
    }
  })
  console.log('Roles creados')

  // Users 
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@luxury.com' },
    update: {},
    create: { name: 'Admin Principal', email: 'admin@luxury.com', password: hashedPassword, roles: { create: [{ roleId: adminRole.id }] } }
  })

  const cashierUser = await prisma.user.upsert({
    where: { email: 'cajero@luxury.com' },
    update: {},
    create: { name: 'Juan Cajero', email: 'cajero@luxury.com', password: hashedPassword, roles: { create: [{ roleId: cashierRole.id }] } }
  })
  console.log('Usuarios creados')

  // Stores 
  const storeCentral = await prisma.store.upsert({
    where: { id: 'store-central' },
    update: {},
    create: { id: 'store-central', name: 'Sucursal Central' }
  })

  const storeNorte = await prisma.store.upsert({
    where: { id: 'store-norte' },
    update: {},
    create: { id: 'store-norte', name: 'Sucursal Norte' }
  })
  console.log('Tiendas creadas')

  // Products (AHORA CON CATEGORÍAS)
  console.log('Subiendo imágenes a Cloudinary e insertando productos...')
  const laptopUrl = await uploadProductImage('laptop.jpg')
  const mouseUrl = await uploadProductImage('mouse.jpg')
  const tecladoUrl = await uploadProductImage('teclado.jpg')
  const monitorUrl = await uploadProductImage('monitor.jpg')

  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' }, update: {},
      create: { name: 'Laptop HP 15"', sku: 'PROD-001', category: 'Electrónica', price: 12999.00, cost: 9500.00, imageUrl: laptopUrl }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' }, update: {},
      create: { name: 'Mouse Inalámbrico', sku: 'PROD-002', category: 'Electrónica', price: 349.00, cost: 180.00, imageUrl: mouseUrl }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' }, update: {},
      create: { name: 'Teclado Mecánico', sku: 'PROD-003', category: 'Electrónica', price: 899.00, cost: 500.00, imageUrl: tecladoUrl }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-004' }, update: {},
      create: { name: 'Monitor 24"', sku: 'PROD-004', category: 'Electrónica', price: 4500.00, cost: 3000.00, imageUrl: monitorUrl }
    }),
    prisma.product.upsert({ 
      where: { sku: 'PROD-005' }, update: {}, 
      create: { name: 'Reloj Suizo Automático', sku: 'PROD-005', category: 'Luxury Wear', price: 45000.00, cost: 25000.00, imageUrl: 'https://via.placeholder.com/300' } 
    }),
    prisma.product.upsert({ 
      where: { sku: 'PROD-006' }, update: {}, 
      create: { name: 'Bolso de Cuero Italiano', sku: 'PROD-006', category: 'Luxury Wear', price: 28500.00, cost: 12000.00, imageUrl: 'https://via.placeholder.com/300' } 
    }),
    prisma.product.upsert({ 
      where: { sku: 'PROD-007' }, update: {}, 
      create: { name: 'Cafetera Espresso Premium', sku: 'PROD-007', category: 'Hogar', price: 15999.00, cost: 8000.00, imageUrl: 'https://via.placeholder.com/300' } 
    }),
    prisma.product.upsert({ 
      where: { sku: 'PROD-008' }, update: {}, 
      create: { name: 'Set de Lámparas de Diseño', sku: 'PROD-008', category: 'Hogar', price: 8500.00, cost: 3500.00, imageUrl: 'https://via.placeholder.com/300' } 
    }),
  ])
  console.log('Productos creados con categorías')

  // Stock 
  for (const product of products) {
    await prisma.stock.upsert({
      where: { productId_storeId: { productId: product.id, storeId: storeCentral.id } },
      update: {},
      create: { productId: product.id, storeId: storeCentral.id, quantity: 50, minQuantity: 5 }
    })
    await prisma.stock.upsert({
      where: { productId_storeId: { productId: product.id, storeId: storeNorte.id } },
      update: {},
      create: { productId: product.id, storeId: storeNorte.id, quantity: 20, minQuantity: 3 }
    })
  }
  console.log('Stock creado')

  // Stock Movements
  await prisma.stockMovement.createMany({
    data: [
      { productId: products[0].id, storeId: storeCentral.id, quantity: 50, type: 'IN', reason: 'Carga inicial' },
      { productId: products[1].id, storeId: storeCentral.id, quantity: 50, type: 'IN', reason: 'Carga inicial' },
      { productId: products[0].id, storeId: storeCentral.id, quantity: 2, type: 'OUT', reason: 'Venta #1' },
    ],
    skipDuplicates: true,
  })
  console.log('Movimientos de stock creados')

  // Customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'customer-1' },
    update: {},
    create: {
      id: 'customer-1', name: 'María López', email: 'maria@gmail.com', password: hashedPassword,
      loyalty: { create: { points: 150, cardNumber: 'LT-' + Math.random().toString(36).substring(2, 11).toUpperCase() } },
      credit: { create: { balance: 5000.00, interest: 0.12, dueDate: new Date('2025-12-31') } }
    }
  })

  const customer2 = await prisma.customer.upsert({
    where: { id: 'customer-2' },
    update: {},
    create: {
      id: 'customer-2', name: 'Carlos Ruiz', email: 'carlos@gmail.com', password: hashedPassword,
      loyalty: { create: { points: 50, cardNumber: 'LT-' + Math.random().toString(36).substring(2, 11).toUpperCase() } }
    }
  })
  console.log('Clientes creados')

  // Sales (Originales + Nuevas Masivas)
  const sale1 = await prisma.sale.create({
    data: {
      userId: adminUser.id, storeId: storeCentral.id, customerId: customer1.id, total: 13348.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[0].id, quantity: 1, price: 12999.00 }, { productId: products[1].id, quantity: 1, price: 349.00 }] },
      payments: { create: [{ amount: 13348.00, method: PaymentMethod.CARD }] },
      shipment: { create: { status: ShipmentStatus.DELIVERED, tracking: 'TRK-00123' } },
      invoice: { create: { xml: '<xml>factura1</xml>', pdf: 'facturas/fact-001.pdf' } }
    }
  })

  const sale2 = await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, total: 899.00, status: SaleStatus.PENDING,
      items: { create: [{ productId: products[2].id, quantity: 1, price: 899.00 }] },
      payments: { create: [{ amount: 899.00, method: PaymentMethod.CASH }] }
    }
  })
  
  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer1.id, total: 73500.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[4].id, quantity: 1, price: 45000.00 }, { productId: products[5].id, quantity: 1, price: 28500.00 }] },
      payments: { create: [{ amount: 73500.00, method: PaymentMethod.CARD }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer2.id, total: 31998.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[6].id, quantity: 2, price: 15999.00 }] },
      payments: { create: [{ amount: 31998.00, method: PaymentMethod.CASH }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id,customerId: customer2.id, total: 44497.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[0].id, quantity: 3, price: 12999.00 }, { productId: products[7].id, quantity: 1, price: 5500.00 }] },
      payments: { create: [{ amount: 44497.00, method: PaymentMethod.CARD }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer2.id, total: 13500.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[3].id, quantity: 3, price: 4500.00 }] },
      payments: { create: [{ amount: 13500.00, method: PaymentMethod.CARD }] }
    }
  })
  
  console.log('Ventas creadas')

  // Return
  await prisma.return.create({
    data: { saleId: sale1.id, approvedBy: adminUser.id, reason: 'Producto defectuoso' }
  })
  console.log('Devolución creada')

  // Supplier + PurchaseOrder 
  const supplier = await prisma.supplier.upsert({
    where: { id: 'supplier-1' }, update: {}, create: { id: 'supplier-1', name: 'Distribuidora Tech SA' }
  })

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier.id, storeId: storeCentral.id, status: PurchaseStatus.RECEIVED,
      items: { create: [{ productId: products[0].id, quantity: 10, cost: 9500.00 }, { productId: products[1].id, quantity: 30, cost: 180.00 }] }
    }
  })
  console.log('Proveedor y orden de compra creados')

  console.log('Seed completado exitosamente')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())