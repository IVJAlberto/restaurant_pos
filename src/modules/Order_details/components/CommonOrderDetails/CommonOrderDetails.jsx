import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTableNumber } from "../../slices/OrderInformation";

const CommonOrderDetails = () => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);

    const handleSeleccionarMesa = (numeroMesa) => {
        dispatch(setTableNumber(numeroMesa));
    }

    return(
        <div className="px-7 py-4 md:py-7 font-semibold flex flex-col space-y-3 ">
            {/* Título */}
            <p className="flex justify-center text-zinc-950 dark:text-gray-300 text-lg ">
                Mesa {mesaSeleccionada ? mesaSeleccionada : <span className="text-zinc-400 text-sm font-normal flex flex-wrap content-center px-2">x</span>}
            </p>

            {/* Grid de mesas */}
            <div className="grid grid-cols-5 gap-2">
                {[...Array(15)].map((_, i) => {
                    const numeroMesa = i + 1;
                    const estaSeleccionada = mesaSeleccionada === numeroMesa;
                    return (
                        <button
                            key={numeroMesa}
                            onClick={() => handleSeleccionarMesa(numeroMesa)}
                            className={`rounded-lg py-2 text-sm font-semibold transition-colors duration-150
                                ${estaSeleccionada
                                    ? "bg-orange-400 text-white"
                                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-950 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                                }`}
                        >
                            {numeroMesa}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CommonOrderDetails;
