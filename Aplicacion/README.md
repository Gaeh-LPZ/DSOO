# Levantar Base de datos en /BD-PostgreSQL
```bash
docker compose up -d
```

## Instala dependencias en /app
```bash
npm install
```

## Configuración de Base de Datos (Prisma)

### Ejecuta Migraciones Iniciales
```bash
npx prisma migrate dev --name init
```

### Ejecuta el seed.ts para caragar datos iniciales a la BD
```bash
npx prisma db seed
```


## Gestión Visual de Datos
### Ver la base de datos visualmente
```bash
npx prisma studio
```
Accede en: [http:localhost:5555](http:localhost:5555) 


## Inicia Servidor de Desarrollo
### Corre aplicacion de Next.js
```bash
npm run dev
```

Accede en: [http://localhost:3000](http://localhost:3000)


Estructura a utilizar (Prevista):
```text
src/
│
├── lib/
│   └── prisma.ts
│
├── infrastructure/
│   ├── security/
│   │   ├── hash.service.ts     # Pa Hashear password
│   │   └── jwt.service.ts      # Pa tokens
|   |
├── modules/
│   ├── user/
│   │   ├── domain/             # POO (Reglas de negocio)
│   │   │   ├── User.ts
│   │   │   ├── Role.ts
│   │   │   └── Permission.ts
│   │   │
│   │   ├── application/        # Casos de uso
│   │   │   └── user.service.ts
│   │   │
│   │   ├── infrastructure/     # Base de Datos (Prisma)
│   │   │   └── user.repository.ts
│   │   ├── interfaces/         
│   │   │   └── types.ts #Interfaces (usar cuando se necesiten)
│   │   │
│   │   ├── user.actions.ts     # Actiosnes de User
│   │   └── user.schema.ts      # Validación (Zod)
│   |
│   ├── product/
│   │   ├── domain/
│   │   │   ├── Product.ts
│   │   │   ├── Stock.ts
│   │   │   └── Store.ts
│   │   │
│   │   ├── application/
│   │   │   └── product.service.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   └── product.repository.ts
│   │   │
│   │   └── product.schema.ts
│   |
│   ├── sale/
│   │   ├── domain/
│   │   │   ├── Sale.ts
│   │   │   ├── SaleItem.ts
│   │   │   ├── Payment.ts
│   │   │   └── enums.ts
│   │   │
│   │   ├── application/
│   │   │   └── sale.service.ts
│   │   │
│   │   ├── infrastructure/
│   │   │   └── sale.repository.ts
│   │   │
│   │   └── sale.schema.ts
│   |
│   ├── customer/          
│   ├── supplier/
│   ├── purchase/
│   ├── shipment/
│   ├── invoice/
│   
├── shared/                         # Codigo a reutilizar (Errores, Alertas, etc)
│   ├── errors/
│   └── utils/
│
└── type.ts
```


## Arquitectura DSS
```text
user.actions.ts + use.schema.ts
                |
                v
           user.service.ts
            |         |
            v         v
          domain/   user.repository.ts
                            |
                            v
                          Prisma
                            |
                            v
                        BD (PostgreSQL)
```
