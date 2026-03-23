import React, { useState, useEffect, useRef, useCallback } from "react";
import { database } from "../../firebase_config";
import { ref, onValue, off, get, update } from "firebase/database";
import Toast from "../../UI/Toast";
import toast from 'react-hot-toast';

const CocinaFeed = ({ fecha = '2026-03-21' }) => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState({});
  
  // Estados persistente
  const estadosRef = useRef({});
  const storageKey = `cocinaEstados_${fecha}`;

  // Función para derivar estado (fallback 'pendiente')
  const getEstadoPlatillo = useCallback((platilloId) => {
    return estadosRef.current[platilloId] || 'pendiente';
  }, []);

  // Guardar en localStorage
  const saveEstados = useCallback(() => {
    localStorage.setItem(storageKey, JSON.stringify(estadosRef.current));
  }, [storageKey]);

  // Cargar al montar y guardar con los cambios
  useEffect(() => {
    // Cargar desde localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        estadosRef.current = JSON.parse(saved);
      } catch (e) {
        console.warn('Load estados falló:', e);
      }
    }

    const cocinaRef = ref(database, `pedidosCocina/${fecha}`);
    const unsubscribe = onValue(cocinaRef, (snapshot) => {
      const data = snapshot.val() || {};
      const pedidosArray = Object.values(data);
      setPedidos(pedidosArray);
      setCargando(false);
      
      // Limpiar estados obsoletos si no hay pedidos
      if (pedidosArray.length === 0) {
        estadosRef.current = {};
        localStorage.removeItem(storageKey);
      }
    });

    return () => {
      off(cocinaRef, 'value', unsubscribe);
      saveEstados();
    };
  }, [fecha, storageKey, saveEstados]);

  // Autoguardar en cambios de ref (usa callback)
  useEffect(() => {
    saveEstados();
  }, [Object.values(estadosRef.current), saveEstados]);

  // Handler actualiza ref primero → UI y guardar
  const actualizarEstadoPlatillo = async (pedidoTimestamp, platilloId, nuevoEstado, mesa) => {
    setActualizando(prev => ({ 
      ...prev, 
      [`${pedidoTimestamp}-${platilloId}`]: true 
    }));
    
    estadosRef.current[platilloId] = nuevoEstado;
    
    try {
      // Actualizar ordenesPorMesa
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
      delete estadosRef.current[platilloId];
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
    <div className="inset-0 z-50 p-4 bg-zinc-200/75 backdrop-blur-sm flex flex-col w-full max-h-screen">
      {/* Header */}
      <div className="bg-zinc-500 rounded-2xl p-6 flex justify-between items-center mb-4 shadow-2xl flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Cocina</h1>
          <p className="text-white text-lg">{fecha} - {pedidos.length} pedidos</p>
        </div>
      </div>

      {/* Lista pedidos */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-zinc-400 rounded-2xl p-6 shadow-2xl">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-500">
            <div className="w-20 h-20 bg-zinc-700 rounded-2xl flex items-center justify-center mb-4 text-3xl">
              🍳
            </div>
            <p className="text-xl font-semibold">Sin pedidos</p>
            <p className="text-sm">Todos los pedidos completados</p>
          </div>
        ) : (
          pedidos.map((platillo) => {
            const estadoActual = getEstadoPlatillo(platillo.id);
            return (
              <div key={platillo.id} className="bg-gradient-to-r from-black/30 to-black/20 p-6 rounded-2xl border-2 border-black shadow-xl">
                {/* Header pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">MESA {platillo.mesa}</h3>
                    <p className="text-zinc-300 text-sm">#{platillo.timestamp}</p>
                  </div>
                </div>

                {/* Platillos */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
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
                    
                    {/* Botones con estado derivado */}
                    <div className="flex flex-col space-y-1 flex-shrink-0">
                      <button
                        onClick={() => actualizarEstadoPlatillo(platillo.timestamp, platillo.id, 'preparando', platillo.mesa)}
                        disabled={actualizando[`${platillo.timestamp}-${platillo.id}`]}
                        className={`px-3 py-1.5 text-white text-xs font-medium rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                          ${estadoActual === "preparando"  ? 
                            "bg-blue-600 hover:bg-blue-700 cursor-not-allowed pointer-events-none" 
                            : estadoActual === "listo" ? "bg-blue-600/20 hover:bg-blue-700/20 cursor-not-allowed pointer-events-none"
                            : "bg-gray-600 hover:bg-gray-700"
                          }
                        `}
                      >
                        Preparando
                      </button>
                      <button
                        onClick={() => actualizarEstadoPlatillo(platillo.timestamp, platillo.id, 'listo', platillo.mesa)}
                        disabled={actualizando[`${platillo.timestamp}-${platillo.id}`]}
                        className={`px-3 py-1.5 text-white text-xs font-medium rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                          ${estadoActual === "listo" ? 
                            "bg-green-600 hover:bg-green-700 cursor-not-allowed pointer-events-none" 
                            : "bg-gray-600 hover:bg-gray-700"
                          }
                        `}
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CocinaFeed;
