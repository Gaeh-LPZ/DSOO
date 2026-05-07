import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getSalesByDepartmentAction, getTopProductsAction, getTotalSalesAction } from '@/modules/dashboard/dashboard.actons';
import AdminDashboardClient from './AdminDashboardClient';

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  // 1. Estadísticas Globales
  const usersCount = await prisma.user.count();
  const storesCount = await prisma.store.count();
  const rolesCount = await prisma.role.count();
  const statsByDept = await getSalesByDepartmentAction();

  console.log(statsByDept);
  // 2. Usuarios Recientes (para la tabla del Panel de Control)
  const recentUsersDb = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      roles: { include: { role: true } }
    }
  });

  const recentUsers = recentUsersDb.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.roles.length > 0 ? u.roles[0].role.name : 'Sin rol',
    status: u.isActive ? 'Activo' : 'Inactivo' // Basado en el campo isActive del esquema
  }));

  // 3. Datos de Analítica (Caso de Uso)
  const STORE_ID = "store-central";
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const totalVentas = await getTotalSalesAction({
    storeId: STORE_ID,
    startDate: inicioMes,
    endDate: hoy,
  });

  const topProducts = await getTopProductsAction({ storeId: STORE_ID, limit: 5 });

  const globalStats = [
    { label: "Usuarios Totales", value: usersCount.toString(), icon: "group", color: "text-blue-600" },
    { label: "Tiendas Activas", value: storesCount.toString(), icon: "storefront", color: "text-emerald-600" },
    { label: "Roles de Sistema", value: rolesCount.toString(), icon: "shield_person", color: "text-amber-600" },
    { label: "Logs de Sistema", value: "1.2k", icon: "terminal", color: "text-slate-600" },
  ];

  return (
    <AdminDashboardClient 
      globalStats={globalStats}
      totalVentas={totalVentas}
      topProducts={topProducts}
      recentUsers={recentUsers}
      statsDept={statsByDept}
    />
  );
}