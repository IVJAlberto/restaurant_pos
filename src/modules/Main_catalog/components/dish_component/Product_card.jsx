import React from "react";
import AddReduceBtn from "../../../../UI/AddReduceBtn";
import { useDispatch } from "react-redux";
import { agregarPlatillo } from "../../../Order_details/slices/OrdersFeedSlice";

import toast, { Toaster } from "react-hot-toast";
import Toast from "../../../../UI/Toast";

const ProductCard = ({ platillo }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(agregarPlatillo(platillo));
    toast.custom(<Toast type="platillo"/>,{
      duration: 1000,
      position: 'bottom-center',
    });
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="relative flex items-center justify-center h-40 overflow-hidden rounded-2xl">
        <span className={` absolute bg-blur backdrop-filter bg-white/50 backdrop-blur-sm rounded-full px-3.5 py-1.5 bottom-4 left-4 text-black font-medium
           ${platillo.disponible 
          ? "bg-green-400/70 text-green-900" 
          : "bg-red-400/70 text-red-900"}`}>
          {platillo.disponible ? "Disponible" : "Agotado"}
        </span>
        <img src={platillo.imagen} alt="Product" className="h-full" />
      </div>
      <div className="flex flex-col flex-1 justify-between text-zinc-950 dark:text-gray-300 px-1 space-y-1">
        <div className="space-y-1">
          <p className="text-sm md:text-base font-semibold">{platillo.nombre}</p>
          <p className="text-gray-500 dark:text-zinc-400 text-xs md:text-sm">{platillo.descripcion}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">$ {platillo.precio}</p>
          <AddReduceBtn 
            action="+" 
            bgColor={platillo.disponible 
              ? "bg-zinc-200 dark:bg-zinc-700" 
              : "bg-zinc-100 dark:bg-zinc-800 opacity-50 cursor-not-allowed"} 
            onClick={platillo.disponible ? handleAddToCart : undefined}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};
  
export default ProductCard;