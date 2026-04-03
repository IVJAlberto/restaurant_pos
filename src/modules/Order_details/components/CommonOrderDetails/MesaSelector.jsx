import React from "react";
import { useSelector } from "react-redux";
import { toggleVisibility } from "../../slices/MesaSeleccionSlice";
import { useDispatch } from "react-redux";

const MesaSelector = ({ origen = "carrito" }) => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);

    return (
        <div className="px-7 py-4 md:py-7 font-semibold flex flex-col space-y-3 h-full justify-center">
            <div className={`flex items-center justify-between ${origen === "carrito" ? "w-full" : "gap-2"}`}>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
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
