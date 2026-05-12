# Aplicación Web: Sistema de Tiendas Departamentales


## Descripción del proyecto
El presente proyecto consiste en el desarrollo de una aplicación web orientada a la gestión de tiendas departamentales, similar a plataformas como Liverpool o Sears.

### El sistema permite a los usuarios:
- Realizar compras en línea
- Generar facturas electrónicas
- Ver perfil y cambiar contraseña
- Dar seguimiento al envío de sus pedidos
- Consultar el estado de entrega de sus productos
- Crear y administrar una cuenta dentro de la plataforma


Por otro lado, el sistema incluye funcionalidades para distintos roles administrativos:

### Rol Gerente
El gerente cuenta con acceso a un dashboard que muestra información relevante sobre el desempeño de las tiendas, tales como:
- Productos más vendidos por sucursal
- Alertas de productos con bajo stock
- Filtros por rango de fechas
- Visualización de datos mediante gráficas de ventas
Esto permite una mejor toma de decisiones basada en datos.

### Rol Administrador (ADMIN)
El administrador tiene acceso a reportes globales del sistema, sin limitarse a una sucursal en específico. Esto incluye:
- Reportes generales de todas las tiendas
- Análisis consolidado de ventas
- Control total del sistema


## Tecnologías utilizadas
- Stripe (procesamiento de pagos)
- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Generación de archivos PDF
- Generación de archivos XML
- Zod (validación de datos de entrada)
- jose (generación y manejo de tokens)
- bcryptjs (encriptación de contraseñas)


## Módulos del sistema

### Inicio de sesión
![alt text](<Imagenes Ilustativas/Login.png>)

#### Registro de usuarios
![alt text](<Imagenes Ilustativas/Registro.png>)


#### Perfil de usuarios
![alt text](<Imagenes Ilustativas/Perfil.png>)

#### Tienda en línea
![alt text](<Imagenes Ilustativas/Tienda.png>)

### Perfil de usuario
![alt text](<Imagenes Ilustativas/Registro.png>)

### Carrito Usuario
![alt text](<Imagenes Ilustativas/Carrito.png>)


### Reporte gerencial
![alt text](<Imagenes Ilustativas/Reporte_Gerencial.png>)

### Panel de administración (ADMIN)
![alt text](<Imagenes Ilustativas/Reporte_Admin.png>)