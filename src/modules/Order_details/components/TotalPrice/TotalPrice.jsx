import React from "react";
import { useSelector } from "react-redux";

const TotalPrice = () => {
    let precio = useSelector((state) => state.OrdersFeed.totalPedido);
    let propina = ((precio/100)*10).toFixed(2);
    precio = precio.toFixed(2);
    let total = (parseFloat(precio) + parseFloat(propina)).toFixed(2);


    return(
        <div className="flex flex-col bg-zinc-300 dark:bg-zinc-900 rounded-2xl m-2 px-7 py-4 space-y-5 basis-2/12">
            <div className="flex flex-row justify-between">
                <p className="text-zinc-950 dark:text-gray-300 font-semibold">Subtotal</p>
                <p className="text-black dark:text-white">${precio}</p>
            </div>
            <div className="flex flex-row justify-between">
                <p className="text-zinc-950 dark:text-gray-300 font-semibold">Propina</p>
                <p className="text-black dark:text-white">${propina}</p>
            </div>
            <hr className="border border-zinc-950 dark:border-gray-300"/>
            <div className="flex flex-row justify-between">
                <p className="text-zinc-950 dark:text-gray-300 font-semibold">Total</p>
                <p className="text-black dark:text-white">${total}</p>
            </div>
        </div>
    );
}

export default TotalPrice;