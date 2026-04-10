import Link from "next/link";

export default function ReporteGerencialPage() {
  // Datos estáticos ajustados
  const kpis = {
    ventasDelDia: {
      titulo: "Ventas del Día",
      valor: "$4,500.00",
      cambio: "+12.5%",
      abs: "+$500.00",
      comparacion: "vs ayer",
      isPositive: true,
    },
    pedidosActivos: {
      titulo: "Pedidos Activos",
      valor: "1,250",
      cambio: "+2.1%",
      abs: "+26 ped.",
      comparacion: "vs ayer",
      isPositive: true,
    },
    alertasDeStock: {
      titulo: "Alertas de Stock",
      valor: "35",
      cambio: "+15.2%",
      abs: "+5 ítems",
      comparacion: "vs sem ant.",
      isPositive: false,
    },
    personalEnTurno: {
      titulo: "Personal en Turno",
      valor: "20",
      cambio: "-9.0%",
      abs: "-2 pers.",
      comparacion: "vs turno ant.",
      isPositive: false,
    },
  };

  const topProductos = [
    { name: "Zapatillas Urbanas", units: 50 },
    { name: "Camiseta Algodón", units: 40 },
    { name: "Pantalón Denim", units: 35 },
    { name: "Gorra Deportiva", units: 30 },
    { name: "Bolso de Mano", units: 25 },
  ];

  return (
    // Contenedor principal que ocupa toda la pantalla y distribuye en flexbox (Sidebar + Contenido)
    <div className="flex min-h-screen bg-[#FAFAFA] font-body">
      
      {/* --- COLUMNA IZQUIERDA: SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200/60 flex-shrink-0 flex flex-col hidden md:flex">
        {/* Logo / Título del Sidebar */}
        <div className="p-8 pb-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">The Atelier</p>
          <p className="text-sm font-serif italic text-slate-900 mt-1">Management</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 space-y-1 mt-6">
          
          {/* Opción Activa: Dashboard */}
          <button className="w-full flex items-center gap-4 px-4 py-3 bg-slate-50 text-slate-900 rounded-lg border border-slate-100 transition-all">
            <span className="material-symbols-outlined text-xl text-slate-700">dashboard</span>
            <span className="text-sm font-medium tracking-wide">Dashboard</span>
          </button>
          
          {/* Opción: Inventario */}
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">inventory_2</span>
            <span className="text-sm font-medium tracking-wide">Inventario</span>
          </button>
          
          {/* Opción: Ventas */}
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">point_of_sale</span>
            <span className="text-sm font-medium tracking-wide">Ventas</span>
          </button>
          
          {/* Opción: Empleados */}
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">badge</span>
            <span className="text-sm font-medium tracking-wide">Empleados</span>
          </button>
          
        </nav>

        {/* Sección inferior del Sidebar (Configuración / Logout) */}
        <div className="p-4 border-t border-slate-100">
           <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm font-medium tracking-wide">Configuración</span>
          </button>
        </div>
      </aside>


      {/* --- COLUMNA DERECHA: CONTENIDO PRINCIPAL --- */}
      {/* El flex-1 asegura que tome el resto del espacio y overflow-y-auto permite scrollear solo el reporte */}
      <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Encabezado Editorial */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 pb-8 border-b border-slate-200/60 pt-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight">Reporte Gerencial</h1>
              <p className="text-slate-400 text-sm mt-3 font-light tracking-wide">Visión general del rendimiento operativo</p>
            </div>
            
            <div className="mt-8 xl:mt-0 flex items-center gap-6">
              <div className="text-sm text-slate-500 font-medium tracking-wide">
                09 / 04 / 26
              </div>
              <button className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-900 border border-slate-300 px-6 py-3 hover:bg-slate-900 hover:text-white transition-all duration-300">
                <span>Hoy</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          </div>

          {/* Cuadrícula de KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {Object.entries(kpis).map(([key, kpi]) => (
              <div key={key} className="bg-white p-8 border border-slate-100 hover:border-slate-200 transition-colors duration-300 flex flex-col justify-between">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">{kpi.titulo}</h3>
                
                <div>
                  <p className="text-4xl font-light text-slate-900 mb-4">{kpi.valor}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 ${kpi.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {kpi.cambio}
                    </span>
                    <span className="text-xs text-slate-400">
                      {kpi.abs} {kpi.comparacion}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sección Detallada (Asimétrica) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
            
            {/* Panel Izquierdo: Ventas Mensuales */}
            <div className="bg-white p-10 border border-slate-100 xl:col-span-2 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-lg font-serif text-slate-900 mb-1">Ventas Mensuales</h2>
                  <p className="text-sm text-slate-400">Rendimiento acumulado del periodo</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-slate-900">$120,500.00</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end min-h-[250px] relative mt-4">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent border-b border-slate-100"></div>
                <p className="text-center text-slate-300 text-sm font-medium uppercase tracking-widest relative z-10 mb-10">
                  [ Visualización de Datos ]
                </p>
              </div>
            </div>

            {/* Panel Derecho: Top Productos */}
            <div className="bg-white p-10 border border-slate-100">
              <h2 className="text-lg font-serif text-slate-900 mb-8">Top 5 Productos Vendidos</h2>
              
              <div className="space-y-6">
                {topProductos.map((product, index) => (
                  <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-serif italic text-slate-300 w-4">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 font-light">
                      {product.units}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-slate-100">
                 <button className="text-xs font-semibold tracking-wider uppercase text-slate-500 hover:text-slate-900 transition-colors w-full text-left flex items-center gap-2">
                   Ver inventario completo 
                   <span className="material-symbols-outlined text-sm">arrow_forward</span>
                 </button>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}