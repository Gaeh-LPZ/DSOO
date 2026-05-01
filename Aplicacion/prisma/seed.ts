import { PrismaClient, SaleStatus, PaymentMethod, PurchaseStatus, ShipmentStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Permissions 
  const permissions = await Promise.all([
    prisma.permission.upsert({ where: { name: 'sales:read'     }, update: {}, create: { name: 'sales:read'     } }),
    prisma.permission.upsert({ where: { name: 'sales:write'    }, update: {}, create: { name: 'sales:write'    } }),
    prisma.permission.upsert({ where: { name: 'inventory:read' }, update: {}, create: { name: 'inventory:read' } }),
    prisma.permission.upsert({ where: { name: 'inventory:write'}, update: {}, create: { name: 'inventory:write'} }),
    prisma.permission.upsert({ where: { name: 'reports:read'   }, update: {}, create: { name: 'reports:read'   } }),
    prisma.permission.upsert({ where: { name: 'admin:all'      }, update: {}, create: { name: 'admin:all'      } }),
  ])
  console.log('ermissions creados')

  // Roles 
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Acceso total al sistema',
      permissions: {
        create: permissions.map(p => ({ permissionId: p.id }))
      }
    }
  })

  const cashierRole = await prisma.role.upsert({
    where: { name: 'CAJERO' },
    update: {},
    create: {
      name: 'CAJERO',
      description: 'Puede registrar ventas',
      permissions: {
        create: [
          { permissionId: permissions[0].id }, 
          { permissionId: permissions[1].id }, 
          { permissionId: permissions[2].id }, 
        ]
      }
    }
  })
  console.log('Roles creados')

  // Users 
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@luxury.com' },
    update: {},
    create: {
      name: 'Admin Principal',
      email: 'admin@luxury.com',
      password: hashedPassword,
      roles: { create: [{ roleId: adminRole.id }] }
    }
  })

  const cashierUser = await prisma.user.upsert({
    where: { email: 'cajero@luxury.com' },
    update: {},
    create: {
      name: 'Juan Cajero',
      email: 'cajero@luxury.com',
      password: hashedPassword,
      roles: { create: [{ roleId: cashierRole.id }] }
    }
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

  // Products 
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' },
      update: {},
      create: { name: 'Laptop HP 15"', sku: 'PROD-001', price: 12999.00, cost: 9500.00 }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' },
      update: {},
      create: { name: 'Mouse Inalámbrico', sku: 'PROD-002', price: 349.00, cost: 180.00 }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' },
      update: {},
      create: { name: 'Teclado Mecánico', sku: 'PROD-003', price: 899.00, cost: 500.00 }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-004' },
      update: {},
      create: { name: 'Monitor 24"', sku: 'PROD-004', price: 4500.00, cost: 3000.00 }
    }),
  ])
  console.log('Productos creados')

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
      { productId: products[0].id, storeId: storeCentral.id, quantity: 50, type: 'IN',  reason: 'Carga inicial' },
      { productId: products[1].id, storeId: storeCentral.id, quantity: 50, type: 'IN',  reason: 'Carga inicial' },
      { productId: products[0].id, storeId: storeCentral.id, quantity: 2,  type: 'OUT', reason: 'Venta #1' },
    ],
    skipDuplicates: true,
  })
  console.log('Movimientos de stock creados')

  // Customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'customer-1' },
    update: {},
    create: {
      id: 'customer-1',
      name: 'María López',
      email: 'maria@gmail.com',
      loyalty: { create: { points: 150 } },
      credit:  { create: { balance: 5000.00, interest: 0.12, dueDate: new Date('2025-12-31') } }
    }
  })

  const customer2 = await prisma.customer.upsert({
    where: { id: 'customer-2' },
    update: {},
    create: {
      id: 'customer-2',
      name: 'Carlos Ruiz',
      email: 'carlos@gmail.com',
      loyalty: { create: { points: 50 } }
    }
  })
  console.log('Clientes creados')

  // Sales
  const sale1 = await prisma.sale.create({
    data: {
      userId:     adminUser.id,
      storeId:    storeCentral.id,
      customerId: customer1.id,
      total:      13348.00,
      status:     SaleStatus.PAID,
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 12999.00 },
          { productId: products[1].id, quantity: 1, price:   349.00 },
        ]
      },
      payments: {
        create: [{ amount: 13348.00, method: PaymentMethod.CARD }]
      },
      shipment: {
        create: { status: ShipmentStatus.DELIVERED, tracking: 'TRK-00123' }
      },
      invoice: {
        create: { xml: '<xml>factura1</xml>', pdf: 'facturas/fact-001.pdf' }
      }
    }
  })

  const sale2 = await prisma.sale.create({
    data: {
      userId:  cashierUser.id,
      storeId: storeCentral.id,
      total:   899.00,
      status:  SaleStatus.PENDING,
      items: {
        create: [{ productId: products[2].id, quantity: 1, price: 899.00 }]
      },
      payments: {
        create: [{ amount: 899.00, method: PaymentMethod.CASH }]
      }
    }
  })
  console.log('Ventas creadas')

  // Return
  await prisma.return.create({
    data: {
      saleId:     sale1.id,
      approvedBy: adminUser.id,
      reason:     'Producto defectuoso'
    }
  })
  console.log('Devolución creada')

  // Supplier + PurchaseOrder 
  const supplier = await prisma.supplier.upsert({
    where: { id: 'supplier-1' },
    update: {},
    create: { id: 'supplier-1', name: 'Distribuidora Tech SA' }
  })

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier.id,
      storeId:    storeCentral.id,
      status:     PurchaseStatus.RECEIVED,
      items: {
        create: [
          { productId: products[0].id, quantity: 10, cost: 9500.00 },
          { productId: products[1].id, quantity: 30, cost:  180.00 },
        ]
      }
    }
  })
  console.log('Proveedor y orden de compra creados')

  console.log('Seed completado exitosamente')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())