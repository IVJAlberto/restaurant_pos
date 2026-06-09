import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ref, set, push } from 'firebase/database';
import { database } from '../../firebase_config';
import { toggleVisibility } from '../Order_details/slices/PagoDetailsSlice';
import { toggleModal } from '../Order_details/slices/togglePagoSlice';
import { setPaymentMethod } from '../Order_details/slices/OrderInformation';
import TextHeader from '../../UI/textHeader';
import Toast from '../../UI/Toast';
import toast from 'react-hot-toast';
import PaymentBtn from '../../UI/PaymentBtn';
import BackBtn from './../../UI/BackBtn';
import { agruparPlatillosCompletados } from './../../app/helpers/agruparPlatillosCompletados';

export const ModalPago = () => {
  const dispatch = useDispatch();
  const { nombre } = useSelector(state => state.AuthSlice);

  // REDUX: mesaData de OrdersFeed + carrito
  const mesaData = useSelector(state => state.PagoSlice.mesaData);
  const carritoLocal = useSelector(state => state.OrdersFeed.PlatillosSeleccionados || []);
  const mesaSeleccionada = useSelector(state => state.OrderTotal.table);
  const seleccionadoMetodoPago = useSelector(state => state.OrderTotal.paymentMethod);
  
  const isVisible = useSelector(state => state.PagoSlice.isVisible);
  const isModalVisible = useSelector(state => state.PagoDetails.isVisible);

  // Local: inputs editables
  // const [metodoPago, setMetodoPago] = useState('efectivo');
  const [meseroCierre, setMeseroCierre] = useState('');
  const [notas, setNotas] = useState('');
  const [propina, setPropina] = useState(0);
  const [cargandoCobro, setCargandoCobro] = useState(false);
  const [resumenAbierto, setResumenAbierto] = useState(true);
  const [platillosCompletados, setPlatillosCompletados] = useState([])
  const [cantidadPlatillosCompletados, setCantidadPlatillosCompletados] = useState(0);

  // Total: mesaData + propina
  const totalFinal = (mesaData?.granTotal) + propina;

  useEffect(() => {
    setMeseroCierre(nombre);
  }, [nombre]);

  useEffect(() => {
    const todosPlatillos = [
    ...(mesaData?.pedidosCompletados || [])
      // ...(mesaData?.ordenPendiente || []),
      // ...carritoLocal
    ];
    console.log(mesaData);
    
    setCantidadPlatillosCompletados(todosPlatillos.length);
    const platillosAgrupados = agruparPlatillosCompletados(todosPlatillos);
    setPlatillosCompletados(platillosAgrupados);
  
  }, [])
  


  const handleCerrarMesa = async () => {
    if (totalFinal === 0 || platillosCompletados.length === 0) {
      toast.custom(<Toast type="error" message="Sin platillos para cobrar" />);
      return;
    }

    setCargandoCobro(true);
    try {
      const fechaMX = new Date().toLocaleDateString('sv-SE', { 
        timeZone: 'America/Mexico_City' 
      });
      const horaCierre = new Date().toLocaleTimeString('es-MX', { 
        timeZone: 'America/Mexico_City', 
        hour: '2-digit', minute: '2-digit' 
      });

      const historico = {
        mesa: mesaSeleccionada,
        fecha: fechaMX,
        horaCierre,
        timestampCierre: Date.now(),
        timestampApertura: mesaData?.horaApertura,
        total: mesaData.granTotal,
        propina: propina,
        granTotal: totalFinal,
        seleccionadoMetodoPago,
        meseroCierre: meseroCierre || 'Sistema',
        notasGenerales: notas,
        platillos: platillosCompletados,
        historialMeseros: mesaData?.historialMeseros || []
      };

      // Escritura en BD
      await push(ref(database, `historicoPedidos/${fechaMX}`), historico);
      await set(ref(database, `ordenesPorMesa/mesa${mesaSeleccionada}`), {
        "estadoMesa": "libre",
        "estadoOrden": "cerrada",
        "granTotal": 0,
        "id": "mesa"+ mesaSeleccionada,
        "notasGenerales": "",
        "numero": mesaSeleccionada,
        "origen": "salon",
        "totalCompletados": 0,
        "totalPendiente": 0
      });

      toast.custom(
        <Toast type="success" message={`✅ Cobrado $${totalFinal.toFixed(2)}`} />,
        { duration: 4000 }
      );

      dispatch(toggleVisibility());
      dispatch(toggleModal());

    } catch (error) {
      console.error('Cobro error:', error);
      toast.custom(<Toast type="error" message="Error cobro" />);
    } finally {
      setCargandoCobro(false);
    }
  };

  const handlePaymentMethod = (value) => {
      dispatch(setPaymentMethod(value));
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div 
        className="bg-black/60 absolute inset-0" 
        onClick={() => { dispatch(toggleVisibility()); dispatch(toggleModal()); }}
      />
      
      <div className="bg-zinc-200 dark:bg-stone-950 w-full md:w-6/12 absolute right-0 h-full
      shadow-2xl overflow-hidden">
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-zinc-300 dark:bg-zinc-900 max-h-20">
            <div>
              <TextHeader 
                text={`Cobrar Mesa ${mesaData?.mesa || mesaSeleccionada}`} 
                color="text-zinc-950 dark:text-gray-300" 
                size="text-xl" 
              />
              <p className="text-sm font-bold text-green-600 mt-1">
                {platillosCompletados.length} platillos - ${totalFinal.toFixed(2)}
              </p>
            </div>
            <BackBtn onClick={() => {
              dispatch(toggleVisibility());
              dispatch(toggleModal());
            }} />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {/* Platillos */}
            <div className="p-5 bg-white dark:bg-zinc-800 rounded-2xl mx-4 mb-4">
  
              {/* Header clickeable */}
              <button
                onClick={() => setResumenAbierto(!resumenAbierto)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-bold text-lg">
                  Resumen {platillosCompletados.length > 0 && `(${cantidadPlatillosCompletados})`}
                </h3>
                <span className={`text-zinc-500 transition-transform duration-200 ${resumenAbierto ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Contenido colapsable */}
              {resumenAbierto && (
                <>
                  {!mesaData && !carritoLocal.length ? (
                    <div className="text-center py-12 text-zinc-500">
                      <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-2xl mx-auto mb-4 text-2xl flex items-center justify-center">
                        🛒
                      </div>
                      <p>Sin platillos para cobrar</p>
                    </div>
                  ) : (
                    platillosCompletados.map((p, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-700 p-2 rounded">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{p.nombre}</div>
                          {p.notas && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                              📝 {p.notas}
                            </span>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-zinc-500">x{p.cantidad || 1}</div>
                          <div className="font-bold text-lg">
                            ${(p.subtotal || p.precio * (p.cantidad || 1)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>

          </div>
          {/* Form */}
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Método pago *</label>
              <div className="flex flex-row space-x-3 justify-center">
                {["Efectivo", "TDC"].map((value, index) => (
                    <PaymentBtn
                        key={index}
                        onClick={() => handlePaymentMethod(value)}
                        className={`${
                            seleccionadoMetodoPago === value ? 'bg-zinc-900 hover:bg-zinc-900 dark:bg-slate-100 dark:hover:bg-slate-200 text-gray-300 dark:text-zinc-950' : 'text-gray-950 dark:text-zinc-200 bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                        }  basis-1/3`}
                    >
                        {value}
                    </PaymentBtn>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mesero</label>
              <p className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-blue-500 bg-white" >
                {meseroCierre}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Propina</label>
                <input
                  type="number"
                  value={propina}
                  onChange={e => setPropina(Number(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl border border-zinc-200 focus:border-green-500 text-right"
                  min="0"
                  step="0.01"
                />
              </div>
              <button
                type="button"
                onClick={() => setPropina(mesaData?.granTotal * 0.05)}
                className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium mt-auto"
              >
                5% (${(mesaData?.granTotal * 0.05).toFixed(2)})
              </button>
              <button
                type="button"
                onClick={() => setPropina(mesaData?.granTotal * 0.10)}
                className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium mt-auto"
              >
                10% (${(mesaData?.granTotal * 0.10).toFixed(2)})
              </button>
              <button
                type="button"
                onClick={() => setPropina(mesaData?.granTotal * 0.15)}
                className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-medium mt-auto"
              >
                15% (${(mesaData?.granTotal * 0.15).toFixed(2)})
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Notas</label>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                rows="3"
                className="w-full p-3 rounded-xl border-2 border-zinc-200 focus:border-purple-500 resize-vertical bg-white"
                placeholder="Notas opcionales..."
                maxLength="500"
              />
            </div>
          </div>

          {/* Acción */}
          <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 sticky bottom-0 shadow-2xl">
            <button
              onClick={handleCerrarMesa}
              disabled={cargandoCobro || totalFinal === 0}
              className={`w-full h-14 text-xl font-bold rounded-xl transition-all flex items-center justify-center shadow-lg
                ${cargandoCobro || totalFinal === 0
                  ? 'bg-emerald-400 cursor-not-allowed opacity-75'
                  : 'hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] hover:shadow-xl'
                }`}
            >
              {cargandoCobro ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando cobro...</span>
                </div>
              ) : (
                `COBRAR $${totalFinal.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
