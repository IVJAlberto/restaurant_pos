import React, { useState, useEffect } from "react";
import { database } from "../../firebase_config";
import { ref, onValue, off, update, get } from "firebase/database";
import Toast from "../../UI/Toast";
import toast from 'react-hot-toast';

const CocinaFeed = ({ fecha = '2026-03-21' }) => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState({});

  // Fetch pedidosCocina/fecha/*
  useEffect(() => {
    const cocinaRef = ref(database, `pedidosCocina/${fecha}`);
    const unsubscribe = onValue(cocinaRef, (snapshot) => {
      const data = snapshot.val() || {};
      const pedidosArray = Object.entries(data).map(([timestamp, pedido]) => ({
        timestamp: parseInt(timestamp),
        ...pedido
      }));
      setPedidos(pedidosArray);
      setCargando(false);
    });

    return () => off(cocinaRef, 'value', unsubscribe);
  }, [fecha]);

  const actualizarEstadoPlatillo = async (pedidoTimestamp, platilloId, nuevoEstado, mesa) => {
    setActualizando(prev => ({ 
      ...prev, 
      [`${pedidoTimestamp}-${platilloId}`]: true 
    }));
    
    try {
      // Update ordenesPorMesa
      const mesaRef = ref(database, `ordenesPorMesa/mesa${mesa}/ordenPendiente`);
      const snapshotMesa = await get(mesaRef);
      const pendientes = snapshotMesa.val() || [];
      
      const platilloIndex = pendientes.findIndex(p => p.id === platilloId);
      if (platilloIndex !== -1) {
        pendientes[platilloIndex].estadoPlatillo = nuevoEstado;
        await update(mesaRef, {
            [platilloIndex]: pendientes[platilloIndex]
        });
        
        toast.custom(<Toast type="success" message={`Platillo ${nuevoEstado}`} />, {
          duration: 1500
        });
      }
    } catch (error) {
      console.error('Error actualizar:', error);
      toast.custom(<Toast type="error" message="Error al actualizar" />, { duration: 2000 });
    } finally {
      setActualizando(prev => ({ 
        ...prev, 
        [`${pedidoTimestamp}-${platilloId}`]: false 
      }));
    }
  };

  if (cargando) {
    return (
      <div className="inset-0 z-50 flex items-center justify-center bg-zinc-800/75">
        <div className="bg-zinc-900 p-8 rounded-2xl text-white text-center">
          <div className="w-12 h-12 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Cargando cocina {fecha}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0 z-50 p-4 bg-zinc-800/75 backdrop-blur-sm flex flex-col w-full max-h-screen">
      {/* Header */}
      <div className="bg-zinc-900 rounded-2xl p-6 flex justify-between items-center mb-4 shadow-2xl flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Cocina</h1>
          <p className="text-zinc-400">{fecha} - {pedidos.length} pedidos</p>
        </div>
      </div>

      {/* Lista pedidos */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-zinc-900 rounded-2xl p-6 shadow-2xl">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-500">
            <div className="w-20 h-20 bg-zinc-700 rounded-2xl flex items-center justify-center mb-4 text-3xl">
              🍳
            </div>
            <p className="text-xl font-semibold">Sin pedidos</p>
            <p className="text-sm">Todos los pedidos completados</p>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.timestamp} className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-2xl border-2 border-orange-400 shadow-xl">
              {/* Header pedido */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">MESA {pedido.mesa}</h3>
                  <p className="text-zinc-300 text-sm">#{pedido.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-400">
                    {pedido.platillos.length} platillos
                  </p>
                </div>
              </div>

              {/* Platillos */}
              <div className="space-y-3">
                {pedido.platillos.map((platillo) => (
                  <div key={platillo.id} className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-lg truncate">
                        {platillo.nombre}
                      </p>
                      <p className="text-zinc-300">x{platillo.cantidad}</p>
                      {platillo.notas && (
                        <p className="text-yellow-300 text-sm mt-1 bg-yellow-900/30 px-2 py-1 rounded inline-block">
                          📝 {platillo.notas}
                        </p>
                      )}
                    </div>
                    
                    {/* Botones estado */}
                    <div className="flex flex-col space-y-1 flex-shrink-0">
                      <button
                        onClick={() => actualizarEstadoPlatillo(pedido.timestamp, platillo.id, 'preparando', pedido.mesa)}
                        disabled={actualizando[`${pedido.timestamp}-${platillo.id}`]}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Preparando
                      </button>
                      <button
                        onClick={() => actualizarEstadoPlatillo(pedido.timestamp, platillo.id, 'listo', pedido.mesa)}
                        disabled={actualizando[`${pedido.timestamp}-${platillo.id}`]}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CocinaFeed;
