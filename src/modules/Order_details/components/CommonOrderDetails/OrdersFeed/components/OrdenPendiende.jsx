
import { useState, useRef, useEffect } from 'react';

import { ref, update, get } from 'firebase/database';
import toast from 'react-hot-toast';

import { database } from '../../../../../../firebase_config';
import DishOrder from './DishOrder/DishOrder';
import Toast from '../../../../../../UI/Toast';

const OrdenPendiende = ({ mesaData, mesaSeleccionada, ordenPendiente, totalPendiente }) => {
    const [pendientesAbierto, setPendientesAbierto] = useState(false);
    const [loadingCompletar, setLoadingCompletar] = useState(false);
    const [loadingIndividual, setLoadingIndividual] = useState({});
    const [alturaContenido, setAlturaContenido] = useState("auto");
    const contentRef = useRef(null);

    const hayPendientes = ordenPendiente.length > 0;
    const todosListos = hayPendientes && ordenPendiente.every(
        (platillo) => platillo.estadoPlatillo === "listo"
    );

    const botonCompletarTodosDeshabilitado = loadingCompletar || !todosListos;

    useEffect(() => {
        if (!contentRef.current) return;

        if (pendientesAbierto) {
        setAlturaContenido(`${contentRef.current.scrollHeight}px`);
        } else {
        setAlturaContenido("0px");
        }
    }, [pendientesAbierto, ordenPendiente]);
    

    const handleCompletarPendientes = async () => {
        if (!mesaData || ordenPendiente.length === 0) return;

        setLoadingCompletar(true);
        try {
        const mesaRef = ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`);

        // Filtros por estado
        const listosParaServir = ordenPendiente.filter(
            (p) => p.estadoPlatillo === "listo"
        );
        const restantesPendientes = ordenPendiente.filter(
            (p) => p.estadoPlatillo !== "listo"
        );

        if (listosParaServir.length === 0) {
            toast.custom(
            <Toast
                type="info"
                message="No hay platillos en estado 'listo' para entregar"
            />,
            { duration: 2000 }
            );
            return;
        }

        const completadosNuevos = listosParaServir.map((platillo) => ({
            ...platillo,
            estadoPlatillo: "servido",
            timestampServido: new Date().toISOString(),
        }));

        //Actualizar mesa
        await update(mesaRef, {
            ordenPendiente: restantesPendientes,
            totalPendiente: restantesPendientes.reduce(
            (sum, p) => sum + (p.subtotal || 0),
            0
            ),
            pedidosCompletados: [
            ...(mesaData.pedidosCompletados || []),
            ...completadosNuevos,
            ],
            totalCompletados:
            (mesaData.totalCompletados || 0) +
            completadosNuevos.reduce((sum, p) => sum + (p.subtotal || 0), 0),
            horaUltimaActualizacion: new Date().toISOString(),
            historialMeseros: [
            ...(mesaData.historialMeseros || []),
            {
                accion: "completar_pendientes",
                meseroId: "mesero001",
                nombre: "Sistema",
                timestamp: new Date().toISOString(),
            },
            ],
        });

        // Limpiar solo los platillos servidos
        const fechaPedido = new Date(listosParaServir[0].timestampCaptura)
        .toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
            const idsPlatillos = listosParaServir.map((p) => p.id);
            await eliminarPedidosCocina(idsPlatillos, fechaPedido, mesaSeleccionada);

            if (listosParaServir.length !== 0) {
                toast.custom(
                <Toast
                    type="success"
                    message={`${completadosNuevos.length} platillo(s) completados`}
                />,
                { duration: 2000 }
                );
            }
            } catch (error) {
            console.error("Error al completar pendientes:", error);
            toast.custom(
                <Toast type="error" message="Error al completar pendientes" />,
                { duration: 3000 }
            );
            } finally {
                setLoadingCompletar(false);
            }
    };

    const handleCompletarIndividual = async (platilloId) => {
        if (!mesaData) return;
        
        setLoadingIndividual(prev => ({ ...prev, [platilloId]: true }));
        
        try {
        const mesaRef = ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`);
        const platilloIndex = ordenPendiente.findIndex(p => p.id === platilloId);
        const platillo = ordenPendiente[platilloIndex];
        
        if (platilloIndex === -1) return;

        const platilloCompletado = {
            ...platillo,
            estadoPlatillo: "servido",
            timestampServido: new Date().toISOString()
        };

        const nuevosPendientes = ordenPendiente.filter(p => p.id !== platilloId);
        const nuevoTotalPendiente = nuevosPendientes.reduce((sum, p) => sum + p.subtotal, 0);

        await update(mesaRef, {
            ordenPendiente: nuevosPendientes,
            totalPendiente: nuevoTotalPendiente,
            pedidosCompletados: [...(mesaData.pedidosCompletados || []), platilloCompletado],
            totalCompletados: (mesaData.totalCompletados || 0) + platillo.subtotal,
            horaUltimaActualizacion: new Date().toISOString(),
            historialMeseros: [
            ...(mesaData.historialMeseros || []),
            { accion: "completar_platillo", meseroId: "mesero001", nombre: "Sistema", timestamp: new Date().toISOString() }
            ]
        });

        const fechaPedido = new Date(platillo.timestampCaptura)
    .toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
        await eliminarPedidosCocina([platillo.id], fechaPedido, mesaSeleccionada);

        toast.custom(<Toast type="success" message="Completado" />, { duration: 1500 });
        
        } catch (error) {
        console.error('Error:', error);
        toast.custom(<Toast type="error" message="Error al completar" />, { duration: 2000 });
        } finally {
        setLoadingIndividual(prev => ({ ...prev, [platilloId]: false }));
        }
    };

    const eliminarPedidosCocina = async (idsPlatillos, fecha, mesa) => {
        if (!idsPlatillos.length) return;
        
        const updates = {};

        const idPedido  = idsPlatillos[0].split("-")[0];

        const snapshot = await get( ref(database, `pedidosCocina/${fecha}/${mesa}-${idPedido }/platillosCocina`));
        let platillosCocina = snapshot.val() || [];

        if (idsPlatillos.length === 1 && Object.keys(platillosCocina).length > 1) {
        const idPlatillo = idsPlatillos[0];
        const path = `pedidosCocina/${fecha}/${mesa}-${idPedido }/platillosCocina/${idPlatillo}`;
        updates[path] = null;
        }else{
        const path = `pedidosCocina/${fecha}/${mesa}-${idPedido }`;
        updates[path] = null;
        }
        await update(ref(database), updates);
    };
    
    return (
    <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl">
        <div className="flex items-center justify-between mb-2">
        <button
            onClick={() => setPendientesAbierto(!pendientesAbierto)}
            className="flex-1 text-left font-semibold text-orange-700 hover:bg-gray-200 dark:hover:bg-zinc-600 p-2 rounded-lg transition-all"
        >
            <span>Pendientes ({ordenPendiente.length}) ${totalPendiente}</span>
            <span className={`ml-2 transition-transform `}>
            {
                pendientesAbierto ? (
                <span className="ml-2 text-sm font-normal">▲</span>
                ) : (
                <span className="ml-2 text-sm font-normal">▼</span>
                )
            }
            </span>
        </button>
        
        {/* BOTÓN COMPLETAR TODOS */}
        <button
            onClick={handleCompletarPendientes}
            disabled={botonCompletarTodosDeshabilitado}
            className={`ml-3 px-4 py-2 text-white font-medium rounded-lg shadow-md transition-all flex items-center space-x-1 text-sm
            ${botonCompletarTodosDeshabilitado
                ? "opacity-50 cursor-not-allowed pointer-events-none bg-zinc-800/50 select-none"
                : "bg-green-500 hover:bg-green-600"
            }`
            }
        >
            {loadingCompletar ? (
            <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </>
            ) : (
            <>
                <span>Completar Todos</span>
            </>
            )}
        </button>
        </div>

        <div 
            style={{ height: alturaContenido }}
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
        >
            <div ref={contentRef}
                className={`space-y-2 mt-1 pl-4 border-l-2 border-orange-300 transition-all duration-300 ease-in-out 
                    ${pendientesAbierto ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}
            >
                {ordenPendiente.map((platillo, i) => (
                <div key={`pend-${i}`} className="flex items-center space-x-2 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="flex-1">
                    <DishOrder platillo={platillo} origen="pendiente" />
                    </div>
                    
                    {/* BOTÓN COMPLETAR INDIVIDUAL */}
                    <button
                    onClick={() => handleCompletarIndividual(platillo.id)}
                    disabled={loadingIndividual[platillo.id]}
                    className={`px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1 h-10
                        ${platillo.estadoPlatillo === "listo" ? "" : "opacity-50 cursor-not-allowed pointer-events-none bg-zinc-800/50 select-none" }  
                        `
                    }
                    title="Marcar como completado"
                    >
                    {loadingIndividual[platillo.id] ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    ) : (
                        'Entregado'
                    )}
                    </button>
                </div>
                ))}
            </div>
        </div>
    </div>
    )
}

export default OrdenPendiende;
