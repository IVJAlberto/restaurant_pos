import { createSlice } from '@reduxjs/toolkit';

const mesaSeleccionSlice = createSlice({
    name: 'mesaSeleccion',
    initialState: { isVisible: false },
    reducers: {
        toggleVisibility: (state) => {
            state.isVisible = !state.isVisible;
        },
    },
});

export const { toggleVisibility } = mesaSeleccionSlice.actions;
export default mesaSeleccionSlice.reducer;
