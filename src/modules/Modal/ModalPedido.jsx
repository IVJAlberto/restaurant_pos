import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../Order_details/slices/toggleModalSlice';
import CloseBtn from '../../UI/CloseBtn';
import Toast from '../../UI/Toast';
import { limpiarOrdenMesa } from '../Order_details/slices/OrdersFeedSlice';
import { database } from '../../firebase_config';
import { ref, set, update, onValue, get } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

const ModalPedido = () => {
  const dispatch = useDispatch();
  const datosOrden = useSelector((state) => state.OrderTotal);
  const mesa = datosOrden.table;
  const platillos = useSelector((state) => state.OrdersFeed.ordenesPorMesa?.[mesa]?.PlatillosSeleccionados || []);
  const [loading, setLoading] = useState(false);
  const [mesaLibre, setMesaLibre] = useState(false);

  // Verificar si mesa está libre al montar componente
  useEffect(() => {
    if (!mesa) return;

    const ordenesPorMesaRef = ref(database, `ordenesPorMesa/mesa${mesa}`);
    get(ordenesPorMesaRef)
      .then((snapshot) => {
        setMesaLibre(!snapshot.exists());
      })
      .catch((error) => {
        console.error('Error verificando mesa:', error);
      });
  }, [mesa]);

  // Cerrar Modal
  const handleClose = () => {
    dispatch(toggleModal());
  };

  // Función para enviar pedido a cocina
  const handleEnviarCocina = async () => {
    if (!mesa) {
      toast.custom(<Toast type="error" message="Selecciona una mesa" />, {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    if (platillos.length === 0) {
      toast.custom(<Toast type="error" message="No hay platillos en el pedido" />, {
        duration: 3000,
        position: 'bottom-center',
      });
      return;
    }

    setLoading(true);

    try {
      const timestamp = Date.now();
      const fecha = new Date(timestamp).toLocaleDateString('sv-SE', { timeZone: 'America/Mexico_City' });
      
      const platillosParaMesa = platillos.map((platillo, index) => ({
        id: `${timestamp}-${index}`,
        platillo: platillo.nombre,
        cantidad: platillo.cantidad,
        precioUnitario: platillo.precio,
        subtotal: platillo.precio * platillo.cantidad,
        estadoPlatillo: "pendiente",
        meseroQueCapturo: "mesero001",
        notas: platillo.notas || "",
        timestampCaptura: new Date().toISOString()
      }));

      const totalPedido = platillos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

      const mesaRef = ref(database, `ordenesPorMesa/mesa${mesa}`);
      const snapshot = await get(mesaRef);
      const mesaData = snapshot.val() || {};
      
      if (!snapshot.exists() || mesaData.estadoMesa === 'libre' ) {
        const mesaCompleta = {
          estadoMesa: "ocupada",
          estadoOrden: "abierta",
          granTotal: totalPedido,
          id: `mesa${mesa}`,
          numero: parseInt(mesa),
          origen: "salon",
          notasGenerales: "",
          horaApertura: new Date().toISOString(),
          horaUltimaActualizacion: new Date().toISOString(),
          meseroActual: { id: "mesero001", nombre: "Sistema", turno: "auto" },
          meseroPrincipal: { id: "mesero001", nombre: "Sistema", turno: "auto" },
          historialMeseros: [{
            accion: "abrio_mesa",
            meseroId: "mesero001",
            nombre: "Sistema",
            timestamp: new Date().toISOString()
          }],
          ordenPendiente: platillosParaMesa,
          pedidosCompletados: [],
          totalCompletados: 0,
          totalPendiente: totalPedido
        };
        await set(mesaRef, mesaCompleta);
      } else {
        // Mesa OCUPADA - Agregar platillos
        const mesaData = snapshot.val();
        const ordenPendienteActualizada = [
          ...(mesaData.ordenPendiente || []),
          ...platillosParaMesa
        ];
        
        const nuevoTotalPendiente = ordenPendienteActualizada.reduce(
          (sum, p) => sum + p.subtotal, 0
        );

        await update(mesaRef, {
          ordenPendiente: ordenPendienteActualizada,
          totalPendiente: nuevoTotalPendiente,
          granTotal: (mesaData.granTotal || 0) + totalPedido,
          horaUltimaActualizacion: new Date().toISOString(),
          historialMeseros: [
            ...(mesaData.historialMeseros || []),
            {
              accion: "agrego_platillos",
              meseroId: "mesero001",
              nombre: "Sistema",
              timestamp: new Date().toISOString()
            }
          ]
        });
      }

      const updates = {};

      platillos.forEach((platillo, index) => {
        // Usamos el mismo id que ya traes del platillo
        const platilloId =  `${timestamp}-${index}`

        // ruta en DB: pedidosCocina/fecha/platilloId
        const path = `pedidosCocina/${fecha}/${platilloId}`;

        updates[path] = {
          id: platilloId,
          mesa: mesa,
          timestamp, // timestamp del pedido completo
          nombre: platillo.nombre,
          cantidad: platillo.cantidad,
          notas: platillo.notas || "",
        };
      });

      await update(ref(database), updates);

      // Limpiar carrito local
      dispatch(limpiarOrdenMesa({
        mesaId: mesa,
      }));

      toast.custom(<Toast type="success" message={`Pedido mesa ${mesa} → Cocina`} />, {
        duration: 3000,
        position: 'bottom-center',
      });

      dispatch(toggleModal());

    } catch (error) {
      console.error('Error enviando a cocina:', error);
      toast.custom(<Toast type="error" message="Error al enviar pedido" />, {
        duration: 3000,
        position: 'bottom-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalPedido = platillos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-zinc-800 bg-opacity-75 backdrop-blur-sm">
      <div className="flex flex-col bg-zinc-900 px-4 py-5 md:rounded-2xl space-y-3 h-full w-full md:h-5/6 md:w-9/12 lg:w-7/12 xl:w-5/12">
        <div className='flex w-full justify-between items-center bg-zinc-800 rounded-2xl shadow-md px-8 py-4'>
          <p className='text-xl font-semibold text-white underline decoration-blue-500 decoration-2 underline-offset-2'>
            Resumen Pedido Mesa {mesa || 'X'}
          </p>
          <CloseBtn onClick={handleClose} />
        </div>

        <div className="flex flex-grow space-x-3 h-full">
          <div className="bg-zinc-800 p-8 w-full rounded-2xl space-y-3">
            <div className="flex flex-row justify-between px-4">
              <p className="text-white font-semibold text-lg">Platillo</p>
              <p className="text-white font-semibold text-lg">Cantidad</p>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[60vh] md:max-h-[43vh] scroll-styling">
              {platillos.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">Carrito vacío</p>
              ) : (
                platillos.map((platillo, index) => (
                  <div className="w-full flex justify-between" key={index}>
                    <div className="flex flex-row space-x-3 items-center">
                      <img 
                        src={platillo.imagen} 
                        alt="dish_image" 
                        className="h-20 w-24 border border-zinc-500 object-cover rounded" 
                      />
                      <div className="flex flex-col text-white justify-evenly h-full">
                        <p className="font-semibold">{platillo.nombre}</p>
                        <p className="">$ {platillo.precio.toFixed(2)}</p>
                        <p className="w-full px-3 py-2 text-md text-black dark:text-white bg-white/80 dark:bg-zinc-700/80 border border-zinc-300 dark:border-zinc-600 rounded-lg">{platillo.notas}</p>
                      </div>
                    </div>
                    <div className="flex items-center font-semibold text-xl text-white pr-6">
                      <p>x {platillo.cantidad}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-2xl py-4 px-8 text-white text-lg">
          <div className="flex justify-between">
            <div className="font-semibold text-zinc-300 flex text-center items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              <p>Total:</p>
            </div>
            <p className="text-2xl font-bold">$ {totalPedido}</p>
          </div>
        </div>

        <div className="flex justify-end text-white font-medium space-x-2">
          <button 
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 w-full duration-200 hover:from-emerald-700 hover:to-teal-700 shadow-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleEnviarCocina}
            disabled={loading || platillos.length === 0 || !mesa}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar a Cocina</span>
              </>
            )}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ModalPedido;
