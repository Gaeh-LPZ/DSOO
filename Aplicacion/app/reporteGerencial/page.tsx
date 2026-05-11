import Link from "next/link"
import {
  getTopProductsAction,
  getTotalSalesAction,
  getSalesByDayAction,
  getLowStockAction,
} from "@/modules/sale/sale.actions"
import GraficaBarras from "./ui/GraficaBarras"

const STORE_ID = "store-central"
const STORE_NAME = "Sucursal Central"

export default async function ReporteGerencialPage() {

  const hoy = new Date()
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0)
  const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59)
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  const totalVentasHoy = await getTotalSalesAction({ storeId: STORE_ID, startDate: inicioDia, endDate: finDia })
  const totalVentasMes = await getTotalSalesAction({ storeId: STORE_ID, startDate: inicioMes, endDate: finDia })
  const topProductos = await getTopProductsAction({ storeId: STORE_ID, limit: 5 })
  const ventasPorDia = await getSalesByDayAction({ storeId: STORE_ID })
  const stockBajo = await getLowStockAction()

  const kpis = {
    ventasDelDia: {
      titulo: "Ventas del Día",
      valor: `$${totalVentasHoy.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      cambio: "Hoy",
      isPositive: true,
    },
    ventasMes: {
      titulo: "Ventas del Mes",
      valor: `$${totalVentasMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      cambio: "Este mes",
      isPositive: true,
    },
    alertasStock: {
      titulo: "Alertas de Stock",
      valor: `${stockBajo.length}`,
      cambio: stockBajo.length > 0 ? "Requieren atención" : "Sin alertas",
      isPositive: stockBajo.length === 0,
    },
    sucursal: {
      titulo: "Sucursal",
      valor: STORE_NAME,
      cambio: "Activa",
      isPositive: true,
    },
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-body">

      <aside className="w-64 bg-white border-r border-slate-200/60 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-8 pb-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">The Atelier</p>
          <p className="text-sm font-serif italic text-slate-900 mt-1">Management</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <Link href="/reporteGerencial">
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-slate-50 text-slate-900 rounded-lg border border-slate-100 transition-all">
              <span className="material-symbols-outlined text-xl text-slate-700">dashboard</span>
              <span className="text-sm font-medium tracking-wide">Dashboard</span>
            </button>
          </Link>
          <Link href="/reporteGerencial/analitica">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">bar_chart</span>
              <span className="text-sm font-medium tracking-wide">Analítica</span>
            </button>
          </Link>
          <Link href="/reporteGerencial/porArea">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">store</span>
              <span className="text-sm font-medium tracking-wide">Por Área</span>
            </button>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm font-medium tracking-wide">Configuración</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 bg-[#fafaf5]">
        <div className="max-w-6xl mx-auto">

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 pb-8 border-b border-slate-200/60 pt-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">{STORE_NAME} — Visión general del rendimiento operativo</p>
            </div>
            <p className="text-sm text-slate-500 mt-8 xl:mt-0">{hoy.toLocaleDateString("es-MX")}</p>
          </div>

          {/* Alerta stock bajo */}
          {stockBajo.length > 0 && (
            <div className="mb-8 flex items-start gap-3 px-6 py-4 bg-rose-50 border border-rose-100">
              <span className="material-symbols-outlined text-rose-500 text-xl mt-0.5">warning</span>
              <div>
                <p className="text-sm font-semibold text-rose-700 mb-2">Alerta de Stock Bajo</p>
                <div className="flex flex-wrap gap-2">
                  {stockBajo.map((s, i) => (
                    <span key={i} className="text-xs text-rose-600 bg-rose-100 px-2 py-1">
                      {s.productName} — {s.storeName}: {s.quantity} uds
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {Object.entries(kpis).map(([key, kpi]) => (
              <div key={key} className="bg-white p-8 border border-slate-100 hover:border-slate-200 transition-colors duration-300 flex flex-col justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">{kpi.titulo}</h3>
                <div>
                  <p className="text-3xl font-light text-slate-900 mb-4">{kpi.valor}</p>
                  <span className={`text-xs font-medium px-2 py-1 ${kpi.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {kpi.cambio}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-10 border border-slate-100">
              <h2 className="text-lg font-serif text-slate-900 mb-2">Ventas por Día</h2>
              <p className="text-sm text-slate-400 mb-8">Total acumulado por día de la semana</p>
              {ventasPorDia.every(d => d.total === 0) ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-slate-300 text-sm uppercase tracking-widest">Sin datos para mostrar</p>
                </div>
              ) : (
                <GraficaBarras data={ventasPorDia} dataKey="total" nameKey="day" label="Ventas $" />
              )}
            </div>

            <div className="bg-white p-10 border border-slate-100">
              <h2 className="text-lg font-serif text-slate-900 mb-2">Top Productos</h2>
              <p className="text-sm text-slate-400 mb-8">Unidades vendidas por producto</p>
              {topProductos.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-slate-300 text-sm uppercase tracking-widest">Sin datos para mostrar</p>
                </div>
              ) : (
                <GraficaBarras
                  data={topProductos.map(p => ({ name: p.name, quantity: p.quantity }))}
                  dataKey="quantity"
                  nameKey="name"
                  label="Unidades"
                />
              )}
            </div>
          </div>

          {/* Top 5 lista */}
          <div className="bg-white p-10 border border-slate-100 pb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-serif text-slate-900">Top 5 Productos Vendidos</h2>
              <Link href="/reporteGerencial/analitica">
                <button className="text-xs font-semibold tracking-wider uppercase text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                  Ver analítica completa
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </Link>
            </div>
            <div className="space-y-6">
              {topProductos.length === 0 && (
                <p className="text-sm text-slate-300 text-center py-4">Sin ventas registradas</p>
              )}
              {topProductos.map((product, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-serif italic text-slate-300 w-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 font-light">{product.quantity} uds</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}