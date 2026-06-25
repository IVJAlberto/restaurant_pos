import React from "react";
import AddReduceBtn from "../../../../../../../UI/AddReduceBtn"
import { eliminarPlatillo, agregarPlatillo, eliminarTodosLosPlatillos, actualizarNotasPlatillo } from "../../../../../slices/OrdersFeedSlice";
import { useDispatch, useSelector } from "react-redux";

const DishOrder = ({ platillo, origen="local" }) => {
    const dispatch = useDispatch();
    const mesaSeleccionada = useSelector(state => state.OrderTotal.table);

    const handleRemoveFromCart = (nombrePlatillo) => {
        dispatch(eliminarPlatillo({ mesaId: mesaSeleccionada, nombrePlatillo }));
    }

    const handleAddToOrder = () => {
        dispatch(agregarPlatillo({ mesaId: mesaSeleccionada, platillo }));
    }

    const handleRemoveAllFromCart = () => {
        dispatch(eliminarTodosLosPlatillos({ mesaId: mesaSeleccionada, nombrePlatillo: platillo.nombre }));
    }

    const handleNotasChange = (e) => {
        const nuevasNotas = e.target.value;
        dispatch(actualizarNotasPlatillo({ 
        mesaId: mesaSeleccionada,
        nombre: platillo.nombre, 
        notas: nuevasNotas 
        }));
    };

    return(
        <div className={`rounded-2xl  py-3.5 px-5 space-y-5 shadow-md border border-primary
            ${ 
                origen === "pendiente" 
                    ? platillo.estadoPlatillo === "pendiente" 
                        ? "bg-primary/75 border-red-400" 
                        : platillo.estadoPlatillo === "preparando" 
                        ? "bg-yellow-400/80 border-yellow-500" 
                        : platillo.estadoPlatillo === "listo" 
                            ? "bg-purple-400/80 border-purple-500" 
                            : "bg-primary/75"
                    : origen === "completado"
                        ? "bg-green-400 dark:bg-green-800 border-green-500"
                        : "bg-primary/75"

            }
            `
        }>
            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <p className="flex text-primary-foreground text-xl font-medium">{platillo.nombre}
                        {
                            origen !== "local" && (
                                <span className="text-base text-primary-foreground ml-2">(x{platillo.cantidad})</span>
                            )
                        }
                    </p>
                   <div>
                     {
                        origen === "local" ?
                            <svg onClick={handleRemoveAllFromCart} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-foreground  hover:text-secondary duration-150 cursor-pointer">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        :
                            <span className="text-md font-medium">
                                {
                                    platillo.estadoPlatillo === "pendiente" ? "Pendiente" :
                                    platillo.estadoPlatillo === "preparando" ? "Preparando" :
                                    platillo.estadoPlatillo === "listo" ? "Listo" : ""
                                }
                            </span>
                     }
                   </div>
                </div>
                {
                    origen === "local" ?
                    <p className="text-primary-foreground text-xl font-medium">$ {platillo.precioUnitario || platillo.precio}</p>
                        :
                    <p className="text-primary-foreground text-xl font-medium">$ {platillo.precioUnitario * platillo.cantidad}</p>
                }
            </div>
            {
                origen === "local" ? 
                    <div className="w-full flex flex-col gap-2">
                        <input
                                type="text"
                                value={platillo.notas || ''}
                                placeholder="Notas: sin cebolla, poca sal..."
                                onChange={handleNotasChange}
                                className="w-full px-3 py-2 text-sm bg-primary-foreground border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                maxLength={100}
                            />
                        <div className="flex flex-row space-x-3">
                            <AddReduceBtn action="+" color="text-zinc-800 dark:text-white" bgColor="bg-primary-foreground" hoverBg="hover:bg-secondary" onClick={() => handleAddToOrder(platillo)}/>
                            <p className="flex items-center text-primary-foreground font-semibold">{platillo.cantidad}</p> 
                            <AddReduceBtn action="-" color="text-zinc-800 dark:text-white" bgColor="bg-primary-foreground" hoverBg="hover:bg-secondary" onClick={() => handleRemoveFromCart(platillo.nombre)}/>
                        </div>
                    </div>
                :
                    platillo.notas && <p className="text-sm text-black bg-primary-foreground pl-1 rounded-lg ">Notas: {platillo.notas}</p>
            }
        </div>
    );
}

export default DishOrder;