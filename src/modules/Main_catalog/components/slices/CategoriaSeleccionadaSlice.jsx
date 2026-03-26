import { createSlice } from "@reduxjs/toolkit";

const categoriaSeleccionadaSlice = createSlice({
    name: 'Categorias',
    initialState: {
        categoriaSeleccionada: 'All'
    },
    reducers: {
        setCategoriaSeleccionada: (state, action) => {
            state.categoriaSeleccionada = (action.payload); 
        }
    }
});

export const { setCategoriaSeleccionada} = categoriaSeleccionadaSlice.actions;
export default categoriaSeleccionadaSlice.reducer;