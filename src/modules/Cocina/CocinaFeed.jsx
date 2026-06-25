import React, { useState, useEffect, useRef, useCallback } from "react";
import { database } from "../../firebase_config";
import { ref, onValue, off, get, update } from "firebase/database";
import Toast from "../../UI/Toast";
import toast from 'react-hot-toast';
import CocinaOrder from "./components/CocinaOrder";

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
      const pedidosArray = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
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

  // Handler actualiza ref primero, UI y guardar
  const actualizarEstadoPlatillo = async (pedidoTimestamp, platilloId, nuevoEstado, mesa) => {
    setActualizando(prev => ({ 
      ...prev, 
      [`${mesa}-${platilloId}`]: true 
    }));
    
    estadosRef.current[`${mesa}-${platilloId}`] = nuevoEstado;
    
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
      <div className="inset-0 z-50 w-full h-full flex items-center justify-center bg-zinc-800/75">
        <div className="bg-zinc-900 p-8 rounded-2xl text-white text-center">
          <div className="w-12 h-12 border-4 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Cargando cocina {fecha}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0 z-40 p-4 px-5 bg-primary-foreground backdrop-blur-sm flex flex-col w-full max-h-screen">
      {/* Header */}
      <div className="h-20 flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Cocina</h1>
          <p className="text-black text-lg">{fecha} - {pedidos.length} pedidos</p>
      </div>

      {/* Lista pedidos */}
      <div className=" flex-1 overflow-y-auto space-y-4 bg-secondary/25 rounded-2xl p-6">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center text-black">
            <div className="w-20 h-20 bg-zinc-700 rounded-2xl flex items-center justify-center mb-4 text-3xl">
              🍳
            </div>
            <p className="text-xl font-semibold">Sin pedidos</p>
            <p className="text-sm">Todos los pedidos completados</p>
          </div>
        ) : (
          pedidos.map((pedido) => {
            return <CocinaOrder 
              key={pedido.timestamp}
              pedido={pedido}
              getEstadoPlatillo={getEstadoPlatillo}
              actualizarEstadoPlatillo={actualizarEstadoPlatillo}
            />;
          })
        )}
      </div>
    </div>
  );
};

export default CocinaFeed;
