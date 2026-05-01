import Image from "next/image";
import RegistroForm from "./RegistroForm";

export default function Home() {
    return (
        <main className="flex-grow flex flex-col md:flex-row min-h-screen">
            {/* Sección Izquierda: Imagen y Mensaje */}
            <aside className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary-container">
                {/* Usando el componente Image de Next.js para optimización */}
                <img
                    alt="Luxury store interior"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWZGE5Hb5AfS2DA9LHqUO1dbWSBFiFTSsrrj4rXRINLT6wPSEY6by1wPVGf4I_QXfwGlWVXvv9P07ss1EyV-qhtW84BEPf9sEq1n-jxQogLPdm5EDELf-KszXY9Q1btkw11_YMwtAgTI1m8nizK3b53RjjpegYAgvVumdRSKPSvnvhNYIfPH7Vi8yfX_W9wKBg7avqGG405NMVtN8e57BcvPuJkJCURR5w-8WQk2XgqJDu6qlhvHzpKlcqP8UXmgytR4UpkECzXdc"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-end p-20 text-white">
                    <span className="font-label tracking-[0.2em] mb-4 uppercase text-xs text-tertiary-fixed-dim">
                        La tienda de lujo definitiva en línea 
                    </span>
                    <h1 className="font-headline text-5xl lg:text-7xl italic leading-tight mb-8">
                        Eleva tu <br />estilo de vida.
                    </h1>
                    <p className="max-w-md font-light leading-relaxed text-lg">
                        Unete a una comunidad exclusiva dedicada al arte de la vida de alto lujo y exclusividad.
                    </p>
                </div>
            </aside>

            {/* Sección Derecha: Formulario de Registro */}
            <section className="flex-1 flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24 bg-surface">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10">
                        <span className="text-4xl font-headline italic tracking-tighter text-on-surface">The Luxury store</span>
                        <h2 className="font-headline text-3xl text-on-surface mb-2 mt-8 tracking-tight">Crea tu cuenta</h2>
                        <p className="text-on-surface-variant text-sm">Vuelvete miembro de nuestra comunidad exclusiva y comienza a disfrutar de los beneficios.</p>
                    </div>

                   <RegistroForm/>

                    {/* Divisor */}
                    <div className="relative my-10 flex items-center py-2">
                        <div className="flex-grow border-t border-outline-variant/10"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-label tracking-widest text-on-surface-variant/40 uppercase">O continuar con...</span>
                        <div className="flex-grow border-t border-outline-variant/10"></div>
                    </div>

                    {/* Botones Sociales Sincronizados */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform text-on-surface">
                                google
                            </span>
                            <span className="text-sm font-medium text-on-surface">Google</span>
                        </button>

                        <button className="flex items-center justify-center gap-3 py-3 border border-outline-variant/20 rounded-lg bg-white hover:bg-gray-50 transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>
                                apple
                            </span>
                            <span className="text-sm font-medium text-on-surface">Apple</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}