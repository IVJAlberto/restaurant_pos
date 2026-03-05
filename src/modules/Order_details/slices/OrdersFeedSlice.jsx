import { createSlice } from "@reduxjs/toolkit";

const OrdersFeedSlice = createSlice({
    name: 'OrdersFeed',
    initialState: {
        PlatillosSeleccionados: [],
        totalPedido: 0,
    },
    reducers: {
        agregarPlatillo: (state, action) => {
            const nuevoPlatillo = action.payload;
            const platilloExistente = state.PlatillosSeleccionados.find(dish => dish.nombre === nuevoPlatillo.nombre);

            if (platilloExistente) {
                platilloExistente.cantidad += 1;
            } else {
                state.PlatillosSeleccionados.push({ ...nuevoPlatillo, cantidad: 1 });
            }

            state.totalPedido += nuevoPlatillo.precio;
        },
        eliminarPlatillo: (state, action) => {
            const nombrePlatillo = action.payload;
            const platilloAEliminar = state.PlatillosSeleccionados.find(dish => dish.nombre === nombrePlatillo);

            if (platilloAEliminar) {
                if (platilloAEliminar.cantidad > 1) {
                    platilloAEliminar.cantidad -= 1;
                } else {
                    state.PlatillosSeleccionados = state.PlatillosSeleccionados.filter(dish => dish.nombre !== nombrePlatillo);
                }

                state.totalPedido -= platilloAEliminar.precio;
            }
        },
        eliminarTodosLosPlatillos: (state, action) => {
            const nombrePlatillo = action.payload;
            const platilloAEliminar = state.PlatillosSeleccionados.find(dish => dish.nombre === nombrePlatillo);

            if (platilloAEliminar) {
                state.PlatillosSeleccionados = state.PlatillosSeleccionados.filter(dish => dish.nombre !== nombrePlatillo);
                state.totalPedido -= platilloAEliminar.precio * platilloAEliminar.cantidad;
            }
        },
        setOrdenPedidos: (state, action) => {
            const { PlatillosSeleccionados, totalPedido } = action.payload;
            state.PlatillosSeleccionados = PlatillosSeleccionados;
            state.totalPedido = totalPedido;
          },  
    },
});

export const { eliminarPlatillo, agregarPlatillo, eliminarTodosLosPlatillos, setOrdenPedidos } = OrdersFeedSlice.actions;
export default OrdersFeedSlice.reducer;