import React, { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase_config"; // Ajusta la ruta según tu config
import ModuleHeaderName from "../../UI/ModuleHeaderName";
import TextHeader from "../../UI/textHeader";
import StatisticalComponent from "./StatisticalComponent/StatisticalComponent";
import LinearChart from "../Charts/LinearChart";
import ChartPie from "../Charts/PieChart";
import ChartWrapper from "./ChartWrapper/ChartWrapper";
import OrderList from "./OrderList/OrderList";
import Report from "./Report/Report";
import { useSelector, useDispatch } from 'react-redux';
import { toggleModal as toggleModalOrdenUnica } from './slices/toggleModalOrdenUnica';
import { toggleModal as toggleModalOrdenes } from './slices/toggleModalOrdenes';
import ModalOrdenUnica from "../Modal/ModalOrdenUnica";
import ModalOrdenes from "../Modal/ModalOrdenes";

const DashboardComponent = () => {
    const dispatch = useDispatch();
    const [periodo, setPeriodo] = useState("día");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [historicoPedidos, setHistoricoPedidos] = useState({});
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

    const modalOrdenUnica = useSelector(state => state.OrdenUnicaSlice.isModalVisible);
    const modalOrdenes = useSelector(state => state.OrdenesSlice.isModalVisible);

    const handleVerPedido = (pedido) => {
        setPedidoSeleccionado(pedido);
        dispatch(toggleModalOrdenUnica());
    };

    const handleVerPedidos = (pedidos) => {
        // setPedidoSeleccionado(null);
        dispatch(toggleModalOrdenes());
    };

    // Conexión a Firebase Realtime DB
    useEffect(() => {
        const historicoRef = ref(database, "historicoPedidos");
        const unsubscribe = onValue(historicoRef, (snapshot) => {
            setHistoricoPedidos(snapshot.val() || {});
        }, (error) => {
            console.error("Error leyendo historicoPedidos:", error);
        });

        return () => unsubscribe();
    }, []);

    // Filtrar pedidos según periodo seleccionado
    const pedidosFiltrados = useMemo(() => {
        const hoy = new Date();
        const y = hoy.getFullYear();
        const m = String(hoy.getMonth() + 1).padStart(2, "0");
        const d = String(hoy.getDate()).padStart(2, "0");
        const fechaHoy = `${y}-${m}-${d}`;

        const pedidosFlat = [];

        Object.entries(historicoPedidos).forEach(([fecha, pedidosPorDia]) => {
            // Filtros por periodo
            const dentroDelPeriodo =
                periodo === "año" ? fecha.startsWith(`${y}-`) :
                periodo === "mes" ? fecha.startsWith(`${y}-${m}`) :
                periodo === "día" ? fecha === fechaHoy :
                periodo === "personalizado" ?
                    (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin) :
                false;

            if (dentroDelPeriodo && pedidosPorDia) {
                Object.entries(pedidosPorDia).forEach(([id, pedido]) => {
                    pedidosFlat.push({ id, ...pedido, fecha });
                });
            }
        });

        return pedidosFlat;
    }, [historicoPedidos, periodo, fechaInicio, fechaFin]);

    // Extraer pedidos del periodo anterior para comparación
    const periodoAnterior = useMemo(() => {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const mesAnterior = new Date();
        mesAnterior.setMonth(mesAnterior.getMonth() - 1);
        const añoAnterior = new Date();
        añoAnterior.setFullYear(añoAnterior.getFullYear() - 1);

        const fechaAyer = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`;
        const fechaMesAnt = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}`;
        const fechaAñoAnt = `${añoAnterior.getFullYear()}`;

        const pedidosAnterior = [];

        Object.entries(historicoPedidos).forEach(([fecha, pedidosPorDia]) => {
            const dentroPeriodoAnterior =
                periodo === "día" ? fecha === fechaAyer :
                periodo === "mes" ? fecha.startsWith(fechaMesAnt) :
                periodo === "año" ? fecha.startsWith(fechaAñoAnt) :
                [];

            if (dentroPeriodoAnterior && pedidosPorDia) {
                Object.values(pedidosPorDia).forEach(pedido => {
                    pedidosAnterior.push(pedido);
                });
            }
        });

        return pedidosAnterior;
    }, [historicoPedidos, periodo]);

    // Metricas calculadas para mostrar en los componentes estadísticos
    const metrics = useMemo(() => {
        const totalIngresos = pedidosFiltrados.reduce(
            (acc, pedido) => acc + Number(pedido.granTotal || pedido.total || 0),
            0
        );
        const cantidadPedidos = pedidosFiltrados.length;
        const ingresoPromedio = cantidadPedidos > 0 ? totalIngresos / cantidadPedidos : 0;

        const ingresosAnterior = periodoAnterior.reduce(
            (acc, pedido) => acc + Number(pedido.granTotal || pedido.total || 0),
            0
        );
        const cantidadAnterior = periodoAnterior.length;
        const trendIngresos = ingresosAnterior > 0 
            ? ((totalIngresos - ingresosAnterior) / ingresosAnterior * 100).toFixed(1) 
            : 0;
        const trendPedidos = cantidadAnterior > 0 
            ? ((cantidadPedidos - cantidadAnterior) / cantidadAnterior * 100).toFixed(1) 
            : 0;

        return [
            {
                titulo: "Ingresos Totales",
                valor: totalIngresos,
                trend: `${trendIngresos}%`,
            },
            {
                titulo: "Ingreso Promedio",
                valor: ingresoPromedio,
                trend: "+8.2%", // Calcular si quieres
            },
            {
                titulo: "Cantidad de Pedidos",
                valor: cantidadPedidos,
                trend: `${trendPedidos}%`,
            },
        ];
    }, [pedidosFiltrados, periodoAnterior]); 

    return (
        <div className="flex flex-1 flex-col bg-zinc-100 dark:bg-zinc-800">
            <ModuleHeaderName bgColor="bg-zinc-200 dark:bg-stone-950">
                <div className="w-full flex items-center justify-between gap-4">
                    <TextHeader
                        text="Estadísticas"
                        color="text-zinc-950 dark:text-gray-300"
                        size="text-xl"
                    />

                    <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Periodo
                        </label>

                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                        >
                            <option value="día">Hoy</option>
                            <option value="mes">Mes</option>
                            <option value="año">Año</option>
                            <option value="personalizado">Personalizado</option>
                        </select>

                        {periodo === "personalizado" && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                                <span className="text-zinc-600 dark:text-zinc-300 text-sm">a</span>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </ModuleHeaderName>

            <div className="p-4 space-y-5 overflow-auto flex flex-col flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {metrics.map((item, index) => (
                        <div key={index}>
                            <StatisticalComponent element={item} />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row w-full space-y-5 md:space-y-0 md:space-x-5">
                    <ChartWrapper chart={<LinearChart data={pedidosFiltrados} periodo={periodo}/>} />
                    <ChartWrapper chart={<ChartPie data={pedidosFiltrados} />} />
                </div>

                <div className="w-full flex flex-col md:flex-row flex-grow space-y-5 md:space-y-0 md:space-x-5">
                    <OrderList data={pedidosFiltrados} onVerPedidos={handleVerPedidos} onVerPedido={handleVerPedido} periodo={periodo} />
                    <Report data={pedidosFiltrados} />
                </div>
            </div>

            {modalOrdenUnica && pedidoSeleccionado && (<ModalOrdenUnica pedido={pedidoSeleccionado} />)}
            {modalOrdenes && (<ModalOrdenes pedidos={pedidosFiltrados} periodo={periodo}/>)}
        </div>
    );
};

export default DashboardComponent;