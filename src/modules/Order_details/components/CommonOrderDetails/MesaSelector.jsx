import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { onValue, ref } from "firebase/database";

import { database } from "../../../../firebase_config";
import { toggleVisibility } from "../../slices/MesaSeleccionSlice";

const MesaSelector = ({ origen = "carrito" }) => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);

    const [mesaEstado, setMesaEstado] = useState("libre");
    const [tieneActualizaciones, setTieneActualizaciones] = useState("pendiente");
    
    useEffect(() => {
        if (!mesaSeleccionada) {
            setMesaEstado("libre");
            setTieneActualizaciones("pendiente");
            return;
        }

        const mesaRef = ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`);

        const unsubscribe = onValue(mesaRef, (snapshot) => {
            const data = snapshot.val();

            if (!data) {
            setMesaEstado("libre");
            setTieneActualizaciones("pendiente");
            return;
            }

            setMesaEstado(data.estadoMesa || "libre");

            const ordenes = data.ordenPendiente || [];

            let nuevoEstado = "pendiente";

            if (ordenes.some((item) => item.estadoPlatillo === "listo"))
                nuevoEstado = "listo";
            else if (ordenes.some((item) => item.estadoPlatillo === "preparando"))
                nuevoEstado = "preparando";
            else if (ordenes.some((item) => item.estadoPlatillo === "pendiente"))
                nuevoEstado = "pendiente";

            setTieneActualizaciones(nuevoEstado);
        });

        return () => unsubscribe();
    }, [mesaSeleccionada]);

    return (
        <div className="px-7 py-4 md:py-7 font-semibold flex flex-col space-y-3 h-full justify-center">
            <div className={`flex items-center justify-between ${origen === "carrito" ? "w-full" : "gap-2"}`}>
                <div className="flex items-center space-x-2">
                    <div className={`
                        w-3 h-3 rounded-full 
                        ${mesaEstado === "libre" ? "bg-emerald-500" : ""}
                        ${mesaEstado === "ocupada" ? 
                            tieneActualizaciones === "preparando" ? "bg-yellow-500 animate-pulse" :
                            tieneActualizaciones === "listo" ? "bg-purple-500 animate-pulse" : "bg-red-500" 
                            : ""}
                    `}>
                    </div>
                    <p className="text-lg font-bold">
                        Mesa {mesaSeleccionada || 'No seleccionada'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        dispatch(toggleVisibility())
                    }
                    }
                    className="p-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                    {origen === "carrito" ? "Cambiar mesa" : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="4" fill="currentColor"/>
                        </svg>
                    }
                </button>
            </div>
        </div>
    );
};

export default MesaSelector;
