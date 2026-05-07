"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// AQUÍ ESTÁ LA MAGIA: Recibimos TODAS las variables juntas
export default function AdminDashboardClient({ globalStats, totalVentas, topProducts, recentUsers, statsDept }: any) {
  const [activeTab, setActiveTab] = useState('control');

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-body text-slate-900">
      
      {/* --- SIDEBAR --- */}
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
           <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-sm font-medium tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-12 bg-[#fafaf5]">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 pb-8 border-b border-slate-200/60">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">
                {activeTab === 'control' ? 'Administración' : 'Analítica de Base de Datos'}
              </h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">
                {activeTab === 'control' ? 'Control de usuarios y recursos globales' : 'Visualización de métricas de ventas en tiempo real'}
              </p>
            </div>
            
            {activeTab === 'control' && (
              <div className="mt-8 xl:mt-0">
                <button className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase bg-slate-900 text-white px-6 py-3 hover:bg-slate-800 transition-all shadow-md active:scale-95">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>Nuevo Usuario</span>
                </button>
              </div>
            )}
          </div>

          {/* VISTA 1: PANEL DE CONTROL */}
          {activeTab === 'control' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {globalStats?.map((stat: any, i: number) => (
                  <div key={i} className="bg-white p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                      <span className={`material-symbols-outlined ${stat.color} opacity-70`}>{stat.icon}</span>
                    </div>
                    <p className="text-4xl font-light text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-100 shadow-sm">
                <div className="p-8 border-b border-slate-100">
                  <h2 className="text-lg font-serif text-slate-900">Usuarios Recientes</h2>
                </div>
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
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
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
              </div>
            </div>
          )}

          {/* VISTA 2: BASE DE DATOS (GRÁFICAS) */}
          {activeTab === 'db' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">bar_chart</span>
                  Ventas por Departamento
                </h3>
                <div className="space-y-6">
                  {/* AQUÍ CORREGIMOS EL TYPINGS (dept: any, i: number) */}
                  {statsDept?.map((dept: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2 text-slate-700">
                        <span className="font-medium">{dept.name}</span>
                        <span className="font-mono text-slate-500">${dept.sales}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${dept.color} ${dept.width} rounded-full`}></div>
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
                        <p className="text-[10px] text-slate-400">ID: {prod.id?.substring(0,8) || prod.productId?.substring(0,8) || 'S/N'}</p>
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
    </div>
  );
}