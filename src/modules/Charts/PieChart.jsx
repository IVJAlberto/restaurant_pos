import React from 'react';
import ReactEChart from 'echarts-for-react';
import { useSelector } from 'react-redux';

const PieChart = ({ data = [] }) => {
    const darkMode = useSelector((state) => state.DarkModeToggler.isDark);

    // Contar platillos más populares desde pedidosFiltrados
    const platillosData = React.useMemo(() => {
        if (!data.length) return [];

        const conteoPlatillos = {};

        data.forEach(pedido => {
            pedido.platillos?.forEach(platillo => {
                const nombre = platillo.nombre || platillo.platillo || 'Desconocido';
                conteoPlatillos[nombre] = (conteoPlatillos[nombre] || 0) + platillo.cantidad;
            });
        });

        // Top 6 platillos más vendidos
        return Object.entries(conteoPlatillos)
            .map(([nombre, cantidad]) => ({
                name: nombre,
                value: cantidad
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [data]);

    const option = {
        darkMode: darkMode,
        title: {
            text: 'Platillos más populares',
            left: 'center',
            textStyle: {
                color: "#DD2F6E"
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 20,
            bottom: 20,
        },
        series: [
            {
                name: 'Platillos',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                data: platillosData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    }
                },
                label: {
                    show: true,
                    formatter: '{b}: {c} ({d}%)'
                }
            }
        ]
    };

    return (
        <ReactEChart
            style={{
                width: '100%',
                height: '100%',
            }}
            option={option}
        />
    );
};

export default PieChart;