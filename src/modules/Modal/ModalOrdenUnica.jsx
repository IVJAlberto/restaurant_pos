import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal } from '../DashboardComponent/slices/toggleModalOrdenUnica';

const ModalOrdenUnica = ({ pedido }) => {
    const dispatch = useDispatch();
    const isModalVisible = useSelector(state => state.OrdenUnicaSlice.isModalVisible);

    const cerrarModal = () => {
        dispatch(toggleModal());
    };

    if (!isModalVisible || !pedido) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-primary-foreground  rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl  flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-primary-foreground/95  backdrop-blur-md z-10 border-b border-primary px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-primary">
                                Pedido {pedido.id?.slice(-6) || 'N/A'}
                            </h2>
                            <p className="font-bold text-black mt-1">
                                Mesa {pedido.mesa} • {pedido.fecha} 
                            </p>
                        </div>
                        <button
                            onClick={cerrarModal}
                            className="p-2 rounded-2xl transition-all duration-200 text-primary hover:text-secondary"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Platillos */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11v2.25m5.25-2.25v2.25M4.875 7.5h14.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H4.875C4.254 11.25 3.75 10.746 3.75 10.125V8.625c0-.621.504-1.125 1.125-1.125z" />
                            </svg>
                            Platillos ({pedido.platillos?.length || 0})
                        </h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {pedido.platillos?.map((platillo, index) => (
                                <div key={index} className="flex gap-4 p-4 bg-secondary/25  rounded-xl border border-secondary">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-black truncate">{platillo.nombre}</p>
                                        <p className="text-sm text-black/75 mt-1">
                                            Cantidad: {platillo.cantidad} • ${platillo.precioUnitario?.toLocaleString()} c/u
                                        </p>
                                        {platillo.notas && (
                                            <p className="text-sm text-black/75 mt-1 bg-primary-foreground px-2 py-1 rounded border border-secondary">
                                                {platillo.notas}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right min-w-[80px] shrink-0">
                                        <p className="font-semibold text-lg text-zinc-900 dark:text-white">
                                            ${platillo.subtotal?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )) || (
                                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">Sin platillos</p>
                            )}
                        </div>
                    </div>

                    {/* Resumen financiero */}
                    <div className="bg-gradient-to-r from-secondary/50 to-primary/75  p-6 rounded-2xl border border-primary">
                        <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Resumen</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-black">Subtotal</p>
                                <p className="font-semibold text-zinc-900 dark:text-white">
                                    ${pedido.total?.toLocaleString() || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-black">Propina</p>
                                <p className="font-semibold text-zinc-900 dark:text-white">
                                    ${pedido.propina?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <div>
                                <p className="text-black">Método pago</p>
                                <p className="font-semibold text-zinc-900 dark:text-white capitalize">
                                    {pedido.metodoPago || pedido.seleccionadoMetodoPago || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-black">Gran Total</p>
                                <p className="text-xl font-bold text-primary-foreground">
                                    ${pedido.granTotal?.toLocaleString() || pedido.total?.toLocaleString() || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notas generales */}
                    {pedido.notasGenerales && (
                        <div>
                            <h4 className="text-lg font-semibold text-blackmb-3 flex items-center gap-2">
                                📝 Notas generales
                            </h4>
                            <div className="p-4 bg-secondary/25 border border-secondary rounded-xl">
                                <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{pedido.notasGenerales}</p>
                            </div>
                        </div>
                    )}

                    {/* Información meta */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-blackpt-2 border-t border-primary">
                        <div>
                            <p><span className="font-medium">Mesero:</span> {pedido.meseroCierre || 'Sistema'}</p>
                            <p><span className="font-medium">ID completo:</span> {pedido.id?.slice(0, 8)}...</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-medium">Hora apertura:</span> {new Date(pedido.timestampApertura || 0).toLocaleTimeString()}</p>
                            <p><span className="font-medium">Hora cierre:</span> {new Date(pedido.timestampCierre || 0).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="sticky bottom-0 bg-primary-foreground  backdrop-blur-md border-t border-primary px-8 py-6 flex gap-3 justify-end shadow-lg">
                    <button
                        onClick={cerrarModal}
                        className="px-8 py-2.5 bg-primary-foreground text-black  rounded-xl  transition-all duration-200 font-medium flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cerrar
                    </button>
                    <button className="px-8 py-2.5 bg-primary hover:bg-secondary text-primary-foreground rounded-xl transition-all duration-200 font-medium shadow-lg flex items-center gap-2">
                        Reimprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalOrdenUnica;