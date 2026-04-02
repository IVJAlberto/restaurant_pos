import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal as toggleModalOrdenes } from '../DashboardComponent/slices/toggleModalOrdenes';
import { toggleModal as toggleModalOrdenUnica } from '../DashboardComponent/slices/toggleModalOrdenUnica';
import ModalOrdenUnica from "../Modal/ModalOrdenUnica";

const ITEMS_PER_PAGE = 20;

const ModalOrdenes = ({
  pedidos = [],
  periodo = 'día',
  onViewPedido,
}) => {
  const dispatch = useDispatch();

  const isModalVisible = useSelector(
    (state) => state.OrdenesSlice.isModalVisible
  );

  const isModalOrdenUnicaVisible = useSelector(
    (state) => state.OrdenUnicaSlice.isModalVisible
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [orden, setOrden] = useState('desc');

  const totalOrders = pedidos.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const closeModal = () => {
    dispatch(toggleModalOrdenes());
  };

  const closeModalOrdenUnica = () => {
    dispatch(toggleModalOrdenUnica());
    setSelectedOrder(null);
  };

  const toggleOrden = () => {
    setOrden((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1);
  };

  const paginatedPedidos = useMemo(() => {
    const pedidosOrdenados = [...pedidos].sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();

      return orden === 'desc' ? fechaB - fechaA : fechaA - fechaB;
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return pedidosOrdenados.slice(start, start + ITEMS_PER_PAGE);
  }, [pedidos, currentPage, orden]);

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const getPageNumbers = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    if (currentPage > 2) pages.add(currentPage - 2);
    if (currentPage < totalPages - 1) pages.add(currentPage + 2);

    const sorted = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      const page = sorted[i];
      const prev = sorted[i - 1];
      if (i > 0 && page - prev > 1) result.push('...');
      result.push(page);
    }
    return result;
  };

  const handleView = (pedido) => {
    setSelectedOrder(pedido);
    setOpenActionId(null);
    dispatch(toggleModalOrdenUnica());
    onViewPedido?.(pedido);
  };

  if (!isModalVisible) return null;

  const pageNumbers = getPageNumbers();

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5"
        onClick={closeModal}
      >
        <div
          className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 sm:text-xl">
                Todas las órdenes ({totalOrders})
              </h2>

              <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                  Periodo: {periodo}
                </span>

                <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={toggleOrden}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  <span>{orden === 'desc' ? '↓' : '↑'}</span>
                  <span>
                    {orden === 'desc' ? 'Más recientes' : 'Más antiguos'}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {totalOrders === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center px-6 py-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-500" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    No hay órdenes en este periodo
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-3 py-3 sm:px-4">
                  <div className="space-y-3">
                    {paginatedPedidos.map((order) => {
                      const orderId = order.id ?? order._id;

                      return (
                        <div
                          key={orderId}
                          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/60"
                        >
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                Orden
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {order.folio ?? order.codigo ?? order.id ?? order._id}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                Fecha
                              </span>
                              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                {order.fecha?.nombre ?? order.fecha ?? '—'}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                Total
                              </span>
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {order.granTotal != null
                                  ? `$${Number(order.granTotal).toFixed(2)}`
                                  : '—'}
                              </span>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                Método de pago
                              </span>
                              <span className="inline-flex w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                                {order.seleccionadoMetodoPago ?? order.paymentMethod ?? 'Efectivo'}
                              </span>
                            </div>

                            <div className="relative">
                              <details
                                className="group"
                                open={openActionId === orderId}
                                onToggle={(e) => {
                                  if (e.target.open) {
                                    setOpenActionId(orderId);
                                  } else if (openActionId === orderId) {
                                    setOpenActionId(null);
                                  }
                                }}
                              >
                                <summary className="list-none cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-800 dark:hover:bg-zinc-800">
                                  Acciones
                                </summary>

                                <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                                  <button
                                    onClick={() => {
                                      handleView(order);
                                    }}
                                    className="block w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
                                  >
                                    Ver detalles
                                  </button>
                                </div>
                              </details>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
                  <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Anterior
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {pageNumbers.map((page, idx) =>
                        page === '...' ? (
                          <span
                            key={`dots-${idx}`}
                            className="px-2 text-zinc-500 dark:text-zinc-400"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-w-10 rounded-xl px-3 py-2 text-sm font-medium transition ${
                              currentPage === page
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOrdenUnicaVisible && selectedOrder && (
        <ModalOrdenUnica pedido={selectedOrder} onClose={closeModalOrdenUnica} />
      )}
    </>
  );
};

export default ModalOrdenes;