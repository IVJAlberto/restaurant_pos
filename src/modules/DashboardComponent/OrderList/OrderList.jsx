import React, { useEffect, useMemo, useState } from "react";

const OrderList = ({ data = [], onViewAll }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
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

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId((prev) => (prev === id ? null : id));
    };

    const closeMenu = (e) => {
        e.stopPropagation();
        setOpenMenuId(null);
    };

    return (
        <div className="w-full md:w-7/12 border bg-white rounded-2xl border-zinc-300">
            <div className="flex justify-between px-5 py-4">
                <p className="font-semibold text-xl">Lista de órdenes</p>
                <button
                    type="button"
                    onClick={() => onViewAll?.()}
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                    Ver todas
                </button>
            </div>

            <div className="flex flex-row bg-gray-200 px-5 py-3 border-y border-zinc-300">
                {categoryKeys.map((categoryKey) => (
                    <div
                        key={categoryKey}
                        className={`flex flex-col items-start text-center pr-3 flex-1 ${
                            categoryKey === "btnDetails" ? "items-center" : ""
                        }`}
                    >
                        <p className="text-zinc-500 text-sm font-medium">
                            {categories[categoryKey]}
                        </p>
                    </div>
                ))}
            </div>

            {orders.length > 0 ? (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                    {orders.map((order, orderIndex) => (
                        <div
                            key={`${order.raw.id || orderIndex}`}
                            className="flex flex-row items-center py-2 px-5 duration-100 border-y border-transparent hover:bg-zinc-100 hover:border-zinc-200"
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

                            <div className="flex flex-col flex-1 items-center pr-3 relative">
                                <button
                                    type="button"
                                    onClick={(e) => toggleMenu(e, order.raw.id || orderIndex)}
                                    className="rounded-lg p-1 hover:bg-zinc-200 duration-100 focus:outline-none"
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

                                {openMenuId === (order.raw.id || orderIndex) && (
                                    <div
                                        className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-lg z-50 min-w-[150px] py-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeMenu(new Event("click"));
                                                onViewAll?.(order.raw);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <span>Ver todo</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <span>Reimprimir</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2"
                                        >
                                            <span>Duplicar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-gray-500">
                    <p>No hay órdenes en este periodo</p>
                </div>
            )}
        </div>
    );
};

export default OrderList;