import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ref, onValue } from "firebase/database";

import { database } from "../../../../../firebase_config";
import DishOrder from "./components/DishOrder/DishOrder";
import emptyCart from "../../../../../assets/stickers/nothing_in_cart.png";
import { limpiarMesaData, agregarMesaData } from "../../../slices/togglePagoSlice";
import { agruparPlatillosCompletados } from "../../../../../app/helpers/agruparPlatillosCompletados";
import OrdenPendiende from './components/OrdenPendiende';
import OrdenCompletada from "./components/OrdenCompletada";
import OrdenEnCarrito from "./components/OrdenEnCarrito";

const OrdersFeed = ({ mandarPedidosCompletados }) => {
  const dispatch = useDispatch();
  const mesaSeleccionada = useSelector((state) => state.OrderTotal.table);
  const carritoLocal = useSelector((state) => state.OrdersFeed.ordenesPorMesa?.[mesaSeleccionada]?.PlatillosSeleccionados || []);
  
  // Estados separados
  const [ordenesCompletadas, setOrdenesCompletadas] = useState([]);
  const [ordenPendiente, setOrdenPendiente] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [infoMesa, setInfoMesa] = useState(null);
  const [mesaData, setMesaData] = useState(null); 
  const [cantidadPlatillosCompletados, setCantidadPlatillosCompletados] = useState(0);

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
      
      dispatch(agregarMesaData({
        ordenPendiente: pendientes,
        pedidosCompletados: completados,
        granTotal: (data?.totalCompletados || 0) + (data?.totalPendiente || 0),
        mesa: mesaSeleccionada
      }));

      setOrdenPendiente(Array.isArray(pendientes) ? pendientes.map(p => normalizarPlatillo(p, 'pendiente')) : []);
      const ordenesCompletasNormalizadas = Array.isArray(completados) ? completados.map(p => normalizarPlatillo(p, 'completado')) : [];
      setCantidadPlatillosCompletados(ordenesCompletasNormalizadas.length);
      const ordenesCompletadasAgrupadas = agruparPlatillosCompletados(ordenesCompletasNormalizadas);
      setOrdenesCompletadas(ordenesCompletadasAgrupadas);
      mandarPedidosCompletados({
        totalCompletados: data?.totalCompletados || 0
      });
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

    dispatch(limpiarMesaData());
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
                <OrdenEnCarrito 
                  carritoLocal={carritoLocal}
                  totalCarrito={totalCarrito}
                  normalizarPlatillo={normalizarPlatillo}
                />
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
                <OrdenCompletada
                  ordenesCompletadas={ordenesCompletadas}
                  cantidadPlatillosCompletados={cantidadPlatillosCompletados}
                  totalCompletados={totalCompletados}
                />
              )}

              {/* Sección Pendientes */}
              {ordenPendiente.length > 0 && (
                <OrdenPendiende 
                  mesaData={mesaData}
                  mesaSeleccionada={mesaSeleccionada}
                  ordenPendiente={ordenPendiente}
                  totalPendiente={totalPendiente}
                />
              )}

              {/* Sección Carrito Local */}
              {carritoLocal.length > 0 && (
                <OrdenEnCarrito 
                  carritoLocal={carritoLocal}
                  totalCarrito={totalCarrito}
                  normalizarPlatillo={normalizarPlatillo}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersFeed;
