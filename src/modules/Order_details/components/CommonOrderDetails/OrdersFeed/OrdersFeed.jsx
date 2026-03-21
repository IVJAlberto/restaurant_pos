import React, { useEffect, useState } from "react";
import DishOrder from "./components/DishOrder/DishOrder";
import { useSelector } from "react-redux";
import emptyCart from "../../../../../assets/stickers/nothing_in_cart.png";
import { database } from "../../../../../firebase_config";
import { ref, onValue, set, get, update } from "firebase/database";
import Toast from "../../../../../UI/Toast"; // Ajusta path
import toast from 'react-hot-toast';

const OrdersFeed = () => {
  const mesaSeleccionada = useSelector((state) => state.OrderTotal.table);
  const carritoLocal = useSelector((state) => state.OrdersFeed?.PlatillosSeleccionados || []);
  
  // Estados separados
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([]);
  const [ordenPendiente, setOrdenPendiente] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [infoMesa, setInfoMesa] = useState(null);
  const [mesaData, setMesaData] = useState(null); // Para funciones de completar
  const [servidosAbierto, setServidosAbierto] = useState(false);
  const [pendientesAbierto, setPendientesAbierto] = useState(false);
  const [loadingCompletar, setLoadingCompletar] = useState(false);
  const [loadingIndividual, setLoadingIndividual] = useState({});

  const normalizarPlatillo = (platilloDB, origen) => ({
    ...platilloDB,
    nombre: platilloDB.platillo || platilloDB.nombre,
    origen, // 'completado', 'pendiente', 'local'
    editable: origen === 'pendiente' && platilloDB.estadoPlatillo === 'pendiente',
  });

  // Fetch completo de mesa para funciones
  const fetchMesaData = () => {
    if (!mesaSeleccionada) return;
    
    const mesaRef = ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`);
    const unsubscribe = onValue(mesaRef, (snapshot) => {
      const data = snapshot.val();
      setMesaData(data || {});
      setInfoMesa(data || {});
      
      // Actualizar pendientes y completados
      const pendientes = data?.ordenPendiente || [];
      const completados = data?.pedidosCompletados || [];
      
      setOrdenPendiente(Array.isArray(pendientes) ? pendientes.map(p => normalizarPlatillo(p, 'pendiente')) : []);
      setOrdenesCompletadas(Array.isArray(completados) ? completados.map(p => normalizarPlatillo(p, 'completado')) : []);
      
      setCargando(false);
    });
    
    return unsubscribe;
  };

  useEffect(() => {
    if (!mesaSeleccionada) {
      setOrdenesCompletadas([]);
      setOrdenPendiente([]);
      setInfoMesa(null);
      setMesaData(null);
      return;
    }

    setCargando(true);
    const unsubscribe = fetchMesaData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [mesaSeleccionada]);


  // Cálculos de totales
  const totalCompletados = infoMesa?.totalCompletados || 0;
  const totalPendiente = infoMesa?.totalPendiente || 0;
  const totalCarrito = carritoLocal.reduce((sum, p) => sum + (p.precio * p.cantidad || 0), 0);
  const granTotal = (totalCompletados + totalPendiente + totalCarrito);
  const totalACobrar = (totalPendiente + totalCarrito);

  const noHayMesa = !mesaSeleccionada;
  const mesaLibre = infoMesa?.estadoMesa === 'libre';
  const todoVacio = ordenesCompletadas.length === 0 && ordenPendiente.length === 0 && carritoLocal.length === 0;

  // Eliminar pedidosCocina
  const eliminarPedidosCocina = async (timestamps, fechaPedido, mesaSeleccionada) => {
  console.log('DEBUG eliminar:', { timestamps, fechaPedido, mesaSeleccionada });
  
  for (const timestamp of timestamps) {
    const path = `pedidosCocina/${fechaPedido}/${timestamp}`;
    const cocinaRef = ref(database, path);
    
    console.log('Probando path:', path);
    
    try {
      const snapshot = await get(cocinaRef);
      console.log('Snapshot:', snapshot.val());
      
      const pedidoCocina = snapshot.val();
      if (!pedidoCocina) {
        console.warn('No existe:', path);
        continue;
      }
      
      console.log('Mesa DB:', pedidoCocina.mesa, 'vs', mesaSeleccionada);
      
      if (String(pedidoCocina.mesa) !== String(mesaSeleccionada)) {
        console.warn('Mesa distinta:', path);
        continue;
      }
      
      // Eliminar haciendo null
      await set(cocinaRef, null);
      console.log('ELIMINADO:', path);
      
    } catch (error) {
      console.error('ERROR:', error.message, path);
    }
  }
};

   // FUNCIONES COMPLETAR PLATILLOS
  const handleCompletarPendientes = async () => {
    if (!mesaData || ordenPendiente.length === 0) return;
    
    setLoadingCompletar(true);
    try {
      const mesaRef = ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`);
      
      const completadosNuevos = ordenPendiente.map(platillo => ({
        ...platillo,
        estadoPlatillo: "servido",
        timestampServido: new Date().toISOString()
      }));

      await update(mesaRef, {
        ordenPendiente: [],
        totalPendiente: 0,
        pedidosCompletados: [...(mesaData.pedidosCompletados || []), ...completadosNuevos],
        totalCompletados: (mesaData.totalCompletados || 0) + parseFloat(infoMesa?.totalPendiente || 0),
        horaUltimaActualizacion: new Date().toISOString(),
        historialMeseros: [
          ...(mesaData.historialMeseros || []),
          { accion: "completar_pendientes", meseroId: "mesero001", nombre: "Sistema", timestamp: new Date().toISOString() }
        ]
      });

      //ELIMINAR TODOS pedidosCocina relacionados
      const fechaPedido = ordenPendiente[0].timestampCaptura.split('T')[0];
      const timestampsUnicos = [...new Set(
        ordenPendiente.map(p => p.id.split('-')[0])
      )];
      
      await eliminarPedidosCocina(timestampsUnicos, fechaPedido, mesaSeleccionada);

      toast.custom(<Toast type="success" message={`${ordenPendiente.length} completados`} />, { 
        duration: 2000 
      });
      
    } catch (error) {
      console.error('Error:', error);
      toast.custom(<Toast type="error" message="Error al completar todo" />, { duration: 3000 });
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

      //Update mesa
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

      //ELIMINAR pedidosCocina
      const timestampCocina = platillo.id.split('-')[0];
      const fechaPedido = platillo.timestampCaptura.split('T')[0];
      await eliminarPedidosCocina([timestampCocina], fechaPedido, mesaSeleccionada);

      toast.custom(<Toast type="success" message="Completado" />, { duration: 1500 });
      
    } catch (error) {
      console.error('Error:', error);
      toast.custom(<Toast type="error" message="Error al completar" />, { duration: 2000 });
    } finally {
      setLoadingIndividual(prev => ({ ...prev, [platilloId]: false }));
    }
  };

  return (
    <div className="px-3 py-4 bg-zinc-300 dark:bg-zinc-900 rounded-2xl mx-2 basis-4/12">
      <div className="overflow-y-scroll scroll-styling h-full">
        <div className="space-y-3.5 px-3 h-full">
          {noHayMesa ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <img src={emptyCart} className="h-64" alt="No mesa" />
              <p className="text-center text-xl font-semibold underline decoration-blue-500">Selecciona una mesa</p>
            </div>
          ) : cargando ? (
            <div className="flex flex-col justify-center items-center h-full space-y-3">
              <div className="w-10 h-10 border-4 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Cargando mesa {mesaSeleccionada}...</p>
            </div>
          ) : mesaLibre ? (
            <div className="">
              {carritoLocal.length > 0 ? (
                <div className="flex flex-col gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                  <h4 className="font-semibold text-blue-700 mb-2">Nuevo ({carritoLocal.length}) ${totalCarrito.toFixed(2)}</h4>
                  {carritoLocal.map((platillo, i) => (
                    <DishOrder key={`local-${i}`} platillo={normalizarPlatillo(platillo, 'local')} origen="local" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-full space-y-4 text-center">
                  <img src={emptyCart} className="h-64" alt="Vacio" />
                  <p className="text-xl font-semibold underline decoration-yellow-500">Mesa {mesaSeleccionada} abierta</p>
                  <p className="text-xs">Agrega platillos desde el catálogo.</p>
                </div>
              )}
            </div>
          ) : todoVacio ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4 text-center">
              <img src={emptyCart} className="h-64" alt="Vacio" />
              <p className="text-xl font-semibold underline decoration-yellow-500">Mesa {mesaSeleccionada} abierta</p>
              <p className="text-xs">Agrega platillos desde el catálogo.</p>
            </div>
          ) : (
            <>
              {/* Header con totales */}
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl">
                <h3 className="font-bold text-lg">Mesa {mesaSeleccionada} - {infoMesa?.estadoMesa || 'ocupada'}</h3>
                <p className="text-2xl font-black text-green-600">Total: ${granTotal.toFixed(2)}</p>
                {/* {totalACobrar > 0 && <p className="text-sm text-blue-600">Pendiente: ${totalACobrar.toFixed(2)}</p>} */}
                {infoMesa?.notasGenerales && <p className="text-xs italic mt-1">Notas: {infoMesa.notasGenerales}</p>}
              </div>

              {/* Sección Servidos */}
              {ordenesCompletadas.length > 0 && (
                <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl">
                  <button
                    onClick={() => setServidosAbierto(!servidosAbierto)}
                    className="w-full flex items-center justify-between text-left font-semibold text-green-700 mb-2 p-2 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-lg transition-all"
                  >
                    <span>Servidos ({ordenesCompletadas.length}) ${totalCompletados}</span>
                    <span className={`transition-transform ${servidosAbierto ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {servidosAbierto && (
                    <div className="space-y-2 mt-1 pl-4 border-l-2 border-green-300">
                      {ordenesCompletadas.map((platillo, i) => (
                        <DishOrder key={`comp-${i}`} platillo={platillo} origen="completado" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sección Pendientes CON BOTONES */}
              {ordenPendiente.length > 0 && (
                <div className="bg-gray-100 dark:bg-zinc-700 p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setPendientesAbierto(!pendientesAbierto)}
                      className="flex-1 text-left font-semibold text-orange-700 hover:bg-gray-200 dark:hover:bg-zinc-600 p-2 rounded-lg transition-all"
                    >
                      <span>Pendientes ({ordenPendiente.length}) ${totalPendiente}</span>
                      <span className={`ml-2 transition-transform ${pendientesAbierto ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {/* BOTÓN COMPLETAR TODOS */}
                    <button
                      onClick={handleCompletarPendientes}
                      disabled={loadingCompletar}
                      className="ml-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                    >
                      {loadingCompletar ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </>
                      ) : (
                        <>
                          <span>Todo</span>
                        </>
                      )}
                    </button>
                  </div>

                  {pendientesAbierto && (
                    <div className="space-y-2 mt-1 pl-4 border-l-2 border-orange-300">
                      {ordenPendiente.map((platillo, i) => (
                        <div key={`pend-${i}`} className="flex items-center space-x-2 p-2 bg-white/50 dark:bg-zinc-800/50 rounded-lg">
                          <div className="flex-1">
                            <DishOrder platillo={platillo} origen="pendiente" />
                          </div>
                          
                          {/* BOTÓN COMPLETAR INDIVIDUAL */}
                          <button
                            onClick={() => handleCompletarIndividual(platillo.id)}
                            disabled={loadingIndividual[platillo.id]}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1 h-10"
                            title="Marcar como completado"
                          >
                            {loadingIndividual[platillo.id] ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              'Listo'
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sección Carrito Local */}
              {carritoLocal.length > 0 && (
                <div className="flex flex-col gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                  <h4 className="font-semibold text-blue-700 mb-2">Nuevo ({carritoLocal.length}) ${totalCarrito.toFixed(2)}</h4>
                  {carritoLocal.map((platillo, i) => (
                    <DishOrder key={`local-${i}`} platillo={normalizarPlatillo(platillo, 'local')} origen="local" />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersFeed;
