import Link from "next/link"
import { getTotalSalesByStoreAction, getTotalSalesAction, getSalesByDayAction } from "@/modules/sale/sale.actions"
import GraficaBarras from "../ui/GraficaBarras"

const STORES = [
  { id: "store-central", name: "Sucursal Central" },
  { id: "store-norte", name: "Sucursal Norte" },
]

//cuando haya auth de gerente, leer storeId del token en vez de query param
export default async function PorAreaPage({
  searchParams,
}: {
  searchParams: { store?: string; comparar?: string }
}) {
  const storeId = searchParams.store ?? "store-central"
  const compararId = searchParams.comparar
  const storeName = STORES.find(s => s.id === storeId)?.name ?? "Sucursal Central"
  const compararName = STORES.find(s => s.id === compararId)?.name

  const hoy = new Date()
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0)
  const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59)
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  const totalHoy = await getTotalSalesAction({ storeId, startDate: inicioDia, endDate: finDia })
  const totalMes = await getTotalSalesAction({ storeId, startDate: inicioMes, endDate: finDia })
  const ventasPorDia = await getSalesByDayAction({ storeId })
  const todasAreas = await getTotalSalesByStoreAction()
  const areaActual = todasAreas.find(a => a.storeId === storeId)

  // S1: comparativa
  let compararData = null
  if (compararId && compararId !== storeId) {
    const totalHoyComp = await getTotalSalesAction({ storeId: compararId, startDate: inicioDia, endDate: finDia })
    const totalMesComp = await getTotalSalesAction({ storeId: compararId, startDate: inicioMes, endDate: finDia })
    const ventasPorDiaComp = await getSalesByDayAction({ storeId: compararId })
    const areaComp = todasAreas.find(a => a.storeId === compararId)
    compararData = { totalHoy: totalHoyComp, totalMes: totalMesComp, ventasPorDia: ventasPorDiaComp, area: areaComp }
  }

  const otrasAreas = STORES.filter(s => s.id !== storeId)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-body">

      <aside className="w-64 bg-white border-r border-slate-200/60 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-8 pb-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">The Atelier</p>
          <p className="text-sm font-serif italic text-slate-900 mt-1">Management</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <Link href="/reporteGerencial">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">dashboard</span>
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
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-slate-50 text-slate-900 rounded-lg border border-slate-100 transition-all">
              <span className="material-symbols-outlined text-xl text-slate-700">store</span>
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
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">{storeName}</h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">Rendimiento del área asignada</p>
            </div>
            {/* S1: Comparativa — Gerente General */}
            <div className="mt-8 xl:mt-0 flex flex-col items-end gap-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest">Comparar con</p>
              <div className="flex gap-2">
                {otrasAreas.map(store => (
                  <Link
                    key={store.id}
                    href={compararId === store.id
                      ? `/reporteGerencial/porArea?store=${storeId}`
                      : `/reporteGerencial/porArea?store=${storeId}&comparar=${store.id}`
                    }
                  >
                    <button className={`text-xs font-semibold tracking-wider uppercase px-4 py-2 border transition-all ${compararId === store.id ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-500 border-slate-300 hover:bg-slate-900 hover:text-white'}`}>
                      {store.name}
                    </button>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">Requiere permisos de Gerente General</p>
            </div>
          </div>

          {/* KPIs — comparativa lado a lado si aplica */}
          <div className={`grid gap-6 mb-12 ${compararData ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>

            {/* Área principal */}
            <div className={`${compararData ? 'space-y-4' : 'contents'}`}>
              {compararData && (
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest col-span-full">{storeName}</p>
              )}
              <div className="bg-white p-8 border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Ventas del Día</h3>
                <p className="text-4xl font-light text-slate-900 mb-4">
                  ${totalHoy.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700">Hoy</span>
              </div>
              <div className="bg-white p-8 border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Ventas del Mes</h3>
                <p className="text-4xl font-light text-slate-900 mb-4">
                  ${totalMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700">Este mes</span>
              </div>
              <div className="bg-white p-8 border border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Órdenes Completadas</h3>
                <p className="text-4xl font-light text-slate-900 mb-4">{areaActual?.totalOrders ?? 0}</p>
                <span className="text-xs font-medium px-2 py-1 bg-slate-50 text-slate-600">Total histórico</span>
              </div>
            </div>

            {/* Área comparada */}
            {compararData && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{compararName}</p>
                <div className="bg-white p-8 border border-slate-200 border-dashed">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Ventas del Día</h3>
                  <p className="text-4xl font-light text-slate-900 mb-4">
                    ${compararData.totalHoy.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700">Hoy</span>
                </div>
                <div className="bg-white p-8 border border-slate-200 border-dashed">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Ventas del Mes</h3>
                  <p className="text-4xl font-light text-slate-900 mb-4">
                    ${compararData.totalMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700">Este mes</span>
                </div>
                <div className="bg-white p-8 border border-slate-200 border-dashed">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Órdenes Completadas</h3>
                  <p className="text-4xl font-light text-slate-900 mb-4">{compararData.area?.totalOrders ?? 0}</p>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-50 text-slate-600">Total histórico</span>
                </div>
              </div>
            )}
          </div>

          {/* Gráfica */}
          <div className={`grid gap-8 mb-8 ${compararData ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="bg-white p-10 border border-slate-100">
              <h2 className="text-lg font-serif text-slate-900 mb-2">Ventas Diarias — {storeName}</h2>
              <p className="text-sm text-slate-400 mb-8">Total por día de la semana</p>
              {ventasPorDia.every(d => d.total === 0) ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-slate-300 text-sm uppercase tracking-widest">Sin actividad reciente en el área</p>
                </div>
              ) : (
                <GraficaBarras data={ventasPorDia} dataKey="total" nameKey="day" label="Ventas $" />
              )}
            </div>

            {compararData && (
              <div className="bg-white p-10 border border-slate-200 border-dashed">
                <h2 className="text-lg font-serif text-slate-900 mb-2">Ventas Diarias — {compararName}</h2>
                <p className="text-sm text-slate-400 mb-8">Total por día de la semana</p>
                {compararData.ventasPorDia.every((d: any) => d.total === 0) ? (
                  <div className="h-[250px] flex items-center justify-center">
                    <p className="text-slate-300 text-sm uppercase tracking-widest">Sin actividad reciente</p>
                  </div>
                ) : (
                  <GraficaBarras data={compararData.ventasPorDia} dataKey="total" nameKey="day" label="Ventas $" />
                )}
              </div>
            )}
          </div>

          {/* Rendimiento de vendedores */}
          <div className="bg-white p-10 border border-slate-100 border-dashed">
            <h2 className="text-lg font-serif text-slate-400 mb-2">Rendimiento de Vendedores</h2>
            <p className="text-sm text-slate-300">
              Disponible cuando se asignen vendedores por área en el sistema.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}