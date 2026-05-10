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
  if (!fs.existsSync(imagePath)) {
    console.warn(`No se encontró ${filename}`)
    return 'https://imgs.search.brave.com/s_6tLSl8b33W2r9t9OxuIWc28VzRLB-mqGy3wYRIi8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzcyLzA4/L2RjLzcyMDhkYzRm/YjdiN2MzMTJhZTc2/MGQ1NjA4MzllNmM2/LmpwZw'
  }

  const buffer = fs.readFileSync(imagePath)

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Subiendo ${filename} (intento ${attempt}/3)...`)
      const url = await cloudinary.uploadImage(buffer, 'products')
      console.log(`${filename} subido`)
      return url
    } catch (error: any) {
      console.error(`Intento ${attempt} fallido para ${filename}:`, error.message)
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  console.warn(`${filename} falló 3 veces, usando placeholder`)
  return 'https://imgs.search.brave.com/s_6tLSl8b33W2r9t9OxuIWc28VzRLB-mqGy3wYRIi8E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzcyLzA4/L2RjLzcyMDhkYzRm/YjdiN2MzMTJhZTc2/MGQ1NjA4MzllNmM2/LmpwZw'
}

async function main() {
  console.log('Iniciando seed...')

  const permissions = await Promise.all([
    prisma.permission.upsert({ where: { name: 'sales:read' }, update: {}, create: { name: 'sales:read' } }),
    prisma.permission.upsert({ where: { name: 'sales:write' }, update: {}, create: { name: 'sales:write' } }),
    prisma.permission.upsert({ where: { name: 'inventory:read' }, update: {}, create: { name: 'inventory:read' } }),
    prisma.permission.upsert({ where: { name: 'inventory:write' }, update: {}, create: { name: 'inventory:write' } }),
    prisma.permission.upsert({ where: { name: 'reports:read' }, update: {}, create: { name: 'reports:read' } }),
    prisma.permission.upsert({ where: { name: 'admin:all' }, update: {}, create: { name: 'admin:all' } }),
  ])
  console.log('Permisos creados')

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
      permissions: {
        create: [
          { permissionId: permissions[0].id },
          { permissionId: permissions[1].id },
          { permissionId: permissions[2].id }
        ]
      }
    }
  })
  console.log('Roles creados')

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

  const systemUser = await prisma.user.upsert({
    where: { email: 'sistema@luxury.com' },
    update: {},
    create: {
      name: 'Sistema Online',
      email: 'sistema@luxury.com',
      password: hashedPassword,
      roles: { create: [{ roleId: cashierRole.id }] }
    }
  })
  console.log('Usuarios creados')

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

  const storeOnline = await prisma.store.upsert({
    where: { id: 'store-online' },
    update: {},
    create: { id: 'store-online', name: 'Tienda Online' }
  })
  console.log('Tiendas creadas')

  // Categorías
  const catElectronica = await prisma.category.upsert({
    where: { name: 'electronica' },
    update: {},
    create: { name: 'electronica', label: 'Electrónica', from: '#1e3a5f', to: '#2563eb' }
  })

  const catLuxury = await prisma.category.upsert({
    where: { name: 'luxury' },
    update: {},
    create: { name: 'luxury', label: 'Luxury Wear', from: '#78350f', to: '#b45309' }
  })

  const catHogar = await prisma.category.upsert({
    where: { name: 'hogar' },
    update: {},
    create: { name: 'hogar', label: 'Hogar', from: '#292524', to: '#57534e' }
  })
  console.log('Categorías creadas')

  console.log('Subiendo imágenes a Cloudinary...')
  const laptopUrl   = await uploadProductImage('laptop.jpg')
  const mouseUrl    = await uploadProductImage('mouse.jpg')
  const tecladoUrl  = await uploadProductImage('teclado.jpg')
  const monitorUrl  = await uploadProductImage('monitor.jpg')
  const relojUrl    = await uploadProductImage('Reloj.jpg')
  const bolsoUrl    = await uploadProductImage('Bolso.jpg')
  const cafeteraUrl = await uploadProductImage('Cafetera.jpg')
  const lamparaUrl  = await uploadProductImage('Lampara.jpg')

  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'PROD-001' }, update: {},
      create: {
        name: 'Laptop HP 15"', sku: 'PROD-001', price: 12999.00, cost: 9500.00, imageUrl: laptopUrl,
        categories: { create: [{ categoryId: catElectronica.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-002' }, update: {},
      create: {
        name: 'Mouse Inalámbrico', sku: 'PROD-002', price: 349.00, cost: 180.00, imageUrl: mouseUrl,
        categories: { create: [{ categoryId: catElectronica.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-003' }, update: {},
      create: {
        name: 'Teclado Mecánico', sku: 'PROD-003', price: 899.00, cost: 500.00, imageUrl: tecladoUrl,
        categories: { create: [{ categoryId: catElectronica.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-004' }, update: {},
      create: {
        name: 'Monitor 24"', sku: 'PROD-004', price: 4500.00, cost: 3000.00, imageUrl: monitorUrl,
        categories: { create: [{ categoryId: catElectronica.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-005' }, update: {},
      create: {
        name: 'Reloj Suizo Automático', sku: 'PROD-005', price: 45000.00, cost: 25000.00, imageUrl: relojUrl,
        categories: { create: [{ categoryId: catLuxury.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-006' }, update: {},
      create: {
        name: 'Bolso de Cuero Italiano', sku: 'PROD-006', price: 28500.00, cost: 12000.00, imageUrl: bolsoUrl,
        categories: { create: [{ categoryId: catLuxury.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-007' }, update: {},
      create: {
        name: 'Cafetera Espresso Premium', sku: 'PROD-007', price: 15999.00, cost: 8000.00, imageUrl: cafeteraUrl,
        categories: { create: [{ categoryId: catHogar.id }] }
      }
    }),
    prisma.product.upsert({
      where: { sku: 'PROD-008' }, update: {},
      create: {
        name: 'Set de Lámparas de Diseño', sku: 'PROD-008', price: 8500.00, cost: 3500.00, imageUrl: lamparaUrl,
        categories: { create: [{ categoryId: catHogar.id }] }
      }
    }),
  ])
  console.log('Productos creados')

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

  await prisma.stockMovement.createMany({
    data: [
      { productId: products[0].id, storeId: storeCentral.id, quantity: 50, type: 'IN', reason: 'Carga inicial' },
      { productId: products[1].id, storeId: storeCentral.id, quantity: 50, type: 'IN', reason: 'Carga inicial' },
      { productId: products[0].id, storeId: storeCentral.id, quantity: 2,  type: 'OUT', reason: 'Venta #1' },
    ],
    skipDuplicates: true,
  })
  console.log('Movimientos de stock creados')

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

  const customerOnline = await prisma.customer.upsert({
    where: { id: 'customer-online' },
    update: {},
    create: {
      id: 'customer-online', name: 'Cliente Online Test', email: 'test@gmail.com',
      password: hashedPassword, phone: '+52 951 000 0000',
      loyalty: { create: { points: 0, cardNumber: 'LT-ONLINE-TEST' } }
    }
  })
  console.log('Clientes creados')

  await prisma.cart.upsert({
    where: { id: 'cart-online-test' },
    update: {},
    create: {
      id: 'cart-online-test',
      customerId: customerOnline.id,
      items: {
        create: [
          { productId: products[1].id, quantity: 2, price: products[1].price },
          { productId: products[2].id, quantity: 1, price: products[2].price },
        ]
      }
    }
  })
  console.log('Carrito de prueba creado')

  const sale1 = await prisma.sale.create({
    data: {
      userId: adminUser.id, storeId: storeCentral.id, customerId: customer1.id,
      total: 13348.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[0].id, quantity: 1, price: 12999.00 }, { productId: products[1].id, quantity: 1, price: 349.00 }] },
      payments: { create: [{ amount: 13348.00, method: PaymentMethod.CARD }] },
      shipment: { create: { status: ShipmentStatus.DELIVERED, tracking: 'TRK-00123' } },
      invoice: { create: { xml: '<xml>factura1</xml>', pdf: 'facturas/fact-001.pdf' } }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id,
      total: 899.00, status: SaleStatus.PENDING,
      items: { create: [{ productId: products[2].id, quantity: 1, price: 899.00 }] },
      payments: { create: [{ amount: 899.00, method: PaymentMethod.CASH }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer1.id,
      total: 73500.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[4].id, quantity: 1, price: 45000.00 }, { productId: products[5].id, quantity: 1, price: 28500.00 }] },
      payments: { create: [{ amount: 73500.00, method: PaymentMethod.CARD }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer2.id,
      total: 31998.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[6].id, quantity: 2, price: 15999.00 }] },
      payments: { create: [{ amount: 31998.00, method: PaymentMethod.CASH }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer2.id,
      total: 44497.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[0].id, quantity: 3, price: 12999.00 }, { productId: products[7].id, quantity: 1, price: 5500.00 }] },
      payments: { create: [{ amount: 44497.00, method: PaymentMethod.CARD }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: cashierUser.id, storeId: storeCentral.id, customerId: customer2.id,
      total: 13500.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[3].id, quantity: 3, price: 4500.00 }] },
      payments: { create: [{ amount: 13500.00, method: PaymentMethod.CARD }] }
    }
  })

  await prisma.sale.create({
    data: {
      userId: systemUser.id, storeId: storeCentral.id, customerId: customerOnline.id,
      total: 1597.00, status: SaleStatus.PAID,
      items: { create: [{ productId: products[1].id, quantity: 1, price: 349.00 }, { productId: products[2].id, quantity: 1, price: 899.00 }, { productId: products[3].id, quantity: 0, price: 349.00 }] },
      payments: { create: [{ amount: 1597.00, method: PaymentMethod.CARD, stripePaymentId: 'pi_test_seed_001' }] },
      shipment: { create: { status: ShipmentStatus.IN_TRANSIT, tracking: 'TRK-ONLINE-001' } }
    }
  })
  console.log('Ventas creadas')

  await prisma.return.create({
    data: { saleId: sale1.id, approvedBy: adminUser.id, reason: 'Producto defectuoso' }
  })
  console.log('Devolución creada')

  const supplier = await prisma.supplier.upsert({
    where: { id: 'supplier-1' }, update: {},
    create: { id: 'supplier-1', name: 'Distribuidora Tech SA' }
  })

  await prisma.purchaseOrder.create({
    data: {
      supplierId: supplier.id, storeId: storeCentral.id, status: PurchaseStatus.RECEIVED,
      items: {
        create: [
          { productId: products[0].id, quantity: 10, cost: 9500.00 },
          { productId: products[1].id, quantity: 30, cost: 180.00 }
        ]
      }
    }
  })
  console.log('Proveedor y orden de compra creados')

  console.log('\nSeed completado')
  console.log('  Admin:          admin@luxury.com   / password123')
  console.log('  Cajero:         cajero@luxury.com  / password123')
  console.log('  Cliente online: test@gmail.com     / password123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())