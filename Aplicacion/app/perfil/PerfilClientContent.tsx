"use client";

import { useEffect, useState } from "react";
import PerfilForm from "./PerfilForm";
import { CloseLoginAction } from "@/share/closeSession";
import WelcomeModal from "./BienvenidaModal";
import EnvioTab from "./EnvioTab";

type TabType = "datos" | "pedidos" | "direcciones" | "pagos" | "seguridad";

interface Props {
    userData: {
        nombre: string;
        email: string;
        telefono: string;
        fechaNacimiento: string;
        rfc: string;
        puntos: number;
        numeroTarjeta: string;
    };
}

export default function PerfilClientContent({ userData }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>("datos");
    const [puntos, setPuntos] = useState(0);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        const yaVio = localStorage.getItem("bienvenidaMostrada");
        if (!yaVio) {
            setPuntos(0);
            const t = setTimeout(() => {
                setMostrarModal(true);
            }, 1500);
            return () => clearTimeout(t);
        }
        setPuntos(userData.puntos);
    }, []);

    const getTabClass = (tabName: TabType) => {
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${activeTab === tabName
            ? "bg-slate-900 text-white font-medium"
            : "text-slate-600 hover:bg-slate-100"
            }`;
    };

    const cerrarModal = () => {
        localStorage.setItem("bienvenidaMostrada", "true");
        setMostrarModal(false);
        setPuntos(userData.puntos);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {mostrarModal && ( <WelcomeModal nombre={userData.nombre} puntosReales={userData.puntos} onFinish={cerrarModal}/>)}

            {/* SIDEBAR */}
            <aside className="w-full md:w-64 flex-shrink-0">

                {/* TARJETA DE LEALTAD */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-5 mb-4 text-white shadow-md">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
                            Monedero Atelier
                        </p>
                        <span className="material-symbols-outlined text-white/60">loyalty</span>
                    </div>
                    <p className="text-4xl font-bold tracking-tight">
                        {puntos}
                        <span className="text-lg font-medium opacity-70 ml-1">pts</span>
                    </p>
                    <p className="text-xs font-mono mt-3 opacity-50 tracking-wider">
                        {userData.numeroTarjeta}
                    </p>
                </div>

                {/* AVATAR */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-3xl">person</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 truncate w-32">{userData.nombre}</h2>
                        <p className="text-sm text-slate-500">Miembro Atelier</p>
                    </div>
                </div>

                {/* NAV */}
                <nav className="flex flex-col gap-1">
                    <button onClick={() => setActiveTab("datos")} className={getTabClass("datos")}>
                        <span className="material-symbols-outlined">badge</span> Mis Datos
                    </button>
                    <button onClick={() => setActiveTab("pedidos")} className={getTabClass("pedidos")}>
                        <span className="material-symbols-outlined">local_shipping</span> Mis Envíos
                    </button>
                    <button onClick={() => setActiveTab("direcciones")} className={getTabClass("direcciones")}>
                        <span className="material-symbols-outlined">location_on</span> Direcciones
                    </button>
                    <button onClick={() => setActiveTab("pagos")} className={getTabClass("pagos")}>
                        <span className="material-symbols-outlined">credit_card</span> Pagos
                    </button>
                    <button onClick={() => setActiveTab("seguridad")} className={getTabClass("seguridad")}>
                        <span className="material-symbols-outlined">lock</span> Seguridad
                    </button>
                    <div className="h-px bg-slate-200 my-4"></div>
                    <button
                        onClick={() => CloseLoginAction()}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span> Cerrar Sesión
                    </button>
                </nav>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <section className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[600px]">
                {activeTab === "datos" && <PerfilForm initialData={userData} />}
                {activeTab === "pedidos" && <EnvioTab saleIds={[]} />}

                {activeTab !== "datos" && activeTab !== "pedidos" && (
                    <div className="text-center py-20 text-slate-400">
                        <p>Contenido de {activeTab} en desarrollo...</p>
                    </div>
                )}
            </section>
        </div>
    );
}