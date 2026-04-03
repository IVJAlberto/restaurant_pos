import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTableNumber } from "../Order_details/slices/OrderInformation";
import { toggleVisibility } from "../Order_details/slices/MesaSeleccionSlice";
import { database } from "../../firebase_config";
import { ref, onValue } from "firebase/database";
import CloseBtn from "../../UI/CloseBtn";
import TextHeader from "../../UI/textHeader";

const ModalMesa = () => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);
    const isVisible = useSelector(state => state.MesaSeleccion.isVisible);
    const [mesas, setMesas] = useState({});

    useEffect(() => {
        
        if (!isVisible) return;
        const mesasRef = ref(database, 'ordenesPorMesa');
        const unsubscribe = onValue(mesasRef, (snapshot) => {
            const data = snapshot.val() || {};
            setMesas(data);
            const ordenes = [];
            
            Object.values(data).forEach(mesa => {
                if (mesa.ordenPendiente) {
                    ordenes.push(...mesa.ordenPendiente);
                }
            });
            // console.log("Ordenes", ordenes);
        });
        return () => unsubscribe();
    }, [isVisible]);

    const handleSeleccionarMesa = (numeroMesa) => {
        dispatch(setTableNumber(numeroMesa));
        dispatch(toggleVisibility());
    };

    const getMesaEstadoClass = (estado, seleccionada, orden) => {
        const baseClasses = "rounded-lg py-3 text-sm font-bold transition-all duration-200 transform hover:scale-105 group text-white shadow-lg border-2";
        
        if (seleccionada) {
            return `${baseClasses} bg-orange-400 text-white shadow-xl border-4 border-orange-500 ring-2 ring-orange-300`;
        }
        // console.log("Orden",orden);
        
        switch (estado) {
            case "limpiando": return `${baseClasses} bg-yellow-400 text-white shadow-lg border-2 border-yellow-500 hover:bg-yellow-500`;
            case "libre": return `${baseClasses} bg-emerald-400 text-white shadow-lg border-2 border-emerald-500 hover:bg-emerald-500`;
            case "ocupada": return `${orden === "listo" ? `${baseClasses} bg-purple-500` 
                                                : orden === "preparando" ? `${baseClasses} bg-yellow-500` 
                                                : orden === "pendiente" ? `${baseClasses} bg-red-500` : `${baseClasses} bg-emerald-500`}`;
            default: return `${baseClasses} bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 border border-zinc-300`;
        }
    };

    if (!isVisible) return null;

    
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-black bg-opacity-60 absolute inset-0"></div>
            <div className="bg-zinc-200 dark:bg-stone-950 w-full md:w-8/12 lg:w-6/12 absolute right-0 h-full flex flex-col overflow-hidden">
                <div className="h-20 flex-shrink-0 flex items-center justify-between p-5 bg-zinc-300 dark:bg-zinc-900">
                    <TextHeader text="Seleccionar Mesa" color="text-zinc-950 dark:text-gray-300" size="text-xl" />
                    <CloseBtn onClick={() => dispatch(toggleVisibility())} />
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                            <span>Estado en tiempo real</span>
                            <span className="font-mono">({Object.keys(mesas).length} mesas)</span>
                        </div>
                        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 p-6 bg-gradient-to-br from-white/70 to-zinc-100 dark:from-zinc-900/70 dark:to-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700">
                            {Object.entries(mesas).sort(([a], [b]) => 
                                parseInt(a.replace('mesa', '')) - parseInt(b.replace('mesa', ''))
                            ).map(([key, mesaData]) => {
                                const numeroMesa = key.replace('mesa', '');
                                const estaSeleccionada = mesaSeleccionada === numeroMesa;
                                const estado = mesaData?.estadoMesa || 'libre';
                                const total = mesaData?.granTotal || 0;
                                const estadoOrden = mesaData?.ordenPendiente?.find(item =>
                                    ["listo", "preparando", "pendiente"].includes(item.estadoPlatillo)
                                )?.estadoPlatillo ?? null;
                                
                                return (
                                    <button
                                        key={numeroMesa}
                                        onClick={() => handleSeleccionarMesa(numeroMesa)}
                                        className={getMesaEstadoClass(estado, estaSeleccionada, estadoOrden)}
                                        title={`Mesa ${numeroMesa}: ${estado}\nTotal: $${total}`}
                                    >
                                        <div className="flex flex-col justify-center gap-1 items-center space-y-1 p-1">
                                            <span className="font-bold text-base">{numeroMesa}</span>
                                            {estado !== 'libre' && (
                                                <span className="w-2 h-2 bg-white rounded-full shadow-sm"></span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMesa;
