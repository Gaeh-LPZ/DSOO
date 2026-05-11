import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf5] font-body text-slate-900">
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* HERO SECTION */}
        <section className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 tracking-tight mb-6">
            Nuestra Historia
          </h1>
          <p className="text-lg text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
            Fusionando la elegancia del diseño clásico con la eficiencia de la tecnología moderna para redefinir la gestión comercial.
          </p>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-slate-900">La Visión de The Atelier</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nacimos como un proyecto de Desarrollo de Sistemas Orientados a Objetos (DSOO) con un objetivo claro: simplificar la complejidad operativa. En un mundo donde la gestión de inventarios y ventas suele ser caótica, nosotros proponemos orden, claridad y belleza.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nuestro sistema no es solo una herramienta de administración; es un ecosistema diseñado para potenciar el crecimiento de tiendas locales a través de analítica en tiempo real y una experiencia de usuario excepcional.
            </p>
          </div>
          <div className="bg-white p-8 border border-slate-100 shadow-sm flex flex-col justify-center italic">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest font-semibold">Nuestra Esencia</p>
            <blockquote className="text-xl font-serif text-slate-800 leading-snug">
              "La simplicidad es la máxima sofisticación aplicada a los procesos de negocio."
            </blockquote>
          </div>
        </div>

        {/* VALORES / TECNOLOGÍA */}
        <section className="border-t border-slate-200/60 pt-16 mb-24">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 text-center mb-12">Nuestros Pilares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="material-symbols-outlined text-slate-300 text-4xl mb-4">inventory_2</span>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Control Total</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Gestión de stock inteligente y movimientos de inventario precisos.</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-slate-300 text-4xl mb-4">payments</span>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Omnicanalidad</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Pagos seguros con Stripe y múltiples métodos de pago integrados.</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-slate-300 text-4xl mb-4">loyalty</span>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Fidelización</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Sistemas de lealtad diseñados para construir relaciones duraderas con los clientes.</p>
            </div>
          </div>
        </section>

        {/* FIRMA / CRÉDITOS */}
        <footer className="text-center pt-8">
          <div className="inline-block border-t border-slate-200 px-12 pt-8">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-medium">Creado por</p>
            <p className="text-2xl font-serif italic text-slate-900">Equipo 4 DSOO</p>
            <p className="text-[10px] text-slate-400 mt-4 tracking-widest uppercase">© 2026 The Atelier Management System</p>
          </div>
        </footer>
      </main>
    </div>
  );
}