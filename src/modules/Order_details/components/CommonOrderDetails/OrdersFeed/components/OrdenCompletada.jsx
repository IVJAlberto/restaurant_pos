import React, { useState, useRef, useEffect } from 'react'

import DishOrder from "./DishOrder/DishOrder";

const OrdenCompletada = ({ ordenesCompletadas, cantidadPlatillosCompletados , totalCompletados}) => {
    const [servidosAbierto, setServidosAbierto] = useState(false);
    const [alturaContenido, setAlturaContenido] = useState("auto");
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;

        if (servidosAbierto) {
        setAlturaContenido(`${contentRef.current.scrollHeight}px`);
        } else {
        setAlturaContenido("0px");
        }
    }, [servidosAbierto, ordenesCompletadas]);

    return (
        <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl">
            <button
            onClick={() => setServidosAbierto(!servidosAbierto)}
            className="w-full flex items-center justify-between text-left font-semibold text-green-700 mb-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-all"
            >
            <span>Servidos ({cantidadPlatillosCompletados}) ${totalCompletados}</span>
            <span className={`transition-transform`}>
                {
                servidosAbierto ? (
                    <span className="ml-2 text-sm font-normal">▲</span>
                ) : (
                    <span className="ml-2 text-sm font-normal">▼</span>
                )
                }
            </span>
            </button>
            <div 
                style={{ height: alturaContenido }}
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
            >
                <div 
                    ref={contentRef}
                    className="space-y-2  pl-4 border-l-2 border-green-300">
                    {ordenesCompletadas.map((platillo, i) => (
                    <DishOrder key={`comp-${i}`} platillo={platillo} origen="completado" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrdenCompletada;