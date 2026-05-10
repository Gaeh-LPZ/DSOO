"use client";

interface Props {
    nombre: string;
}

export default function PagosTab({ nombre }: Props) {
    return (
        <div>
            <h2 className="text-2xl font-serif mb-1">Mis Pagos</h2>
            <p className="text-slate-500 text-sm mb-8">
                Información de tu tarjeta registrada en Atelier.
            </p>

            <div className="flex flex-col gap-6 max-w-sm">

                {/* ── Tarjeta negra ── */}
                <div className="relative w-full h-52 bg-[#111] rounded-2xl overflow-hidden p-7 text-white flex flex-col justify-between select-none">

                    {/* Círculos decorativos */}
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/[0.04]" />
                    <div className="absolute -bottom-14 left-10 w-56 h-56 rounded-full bg-white/[0.03]" />

                    {/* Chip */}
                    <div className="w-10 h-7 bg-[#c9963c] rounded-[4px] grid grid-cols-2 grid-rows-3 gap-[3px] p-[5px]">
                        <div className="bg-[#9a6e1e] rounded-[1px]" />
                        <div className="bg-[#9a6e1e] rounded-[1px]" />
                        <div className="col-span-2 bg-[#9a6e1e] rounded-[1px]" />
                        <div className="bg-[#9a6e1e] rounded-[1px]" />
                        <div className="bg-[#9a6e1e] rounded-[1px]" />
                    </div>

                    {/* Número fijo de prueba */}
                    <p className="font-mono text-[15px] tracking-[3px] text-white/90 z-10">
                        4242 4242 4242 4242
                    </p>

                    {/* Pie */}
                    <div className="flex justify-between items-end z-10">
                        <div>
                            <p className="text-[9px] uppercase tracking-[1.2px] text-white/40 mb-1">Titular</p>
                            <p className="text-[13px] text-white/85 tracking-wide">
                                {nombre.toUpperCase()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[1.2px] text-white/40 mb-1">Vence</p>
                            <p className="text-[13px] text-white/85 font-mono">12/34</p>
                        </div>
                        <p className="text-2xl italic font-bold text-white/80 tracking-[-1px]">VISA</p>
                    </div>
                </div>

                {/* ── Datos de solo lectura ── */}
                <div className="flex flex-col gap-3">

                    <Dato label="Titular" valor={nombre.toUpperCase()} />
                    <Dato label="Número" valor="4242 4242 4242 4242" mono />
                    <Dato label="Vencimiento" valor="12/34" mono />
                    <Dato label="CVC" valor="•••" mono />

                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>lock</span>
                    los datos de tu tarjeta están protegidos
                </p>
            </div>
        </div>
    );
}

function Dato({ label, valor, mono = false }: {
    label: string;
    valor: string;
    mono?: boolean;
}) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            <span className={`text-sm text-slate-800 ${mono ? "font-mono tracking-wider" : ""}`}>
                {valor}
            </span>
        </div>
    );
}