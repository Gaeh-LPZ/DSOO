"use client";

import { useState } from "react";

// Definimos los tipos de pestañas disponibles
type TabType = "datos" | "pedidos" | "direcciones" | "pagos" | "seguridad";

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState<TabType>("datos");

  // Función para manejar las clases CSS activas/inactivas del menú lateral
  const getTabClass = (tabName: TabType) => {
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
      activeTab === tabName
        ? "bg-slate-900 text-white font-medium"
        : "text-slate-600 hover:bg-slate-100"
    }`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 bg-surface">
      {/* Contenedor principal a dos columnas en desktop */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- COLUMNA IZQUIERDA: SIDEBAR --- */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
              <span className="material-symbols-outlined text-3xl">person</span>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Ana García</h2>
              <p className="text-sm text-slate-500">Miembro Atelier</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button onClick={() => setActiveTab("datos")} className={getTabClass("datos")}>
              <span className="material-symbols-outlined">badge</span>
              Mis Datos
            </button>
            <button onClick={() => setActiveTab("pedidos")} className={getTabClass("pedidos")}>
              <span className="material-symbols-outlined">local_mall</span>
              Historial de Pedidos
            </button>
            <button onClick={() => setActiveTab("direcciones")} className={getTabClass("direcciones")}>
              <span className="material-symbols-outlined">location_on</span>
              Direcciones
            </button>
            <button onClick={() => setActiveTab("pagos")} className={getTabClass("pagos")}>
              <span className="material-symbols-outlined">credit_card</span>
              Métodos de Pago
            </button>
            <button onClick={() => setActiveTab("seguridad")} className={getTabClass("seguridad")}>
              <span className="material-symbols-outlined">lock</span>
              Seguridad
            </button>
            
            <div className="h-px bg-slate-200 my-4"></div>
            
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left text-red-600 hover:bg-red-50">
              <span className="material-symbols-outlined">logout</span>
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* --- COLUMNA DERECHA: CONTENIDO DINÁMICO --- */}
        <section className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[600px]">
          
          {/* VISTA: MIS DATOS */}
          {activeTab === "datos" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Información Personal</h2>
                <button className="text-sm font-medium text-slate-900 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50">
                  Editar Datos
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Nombre Completo</label>
                  <p className="text-slate-900 font-medium py-2 border-b border-slate-200">Ana García López</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Correo Electrónico</label>
                  <p className="text-slate-900 font-medium py-2 border-b border-slate-200">ana.garcia@ejemplo.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Teléfono</label>
                  <p className="text-slate-900 font-medium py-2 border-b border-slate-200">+52 55 1234 5678</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Fecha de Nacimiento</label>
                  <p className="text-slate-900 font-medium py-2 border-b border-slate-200">15/Marzo/1990</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">RFC</label>
                  <p className="text-slate-900 font-medium py-2 border-b border-slate-200">abcdv020202</p>
                </div>
              </div>
            </div>
          )}

          {/* VISTA: HISTORIAL DE PEDIDOS */}
          {activeTab === "pedidos" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Historial de Pedidos</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-3 font-medium">ID Pedido</th>
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium">Estado</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* Fila de ejemplo 1 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-4 font-medium">#ORD-9823</td>
                      <td className="py-4 text-slate-600">12 Mar 2026</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Entregado
                        </span>
                      </td>
                      <td className="py-4 font-medium">$4,500.00</td>
                      <td className="py-4 text-right">
                        <button className="text-slate-600 hover:text-slate-900 underline">Ver Detalles</button>
                      </td>
                    </tr>
                    {/* Fila de ejemplo 2 */}
                    <tr className="border-b border-slate-100">
                      <td className="py-4 font-medium">#ORD-9755</td>
                      <td className="py-4 text-slate-600">28 Feb 2026</td>
                      <td className="py-4">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          En Tránsito
                        </span>
                      </td>
                      <td className="py-4 font-medium">$1,250.00</td>
                      <td className="py-4 text-right">
                        <button className="text-slate-600 hover:text-slate-900 underline">Ver Detalles</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA: DIRECCIONES */}
          {activeTab === "direcciones" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Mis Direcciones</h2>
                <button className="flex items-center gap-2 text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Nueva Dirección
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tarjeta de Dirección Predeterminada */}
                <div className="border-2 border-slate-900 rounded-xl p-5 relative">
                  <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    PREDETERMINADA
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Casa</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    Av. Paseo de la Reforma 222, Int 4A<br />
                    Col. Juárez, Cuauhtémoc<br />
                    Ciudad de México, CDMX 06600
                  </p>
                  <div className="flex gap-4 text-sm font-medium">
                    <button className="text-slate-900 hover:underline">Editar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA: MÉTODOS DE PAGO */}
          {activeTab === "pagos" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Métodos de Pago</h2>
                <button className="flex items-center gap-2 text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Nuevo Método
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tarjeta de Crédito Visual */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-md">
                  <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                    PREDETERMINADA
                  </div>
                  <div className="text-lg font-mono tracking-widest mt-6 mb-2">
                    **** **** **** 4589
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-300 uppercase">Titular</p>
                      <p className="font-medium text-sm">ANA GARCÍA</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 uppercase">Expira</p>
                      <p className="font-medium text-sm">12/28</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA: SEGURIDAD */}
          {activeTab === "seguridad" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-md">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Seguridad</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Cambiar Contraseña</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 focus:outline-none" />
                  </div>
                  <button className="bg-slate-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>


            </div>
          )}

        </section>
      </div>
    </main>
  );
}