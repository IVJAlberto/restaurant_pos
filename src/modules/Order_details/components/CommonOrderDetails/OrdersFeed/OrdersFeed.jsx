import React from "react";
import DishOrder from "./components/DishOrder/DishOrder";
import { useSelector} from 'react-redux';
import emptyCart from "../../../../../assets/stickers/nothing_in_cart.png"

const OrdersFeed = () => {
  const platillos = useSelector((state) => state.OrdersFeed.PlatillosSeleccionados);

    return (
      <div className="px-3 py-4 bg-zinc-300 dark:bg-zinc-900 rounded-2xl mx-2 basis-4/12">
        <div className="overflow-y-scroll scroll-styling h-96">
            <div className="space-y-3.5 px-3 h-full">
            {platillos.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full space-y-4">
                <img src={emptyCart} className="h-64" alt="Logo" />
                <div className="space-y-1">
                  <p className="text-center text-zinc-950 dark:text-gray-300 text-xl font-semibold underline underline-offset-3 decoration-2 decoration-green-500">Tu carrito está vacío!</p>
                  <p className="text-xs text-center text-zinc-950 dark:text-gray-400">Agrega algo a tu carrito en el catálogo de Comida y Bebidas.</p>
                </div>
              </div>
            ) : (
              platillos.map((platillo, index) => (
                <DishOrder key={index} platillo={platillo} />
              ))
            )}
            </div>
        </div>
      </div>
    );
  };

export default OrdersFeed;