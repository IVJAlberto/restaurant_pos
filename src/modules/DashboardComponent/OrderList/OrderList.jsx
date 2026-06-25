import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";

const OrderList = ({ data = [], onVerPedidos, onVerPedido }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const buttonRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.closest('[class*="text-blue"]')) return;
            if (!buttonRefs.current[openMenuId]?.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const orders = useMemo(() => {
        return [...data]
            .sort((a, b) => new Date(b.timestampCierre || 0) - new Date(a.timestampCierre || 0))
            .slice(0, 10)
            .map((pedido, index) => ({
                raw: pedido,
                no: `# ${index + 1}`,
                id: `# ${String(pedido.id || "").slice(-6) || "N/A"}`,
                date: pedido.fecha || "N/A",
                table: pedido.mesa || "N/A",
                paymentMethod: pedido.metodoPago || pedido.seleccionadoMetodoPago || "N/A",
                price: `$ ${Number(pedido.granTotal || pedido.total || 0).toFixed(2)}`,
            }));
    }, [data]);

    const categories = {
        no: "No.",
        date: "Fecha",
        table: "Mesa",
        price: "Total",
        btnDetails: "Acciones",
    };

    const categoryKeys = Object.keys(categories);

    const getContainerHeight = () => {
        const rowHeight = 64; // px aproximado por fila (py-2 + contenido)
        const minHeight = 384; // 6 filas visibles mínimo
        const menuSpace = 120; // espacio para dropdown
        const idealHeight = Math.max(minHeight, Math.min(rowHeight * orders.length + menuSpace, 384));
        return `${idealHeight}px`;
    };

    const calculatePosition = useCallback((buttonRect, containerRect) => {
        if (buttonRect && containerRect) {
            const relativeTop = buttonRect.bottom - containerRect.top;
            const spaceBelow = containerRect.height - relativeTop;
            
            // Si hay espacio abajo, abrir hacia abajo
            if (spaceBelow > 120) {
                setMenuPosition({
                    top: relativeTop + 8,
                    right: containerRect.width - buttonRect.right + containerRect.left + 8
                });
            } else {
                // Si no hay espacio, abrir hacia arriba
                setMenuPosition({
                    top: relativeTop - 120 - 8,
                    right: containerRect.width - buttonRect.right + containerRect.left + 8
                });
            }
        }
    }, []);

    const toggleMenu = (e, id, orderIndex) => {
        e.stopPropagation();
        const button = buttonRefs.current[id];
        
        if (openMenuId === id) {
            setOpenMenuId(null);
        } else {
            if (button) {
                const buttonRect = button.getBoundingClientRect();
                const container = button.closest('.order-list-container');
                const containerRect = container?.getBoundingClientRect();
                calculatePosition(buttonRect, containerRect);
            }
            setOpenMenuId(id);
        }
    };

    const findOrderById = useCallback((id) => {
        return orders.find((order, index) => (order.raw.id || index) === id);
    }, [orders]);

    const handleView = (order) => {
        setOpenMenuId(null);
        onVerPedido?.(order.raw);
    };

    return (
        <div className="w-full md:w-7/12 bg-primary-foreground shadow-md rounded-2xl relative z-40 order-list-container">
            <div className="flex justify-between px-5 py-4">
                <p className="font-semibold text-xl text-primary">Lista de órdenes</p>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onVerPedidos?.();
                    }}
                    className="font-medium text-secondary"
                >
                    Ver todas
                </button>
            </div>

            <div className="flex flex-row bg-gray-200 px-5 py-3 border-y">
                {categoryKeys.map((categoryKey) => (
                    <div
                        key={categoryKey}
                        className={`flex flex-col items-start text-center pr-3 flex-1 ${
                            categoryKey === "btnDetails" ? "items-center" : ""
                        }`}
                    >
                        <p className="text-secondary text-sm font-medium">
                            {categories[categoryKey]}
                        </p>
                    </div>
                ))}
            </div>

            <div 
                className="overflow-y-auto" 
                style={{ height: getContainerHeight(), minHeight: '240px' }}
            >
                {orders.length > 0 ? (
                    <div className="space-y-1 pb-4">
                        {orders.map((order, orderIndex) => {
                            const orderId = order.raw.id || orderIndex;
                            return (
                                <div
                                    key={orderId}
                                    className="flex flex-row items-center py-2 px-5 duration-100 border-b border-transparent hover:bg-zinc-100 hover:border-zinc-200 last:border-b-0"
                                >
                                    <div className="flex flex-col flex-1 items-start pr-3">
                                        <p className="text-sm font-medium">{order.no}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 items-start pr-3">
                                        <p className="text-sm font-medium">{order.date}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 items-start pr-3">
                                        <p className="text-sm font-medium">{order.table}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 items-start pr-3">
                                        <p className="text-sm font-medium">{order.price}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 items-center">
                                        <button
                                            ref={(el) => {
                                                if (el) buttonRefs.current[orderId] = el;
                                                else delete buttonRefs.current[orderId];
                                            }}
                                            type="button"
                                            onClick={(e) => toggleMenu(e, orderId, orderIndex)}
                                            className="rounded-lg p-1 hover:bg-zinc-200 duration-100 focus:outline-none relative z-10"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-7 h-7"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No hay órdenes en este periodo</p>
                    </div>
                )}
            </div>

            {/* DROPDOWN SIEMPRE VISIBLE */}
            {openMenuId && findOrderById(openMenuId) && (
                <div 
                    className="absolute bg-white border border-zinc-200 shadow-xl rounded-xl z-[100] py-1 min-w-[160px] animate-in fade-in duration-200"
                    style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`
                    }}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleView(findOrderById(openMenuId));
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 flex items-center gap-2 font-medium text-zinc-800"
                    >
                        Ver detalles
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderList;