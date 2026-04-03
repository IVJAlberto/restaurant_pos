import React from "react";
import CheckoutImg from "../assets/common_icons/checkout.png"

import { useDispatch, useSelector } from 'react-redux';
import { toggleVisibility } from "../modules/Order_details/slices/OrderDetailsSlice";

const CheckoutBtn = ({ displayOnBig }) => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);
    let numeroPlatillosEnCarrito = useSelector(
      (state) => state.OrdersFeed.ordenesPorMesa?.[mesaSeleccionada]?.PlatillosSeleccionados?.length || 0
    );
    numeroPlatillosEnCarrito = numeroPlatillosEnCarrito.length;
  
    const handleCheckoutClick = () => {
      dispatch(toggleVisibility());
    };
  
    let styling =
      "duration-100 p-2 rounded cursor-pointer hover:bg-zinc-300 dark:hover:bg-stone-800 hover:bg-zinc-300 dark:hover:bg-zinc-800" +
      (displayOnBig ? " hidden md:block " : "block md:hidden ");
    return (
      <div className={styling} onClick={handleCheckoutClick}>
        <div className="relative">
          <span className="absolute top-0 right-0 bg-red-500 text-white font-semibold rounded-full text-xs md:text-sm py-0 px-0.5 md:py-0.5 md:px-1">
                {numeroPlatillosEnCarrito}
          </span>
          <img className="w-8 md:w-10 md:h-10" src={CheckoutImg} alt="Checkout" />
        </div>
      </div>
    );
  };

export default CheckoutBtn;