import React from "react";
import CloseBtn from "../../UI/CloseBtn";
import TextHeader from "../../UI/textHeader";
import MesaSelector from "./components/CommonOrderDetails/MesaSelector";
import OrdersFeed from "./components/CommonOrderDetails/OrdersFeed/OrdersFeed";
import OrderActions from "./components/OrderActions/OrderActions";

import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { toggleVisibility } from "./slices/OrderDetailsSlice";

const OrderDetails = () => {
    const dispatch = useDispatch();

    const handleCheckoutClick = () => {
        dispatch(toggleVisibility());
    };

    const isVisible = useSelector((state) => state.OrderDetails.isVisible);

    if(!isVisible) {
        return(null);
    }

    return(
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-black bg-opacity-60 absolute inset-0 z-0"></div>
            <div className="bg-zinc-200 dark:bg-stone-950 w-full md:w-6/12 absolute right-0 h-full flex flex-col">
                {/* Header fijo */}
                <div className="h-20 flex-shrink-0 flex items-center justify-between p-5 bg-zinc-300 dark:bg-zinc-900">
                    <TextHeader text="Detalles de orden" color="text-zinc-950 dark:text-gray-300" size="text-lg xl:text-xl"></TextHeader>
                    <CloseBtn onClick={handleCheckoutClick} />
                </div>
                
                {/* CommonOrderDetails: 15% del contenedor total */}
                <div className="h-[10%] min-h-0 flex-shrink-0 p-4 overflow-hidden">
                    <MesaSelector/>   
                </div>
                
                {/* OrdersFeed: flex-grow con scroll interno */}
                <div className="flex-1 overflow-auto p-4">
                    <OrdersFeed />
                </div>
                
                {/* OrderActions: 20% fijo abajo */}
                <div className="h-[10%] min-h-0 flex-shrink-0">
                    <OrderActions />
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
