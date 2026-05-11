import Link from "next/link"
import { getTopProductsByDateRangeAction } from "@/modules/sale/sale.actions"
import FiltroFechas from "../ui/FiltroFechas"

export default async function AnaliticaPage({
  searchParams,
}: {
  searchParams: { start?: string; end?: string }
}) {
  const hoy = new Date()
  const defaultStart = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0]
  const defaultEnd = hoy.toISOString().split('T')[0]

  const startStr = searchParams.start ?? defaultStart
  const endStr = searchParams.end ?? defaultEnd

  const startDate = new Date(startStr)
  const endDate = new Date(endStr + 'T23:59:59')

  const topProductos = await getTopProductsByDateRangeAction({
    startDate,
    endDate,
    limit: 10,
  })

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
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-slate-50 text-slate-900 rounded-lg border border-slate-100 transition-all">
              <span className="material-symbols-outlined text-xl text-slate-700">bar_chart</span>
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
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Analítica</h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">Productos más vendidos en tiempo real</p>
            </div>
            <p className="text-sm text-slate-500 mt-8 xl:mt-0">{hoy.toLocaleDateString("es-MX")}</p>
          </div>

          {/* Filtros */}
          <div className="bg-white p-6 border border-slate-100 mb-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Filtrar por rango de fechas</p>
                <FiltroFechas
                  startDate={startStr}
                  endDate={endStr}
                  basePath="/reporteGerencial/analitica"
                />
              </div>
              {/* Filtro por departamento — requiere permiso admin */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Filtro por Departamento</p>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200">
                  <span className="material-symbols-outlined text-slate-400 text-sm">lock</span>
                  <span className="text-xs text-slate-400">Requiere permiso de Administrador</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white border border-slate-100">
            <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                Mostrando del <span className="font-medium text-slate-600">{new Date(startStr).toLocaleDateString("es-MX")}</span> al <span className="font-medium text-slate-600">{new Date(endStr).toLocaleDateString("es-MX")}</span>
              </span>
              {/* Omnicanal: sin distinción en schema actual */}
              <span className="text-xs text-slate-300 italic">Ventas físicas y en línea combinadas</span>
            </div>

            <div className="grid grid-cols-12 px-8 py-4 border-b border-slate-100">
              <span className="col-span-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">#</span>
              <span className="col-span-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">Producto</span>
              <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">SKU</span>
              <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Precio</span>
              <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Vendidas</span>
              <span className="col-span-2 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Stock Total</span>
            </div>

            {topProductos.length === 0 && (
              <div className="px-8 py-16 text-center">
                <p className="text-slate-300 text-sm uppercase tracking-widest">Sin ventas en el periodo seleccionado</p>
              </div>
            )}

            {topProductos.map((product, index) => (
              <div key={product.productId} className="grid grid-cols-12 px-8 py-6 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                <span className="col-span-1 text-sm font-serif italic text-slate-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="col-span-3 text-sm font-medium text-slate-800">{product.name}</span>
                <span className="col-span-2 text-sm text-slate-400 font-mono">{product.sku}</span>
                <span className="col-span-2 text-sm text-slate-600 text-right">
                  ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
                <span className="col-span-2 text-sm font-medium text-slate-800 text-right">{product.unitsSold} uds</span>
                <span className={`col-span-2 text-sm font-medium text-right ${product.totalStock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {product.totalStock}
                  {product.totalStock <= 5 && (
                    <span className="ml-1 text-xs bg-rose-100 text-rose-600 px-1">bajo</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* S1: Stock bajo con orden de compra */}
          {topProductos.some(p => p.totalStock <= 5) && (
            <div className="mt-6 flex items-start gap-3 px-6 py-4 bg-rose-50 border border-rose-100">
              <span className="material-symbols-outlined text-rose-500 text-xl mt-0.5">warning</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-700 mb-1">Productos con stock bajo detectados</p>
                <p className="text-xs text-rose-600">Los productos marcados requieren reabastecimiento inmediato.</p>
              </div>
              {/* conectar con createOrderAction cuando esté el front de compras */}
              <button className="text-xs font-semibold tracking-wider uppercase text-rose-700 border border-rose-300 px-4 py-2 hover:bg-rose-100 transition-colors whitespace-nowrap">
                Generar Orden de Compra
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}