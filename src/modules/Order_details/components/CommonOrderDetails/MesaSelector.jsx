import React from "react";
import { useSelector } from "react-redux";
import { toggleVisibility } from "../../slices/MesaSeleccionSlice";
import { useDispatch } from "react-redux";

const MesaSelector = () => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);

    return (
        <div className="px-7 py-4 md:py-7 font-semibold flex flex-col space-y-3 h-full justify-center">
            <div className="flex justify-between items-center">
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-1"
                >
                    Cambiar mesa
                </button>
            </div>
        </div>
    );
};

export default MesaSelector;
