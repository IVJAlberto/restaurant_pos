
import { useEffect, useState, useRef } from "react"
import DishOrder from "./DishOrder/DishOrder"

const OrdenEnCarrito = ({carritoLocal, totalCarrito, normalizarPlatillo}) => {
    const [carritoAbierto, setCarritoAbierto] = useState(true);
    const [alturaContenido, setAlturaContenido] = useState("auto");
    const contentRef = useRef(null);
    
    useEffect(() => {
      if (!contentRef.current) return;

        if (carritoAbierto) {
            setAlturaContenido(`${contentRef.current.scrollHeight}px`);
        } else {
            setAlturaContenido("0px");
        }
    }, [carritoLocal, carritoAbierto]);
    

    return (
        <div className="bg-primary-foreground p-3 rounded-xl">

            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setCarritoAbierto(!carritoAbierto)}
                    className="flex-1 text-left font-semibold text-black p-2 rounded-lg transition-all"
                >
                    <span>Carrito ({carritoLocal.length}) ${totalCarrito.toFixed(2)}</span>
                    <span className={`ml-2 transition-transform `}>
                    {
                        carritoAbierto ? (
                        <span className="ml-2 text-sm font-normal">▲</span>
                        ) : (
                        <span className="ml-2 text-sm font-normal">▼</span>
                        )
                    }
                    </span>
                </button>
            </div>

            <div style={{ height: alturaContenido }}
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
            >
                <div ref={contentRef} 
                    className={`space-y-2 mt-1 pl-4 border-l-2 border-primary transition-all duration-300 ease-in-out 
                    ${carritoAbierto ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`
                }
                >
                    {carritoLocal.map((platillo, i) => (
                        <DishOrder key={`local-${i}`} platillo={normalizarPlatillo(platillo, 'local')} origen="local" />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default OrdenEnCarrito