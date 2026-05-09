"use client";

import { useState, useTransition } from 'react';
import Link from 'next/link';
import NuevoUsuarioModal from './RegisterModal';
import NuevoRolModal from './NuevoRolModal';
import { useRouter } from "next/navigation";
import { CloseLoginAction } from '@/share/closeSession';
import { getStoreReportAction } from '@/modules/product/store.actions'; //Pa boton actualizar

interface StoreReport {
  storeId: string
  storeName: string
  totalIngresos: number
  totalVentas: number
  ticketPromedio: number
  ingresoEfectivo: number
  ingresoTarjeta: number
  ingresoCredito: number
  totalDevoluciones: number
  topProducto: { nombre: string; cantidad: number } | null
  ventasPorDia: { fecha: string; ingresos: number }[]
}

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n)
}

function toInputDate(d: Date) {
  return d.toISOString().split("T")[0]
}

function BarChart({ data }: { data: { fecha: string; ingresos: number }[] }) {
  if (!data.length) return <p className="text-xs text-slate-400 py-8 text-center">Sin datos en el período</p>

  const max = Math.max(...data.map(d => d.ingresos), 1)

  return (
    <div className="flex items-end gap-1 h-24 w-full mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-emerald-500 rounded-t transition-all duration-300 group-hover:bg-emerald-400"
            style={{ height: `${(d.ingresos / max) * 100}%`, minHeight: "2px" }}
          />
          {/* Tooltip */}
          <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
            <div className="bg-slate-900 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap">
              {d.fecha.slice(5)}<br />{formatMXN(d.ingresos)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Metodos de pago (Tratar de Grafica)
function PaymentDonut({ efectivo, tarjeta, credito }: { efectivo: number; tarjeta: number; credito: number }) {
  const total = efectivo + tarjeta + credito || 1
  const pcts = {
    efectivo: Math.round((efectivo / total) * 100),
    tarjeta: Math.round((tarjeta / total) * 100),
    credito: Math.round((credito / total) * 100),
  }

  // SVG donut con strokeDasharray
  const r = 30
  const circ = 2 * Math.PI * r
  let offset = 0

  const segments = [
    { pct: pcts.efectivo, color: "#10b981", label: "Efectivo" },
    { pct: pcts.tarjeta, color: "#3b82f6", label: "Tarjeta" },
    { pct: pcts.credito, color: "#f59e0b", label: "Crédito" },
  ]

  return (
    <div className="flex items-center gap-6">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * circ
          const gap = circ - dash
          const el = (
            <circle
              key={i}
              cx="40" cy="40" r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-slate-500">{s.label}</span>
            <span className="font-bold text-slate-800 ml-auto">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Card de tienda
function StoreCard({ store }: { store: StoreReport }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">{store.storeId}</p>
          <h3 className="text-lg font-serif text-slate-900 mt-0.5">{store.storeName}</h3>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Ingresos</p>
            <p className="text-xl font-light font-mono text-emerald-600">{formatMXN(store.totalIngresos)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Ventas</p>
            <p className="text-xl font-light text-slate-900">{store.totalVentas}</p>
          </div>
          <span className={`material-symbols-outlined text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* Detalle expandible */}
      {open && (
        <div className="border-t border-slate-100 px-8 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-200">

          {/* KPIs */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resumen</p>
            <div className="space-y-3">
              {[
                { label: "Ticket promedio", value: formatMXN(store.ticketPromedio) },
                { label: "Devoluciones", value: store.totalDevoluciones.toString() },
                { label: "Top producto", value: store.topProducto ? `${store.topProducto.nombre} (×${store.topProducto.cantidad})` : "—" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-800 text-right max-w-[180px] truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Método de pago</p>
            <PaymentDonut
              efectivo={store.ingresoEfectivo}
              tarjeta={store.ingresoTarjeta}
              credito={store.ingresoCredito}
            />
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Efectivo</span>
                <span className="font-mono font-semibold text-slate-800">{formatMXN(store.ingresoEfectivo)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Tarjeta</span>
                <span className="font-mono font-semibold text-slate-800">{formatMXN(store.ingresoTarjeta)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Crédito</span>
                <span className="font-mono font-semibold text-slate-800">{formatMXN(store.ingresoCredito)}</span>
              </div>
            </div>
          </div>

          {/* Gráfica por día */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Ingresos por día</p>
            <BarChart data={store.ventasPorDia} />
          </div>

        </div>
      )}
    </div>
  )
}

// Componente principal 
export default function AdminDashboardClient({ globalStats, totalVentas, topProducts, recentUsers, statsDept, roles, storeReport: initialStoreReport}: any) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('control')
  const [activeTable, setActiveTable] = useState<'usuarios' | 'roles' | 'tiendas'>('usuarios')
  const [showUsuarioModal, setShowUsuarioModal] = useState(false)
  const [showRolModal, setShowRolModal] = useState(false)

  // Reporte de tiendas con rango personalizable
  const hoy = new Date()
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1)
  const [startDate, setStartDate] = useState(toInputDate(inicioAnio))
  const [endDate, setEndDate] = useState(toInputDate(hoy))
  const [storeReport, setStoreReport] = useState<StoreReport[]>(initialStoreReport ?? [])
  const [isPending, startTransition] = useTransition()

  const handleFetchReport = () => {
    startTransition(async () => {
      const result = await getStoreReportAction({ startDate, endDate })
      setStoreReport(result)
    })
  }

  // Totales del reporte
  const reportTotals = storeReport.reduce(
    (acc: any, s: StoreReport) => ({
      ingresos: acc.ingresos + s.totalIngresos,
      ventas: acc.ventas + s.totalVentas,
    }),
    { ingresos: 0, ventas: 0 }
  )

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-body text-slate-900">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/60 shrink-0 flex flex-col md:flex">
        <div className="p-8 pb-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">The Atelier</p>
          <p className="text-sm font-serif italic text-slate-900 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          <button
            onClick={() => setActiveTab('control')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'control' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            <span className="text-sm font-medium tracking-wide">Panel Control</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === 'db' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-xl">database</span>
            <span className="text-sm font-medium tracking-wide">Base de Datos</span>
          </button>

          <Link
            href="/admin/envios"
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-xl">local_shipping</span>
            <span className="text-sm font-medium tracking-wide">Gestión Envíos</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => CloseLoginAction()}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 bg-[#fafaf5]">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 pb-8 border-b border-slate-200/60">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">
                {activeTab === 'control' ? 'Administración' : 'Analítica de Base de Datos'}
              </h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">
                {activeTab === 'control' ? 'Control de usuarios y recursos globales' : 'Visualización de métricas de ventas en tiempo real'}
              </p>
            </div>

            {activeTab === 'control' && activeTable === 'usuarios' && (
              <button
                onClick={() => setShowUsuarioModal(true)}
                className="mt-8 xl:mt-0 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase bg-slate-900 text-white px-6 py-3 hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Nuevo Usuario
              </button>
            )}
            {activeTab === 'control' && activeTable === 'roles' && (
              <button
                onClick={() => setShowRolModal(true)}
                className="mt-8 xl:mt-0 flex items-center gap-2 text-xs font-semibold tracking-wider uppercase bg-slate-900 text-white px-6 py-3 hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">shield_person</span>
                Nuevo Rol
              </button>
            )}
          </div>

          {/* VISTA 1: PANEL DE CONTROL */}
          {activeTab === 'control' && (
            <div className="space-y-12 animate-in fade-in duration-500">

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalStats?.map((stat: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (stat.label === "Roles de Sistema") setActiveTable('roles')
                      if (stat.label === "Usuarios Totales") setActiveTable('usuarios')
                      if (stat.label === "Tiendas Activas") setActiveTable('tiendas') // ← nuevo
                    }}
                    className={`bg-white p-8 border transition-all duration-200 ${["Roles de Sistema", "Usuarios Totales", "Tiendas Activas"].includes(stat.label)
                        ? "cursor-pointer hover:border-slate-200 hover:shadow-sm"
                        : ""
                      } ${(stat.label === "Roles de Sistema" && activeTable === 'roles') ||
                        (stat.label === "Usuarios Totales" && activeTable === 'usuarios') ||
                        (stat.label === "Tiendas Activas" && activeTable === 'tiendas')
                        ? "border-slate-300 shadow-sm"
                        : "border-slate-100"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                      <span className={`material-symbols-outlined ${stat.color} opacity-70`}>{stat.icon}</span>
                    </div>
                    <p className="text-4xl font-light text-slate-900">{stat.value}</p>
                    {["Roles de Sistema", "Usuarios Totales", "Tiendas Activas"].includes(stat.label) && (
                      <p className="text-[10px] text-slate-400 mt-3 tracking-wide">Ver todos →</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Toggle tabla */}
              <div className="bg-white border border-slate-100 shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {(["usuarios", "roles", "tiendas"] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTable(tab)}
                        className={`px-4 py-1.5 text-xs font-semibold tracking-wide rounded-md transition-all capitalize ${activeTable === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        {tab === 'usuarios' ? 'Usuarios recientes' : tab === 'roles' ? 'Roles del sistema' : 'Reporte de tiendas'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabla usuarios */}
                {activeTable === 'usuarios' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                          <th className="px-8 py-4">Usuario</th>
                          <th className="px-8 py-4">Rol</th>
                          <th className="px-8 py-4">Estado</th>
                          <th className="px-8 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentUsers?.map((user: any) => (
                          <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                <span className="text-xs text-slate-400">{user.email}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">{user.role}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className="text-xs text-slate-600">{user.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                <span className="material-symbols-outlined text-xl">edit_note</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tabla roles */}
                {activeTable === 'roles' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                          <th className="px-8 py-4">Rol</th>
                          <th className="px-8 py-4">Descripción</th>
                          <th className="px-8 py-4">Permisos</th>
                          <th className="px-8 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {roles?.length === 0 ? (
                          <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400 text-sm">No hay roles creados</td></tr>
                        ) : roles?.map((role: any) => (
                          <tr key={role.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-6">
                              <span className="text-xs font-semibold tracking-wider uppercase text-slate-700">{role.name}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs text-slate-500">{role.description}</span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-wrap gap-1">
                                {role.permission.map((perm: string) => (
                                  <span key={perm} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">{perm}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                                <span className="material-symbols-outlined text-xl">edit_note</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Reporte de tiendas */}
                {activeTable === 'tiendas' && (
                  <div className="p-8 space-y-8">

                    {/* Selector de fechas */}
                    <div className="flex flex-wrap items-end gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Desde</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          className="border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hasta</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          className="border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <button
                        onClick={handleFetchReport}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        {isPending ? "Cargando..." : "Actualizar"}
                      </button>
                    </div>

                    {/* Totales generales */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 text-white p-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total ingresos</p>
                        <p className="text-3xl font-light font-mono text-emerald-400 mt-2">{formatMXN(reportTotals.ingresos)}</p>
                      </div>
                      <div className="bg-white border border-slate-100 p-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total ventas</p>
                        <p className="text-3xl font-light text-slate-900 mt-2">{reportTotals.ventas}</p>
                      </div>
                    </div>

                    {/* Card por tienda */}
                    <div className="space-y-4">
                      {storeReport.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm py-12">Sin ventas en el período seleccionado</p>
                      ) : storeReport.map((store: StoreReport) => (
                        <StoreCard key={store.storeId} store={store} />
                      ))}
                    </div>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* VISTA 2: BASE DE DATOS */}
          {activeTab === 'db' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">bar_chart</span>
                  Ventas por Departamento
                </h3>
                <div className="space-y-6">
                  {statsDept?.map((dept: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2 text-slate-700">
                        <span className="font-medium">{dept.name}</span>
                        <span className="font-mono text-slate-500">${dept.sales}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${dept.color} ${dept.width} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">trending_up</span>
                  Top 5 Productos
                </h3>
                <div className="divide-y divide-slate-50">
                  {topProducts?.map((prod: any, i: number) => (
                    <div key={i} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {prod.id?.substring(0, 8) || prod.productId?.substring(0, 8) || 'S/N'}</p>
                      </div>
                      <p className="text-sm font-mono font-bold text-emerald-600">+{prod.quantity} uds</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900 text-white p-10 shadow-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ingresos Mensuales Acumulados</p>
                  <p className="text-5xl font-light mt-4 font-mono text-emerald-400">
                    ${typeof totalVentas === 'number' ? totalVentas.toLocaleString() : '0.00'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-8xl opacity-10">query_stats</span>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modales */}
      {showUsuarioModal && (
        <NuevoUsuarioModal onClose={() => setShowUsuarioModal(false)} onSuccess={() => router.refresh()} />
      )}
      {showRolModal && (
        <NuevoRolModal onClose={() => setShowRolModal(false)} onSuccess={() => router.refresh()} />
      )}

    </div>
  )
}