import React from 'react';
import ReactEcharts from 'echarts-for-react';
import getMonthName from './helpers/getMonthName';
import { useSelector } from 'react-redux';

const LinearChart = ({ data = [] }) => {
    const darkMode = useSelector((state) => state.DarkModeToggler.isDark);

    // Procesar pedidosFiltrados → datos de gráfica
    const chartData = React.useMemo(() => {
        if (!data.length) return { xAxisData: [], seriesData: [] };

        // Agrupar por día/mes según periodo
        const ingresosPorPeriodo = {};
        
        data.forEach(pedido => {
            const fecha = pedido.fecha;
            let key;
            
            // Determinar granularidad según periodo (puedes pasarlo como prop también)
            if (fecha === new Date().toISOString().split('T')[0]) {
                // Hoy: mostrar por hora
                key = pedido.horaCierre || 'Sin hora';
            } else {
                // Otros periodos: por día
                key = fecha;
            }

            if (!ingresosPorPeriodo[key]) {
                ingresosPorPeriodo[key] = 0;
            }
            ingresosPorPeriodo[key] += Number(pedido.granTotal || pedido.total || 0);
        });

        const xAxisData = Object.keys(ingresosPorPeriodo).sort();
        const seriesData = xAxisData.map(fecha => ingresosPorPeriodo[fecha]);

        return {
            xAxisData: xAxisData.map(fecha => 
                fecha.includes('-') ? fecha.split('-').slice(2).join('-') : fecha
            ),
            seriesData
        };
    }, [data]);

    const { xAxisData, seriesData } = chartData;

    const option = {
        darkMode: darkMode,
        title: {
            text: 'Ganancias por período',
            left: 'center',
            textStyle: {
                color: "#DD2F6E"
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: 'Ingresos ($)'
        },
        grid: {
            bottom: '15%',
            left: '8%',
            right: '5%'
        },
        series: [
            {
                name: 'Ingresos',
                data: seriesData,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(220, 220, 220, 0.8)'
                },
                itemStyle: {
                    color: '#DD2F6E'
                }
            }
        ]
    };

    return (
        <ReactEcharts
            style={{
                width: '100%',
                height: '100%',
            }}
            option={option}
        />
    );
};

export default LinearChart;