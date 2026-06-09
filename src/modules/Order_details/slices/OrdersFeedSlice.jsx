import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordenesPorMesa: {}
};

const getMesaState = (state, mesaId) => {
  console.log(mesaId);
  
  if (!state.ordenesPorMesa[mesaId]) {
    state.ordenesPorMesa[mesaId] = {
      PlatillosSeleccionados: [],
      totalPedido: 0,
    };
  }

  return state.ordenesPorMesa[mesaId];
};

const OrdersFeedSlice = createSlice({
  name: "OrdersFeed",
  initialState,
  reducers: {
    agregarPlatillo: (state, action) => {
      const { mesaId, platillo } = action.payload;
      const mesa = getMesaState(state, mesaId);

      const platilloExistente = mesa.PlatillosSeleccionados.find(
        (dish) => dish.nombre === platillo.nombre
      );

      if (platilloExistente) {
        platilloExistente.cantidad += 1;
      } else {
        mesa.PlatillosSeleccionados.push({
          ...platillo,
          cantidad: 1,
        });
      }

      mesa.totalPedido += platillo.precio;
    },

    eliminarPlatillo: (state, action) => {
      const { mesaId, nombrePlatillo } = action.payload;
      const mesa = getMesaState(state, mesaId);

      const platilloAEliminar = mesa.PlatillosSeleccionados.find(
        (dish) => dish.nombre === nombrePlatillo
      );

      if (platilloAEliminar) {
        if (platilloAEliminar.cantidad > 1) {
          platilloAEliminar.cantidad -= 1;
        } else {
          mesa.PlatillosSeleccionados = mesa.PlatillosSeleccionados.filter(
            (dish) => dish.nombre !== nombrePlatillo
          );
        }

        mesa.totalPedido -= platilloAEliminar.precio;
      }
    },

    eliminarTodosLosPlatillos: (state, action) => {
      const { mesaId, nombrePlatillo } = action.payload;
      const mesa = getMesaState(state, mesaId);

      const platilloAEliminar = mesa.PlatillosSeleccionados.find(
        (dish) => dish.nombre === nombrePlatillo
      );

      if (platilloAEliminar) {
        mesa.PlatillosSeleccionados = mesa.PlatillosSeleccionados.filter(
          (dish) => dish.nombre !== nombrePlatillo
        );

        mesa.totalPedido -= platilloAEliminar.precio * platilloAEliminar.cantidad;
      }
    },

    actualizarNotasPlatillo: (state, action) => {
      const { mesaId, nombre, notas } = action.payload;
      const mesa = getMesaState(state, mesaId);

      const platillo = mesa.PlatillosSeleccionados.find(
        (p) => p.nombre === nombre
      );

      if (platillo) {
        platillo.notas = notas;
      }
    },

    setOrdenPedidos: (state, action) => {
      const { mesaId, PlatillosSeleccionados, totalPedido } = action.payload;

      state.ordenesPorMesa[mesaId] = {
        PlatillosSeleccionados,
        totalPedido,
      };
    },

    limpiarOrdenMesa: (state, action) => {
      const { mesaId } = action.payload;
      if (!state.ordenesPorMesa[mesaId]) return;
      
      state.ordenesPorMesa[mesaId] = {
        PlatillosSeleccionados: [],
        totalPedido: 0,
      };
    },

    limpiarTodasLasOrdenes: (state) => {
      state.ordenesPorMesa = {};
    },
  },
});

export const {
  agregarPlatillo,
  eliminarPlatillo,
  eliminarTodosLosPlatillos,
  actualizarNotasPlatillo,
  setOrdenPedidos,
  limpiarOrdenMesa,
  limpiarTodasLasOrdenes,
} = OrdersFeedSlice.actions;

export default OrdersFeedSlice.reducer;