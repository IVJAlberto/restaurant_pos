import React from "react";
import PaymentBtn from "../../../../UI/PaymentBtn";
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../../slices/toggleModalSlice';
import { toggleVisibility } from "../../slices/OrderDetailsSlice";
import { toggleModal as togglePagoModal } from '../../slices/togglePagoSlice';
import { toggleVisibility as togglePagoVisibility } from "../../slices/PagoDetailsSlice";
import { setPaymentMethod } from "../../slices/OrderInformation";

const OrderActions = () => {
    const dispatch = useDispatch();
    const mesaSeleccionada  = useSelector(state => state.OrderTotal.table)
    let platillosVacio = useSelector(state => state.OrdersFeed.ordenesPorMesa?.[mesaSeleccionada]?.PlatillosSeleccionados?.length || 0);
    platillosVacio = platillosVacio.length;

    const handleToggleModal = () => {
        dispatch(toggleModal());
        dispatch(toggleVisibility());
    }

    const handleTogglePagoModal = () => {
        dispatch(togglePagoModal());
        dispatch(togglePagoVisibility());
    }

    return (
        <div className="flex flex-row items-center justify-center gap-4 bg-zinc-300 dark:bg-zinc-900 mx-2 rounded-2xl p-4">
            <button
                onClick={handleToggleModal}
                className={`text-white bg-zinc-600 hover:bg-zinc-800 dark:text-black dark:bg-slate-100 dark:hover:bg-slate-200 duration-100 
                rounded-2xl font-semibold text-2xl h-14 w-full
                ${platillosVacio === 0 || mesaSeleccionada == null ? 'disabled:opacity-50 disabled:pointer-events-none' : ''}
                `}
                disabled={platillosVacio === 0 || mesaSeleccionada == null}
            >
                Realizar pedido
            </button>

            <button
                onClick={handleTogglePagoModal}
                className="text-white bg-zinc-600 hover:bg-zinc-800 dark:text-black dark:bg-slate-100 dark:hover:bg-slate-200 duration-100 
                rounded-2xl font-semibold text-2xl h-14 w-full"
            >
                Realizar Cobro
            </button>
        </div>

    );
}

export default OrderActions;