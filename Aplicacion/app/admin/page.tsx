import { getGlobalStatsAction, getRecentUsersAction,
         getSalesByDepartmentAction, getTopProductsAction,
         getTotalSalesAction } from '@/modules/dashboard/dashboard.actons';
import AdminDashboardClient from './AdminDashboardClient';
import { getRolesAction } from '@/modules/user/user.actions';
import { getStoreReportAction } from '@/modules/product/store.actions';

export default async function AdminDashboardPage() {
  const STORE_ID = "store-central";
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1);

  const [stats, recentUsers, rawStatsByDept, totalVentas, topProducts, roles, storeReport] = await Promise.all([
    getGlobalStatsAction(),
    getRecentUsersAction(5),
    getSalesByDepartmentAction(),
    getTotalSalesAction({ storeId: STORE_ID, startDate: inicioMes, endDate: hoy }),
    getTopProductsAction({ storeId: STORE_ID, limit: 5 }),
    getRolesAction(),
    getStoreReportAction({ startDate: inicioAnio, endDate: hoy })
  ]);

  const globalStats = [
    { label: "Usuarios Totales", value: stats.users.toString(), icon: "group", color: "text-blue-600" },
    { label: "Tiendas Activas", value: stats.stores.toString(), icon: "storefront", color: "text-emerald-600" },
    { label: "Roles de Sistema", value: stats.roles.toString(), icon: "shield_person", color: "text-amber-600" },
    { label: "Logs de Sistema", value: "1.2k", icon: "terminal", color: "text-slate-600" },
  ];

  const colors: Record<string, string> = {
    "Electrónica": "bg-blue-500",
    "Luxury Wear": "bg-emerald-500",
    "Hogar": "bg-amber-500"
  };

  const statsByDept = rawStatsByDept.map(({ name, sales }) => ({
    name,
    sales,
    color: colors[name] ?? "bg-slate-500",
    width: `w-[${Math.min(Math.round((sales / 150000) * 100), 100)}%]`
  }));

  return (
    <AdminDashboardClient
      globalStats={globalStats}
      totalVentas={totalVentas}
      topProducts={topProducts}
      recentUsers={recentUsers}
      statsDept={statsByDept}
      roles={roles}
      storeReport={storeReport}
    />
  );
}