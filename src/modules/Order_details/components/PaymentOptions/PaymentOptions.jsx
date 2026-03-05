import React from "react";
import PaymentBtn from "../../../../UI/PaymentBtn";
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../../slices/toggleModalSlice';
import { toggleVisibility } from "../../slices/OrderDetailsSlice";
import { setPaymentMethod } from "../../slices/OrderInformation";

const PaymentOptions = () => {
    const dispatch = useDispatch();
    const seleccionadoMetodoPago = useSelector(state => state.OrderTotal.paymentMethod);
    let platillosVacio = useSelector(state => state.OrdersFeed.PlatillosSeleccionados);
    let mesaSeleccionada  = useSelector(state => state.OrderTotal.table)
    platillosVacio = platillosVacio.length;

    const handleToggleModal = () => {
        dispatch(toggleModal());
        dispatch(toggleVisibility());
    }

    const handlePaymentMethod = (value) => {
        dispatch(setPaymentMethod(value));
    }

    return (
        <div className="flex flex-col bg-zinc-300 dark:bg-zinc-900 mx-2 rounded-2xl p-4 space-y-4">
            <div className="flex flex-row space-x-3 justify-center">
                {["Efectivo", "TDC"].map((value, index) => (
                    <PaymentBtn
                        key={index}
                        onClick={() => handlePaymentMethod(value)}
                        className={`${
                            seleccionadoMetodoPago === value ? 'bg-zinc-900 hover:bg-zinc-900 dark:bg-slate-100 dark:hover:bg-slate-200 text-gray-300 dark:text-zinc-950' : 'text-gray-950 dark:text-zinc-200 bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                        }  basis-1/3`}
                    >
                        {value}
                    </PaymentBtn>
                ))}
            </div>
            
            <button
                onClick={handleToggleModal}
                className={`text-white bg-zinc-600 hover:bg-zinc-800 dark:text-black dark:bg-slate-100 dark:hover:bg-slate-200 duration-100 rounded-2xl font-semibold text-2xl h-14 ${
                    platillosVacio === 0 || mesaSeleccionada  == null ? 'disabled:opacity-50 disabled:pointer-events-none' : ''
                    }`}
                disabled={platillosVacio === 0 || mesaSeleccionada  == null}
            >
                <p>Realizar pedido</p>
            </button>
        </div>
    );
}

export default PaymentOptions;