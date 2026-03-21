import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTableNumber } from "../../slices/OrderInformation";
import { database } from "../../../../firebase_config";
import { ref, onValue } from "firebase/database";

const CommonOrderDetails = () => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);
    const [mesas, setMesas] = useState({});
    const [mostrarGrid, setMostrarGrid] = useState(false);

    useEffect(() => {
        const mesasRef = ref(database, 'ordenesPorMesa');
        const unsubscribe = onValue(mesasRef, (snapshot) => {
            const data = snapshot.val() || {};
            setMesas(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSeleccionarMesa = (numeroMesa) => {
        dispatch(setTableNumber(numeroMesa));
    };

    const toggleGrid = () => {
        setMostrarGrid(!mostrarGrid);
    };

    const getMesaEstadoClass = (estado, seleccionada) => {
        const baseClasses = "rounded-lg py-3 text-sm font-bold transition-all duration-200 transform hover:scale-105 group";
        
        if (seleccionada) {
            return `${baseClasses} bg-orange-400 text-white shadow-xl border-4 border-orange-500 ring-2 ring-orange-300`;
        }
        
        switch (estado) {
            case "limpiando":
                return `${baseClasses} bg-yellow-400 text-white shadow-lg border-2 border-yellow-500 hover:bg-yellow-500`;
            case "ocupada":
                return `${baseClasses} bg-red-400 text-white shadow-lg border-2 border-red-500 hover:bg-red-500`;
            case "libre":
                return `${baseClasses} bg-emerald-400 text-white shadow-lg border-2 border-emerald-500 hover:bg-emerald-500`;
            default:
                return `${baseClasses} bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 border border-zinc-300`;
        }
    };

    return (
        <div className="px-7 py-4 md:py-7 font-semibold flex flex-col space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <p className="text-lg font-bold">
                        Mesa {mesaSeleccionada || 'x'}
                    </p>
                </div>
                <button
                    onClick={toggleGrid}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                    <span>{mostrarGrid ? "Cerrar" : "Mesas"}</span>
                    <span className="text-xs">({Object.keys(mesas).length})</span>
                </button>
            </div>

            {mostrarGrid && (
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Estado en tiempo real</span>
                        <span className="font-mono text-zinc-400">10 mesas</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 p-4 bg-gradient-to-br from-white/70 to-zinc-100 dark:from-zinc-900/70 dark:to-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700">
                        {Object.entries(mesas).sort(([a], [b]) => 
                            parseInt(a.replace('mesa', '')) - parseInt(b.replace('mesa', ''))
                        ).map(([key, mesaData]) => {
                            const numeroMesa = key.replace('mesa', '');
                            const estaSeleccionada = mesaSeleccionada === numeroMesa;
                            const estado = mesaData?.estadoMesa || 'libre';
                            
                            const total = mesaData?.granTotal || 0;
                            
                            return (
                                <button
                                    key={numeroMesa}
                                    onClick={() => handleSeleccionarMesa(numeroMesa)}
                                    className={getMesaEstadoClass(estado, estaSeleccionada)}
                                    title={`Mesa ${numeroMesa}: ${estado}\nTotal: $${total}`}
                                >
                                    <div className="flex flex-row justify-center gap-1 items-center space-y-1 p-1">
                                        <span className="font-bold text-base">{numeroMesa}</span>
                                        {estado !== 'libre' && (
                                            <span className="w-2 h-2 bg-white rounded-full shadow-sm"></span>
                                        )}
                                        {/* {total > 0 && (
                                            <span className="text-xs font-mono bg-black/20 px-1 py-0.5 rounded text-white">
                                                ${total}
                                            </span>
                                        )} */}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommonOrderDetails;
