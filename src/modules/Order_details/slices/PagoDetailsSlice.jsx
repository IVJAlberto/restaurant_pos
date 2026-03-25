import { createSlice } from "@reduxjs/toolkit";

const PagoDetailsSlice = createSlice({
    name: 'PagoSlice',
    initialState: {
        isVisible: false
    },
    reducers: {
        toggleVisibility: (state) => {
            state.isVisible = !state.isVisible;
        }
    }
})

export const { toggleVisibility } = PagoDetailsSlice.actions;
export default PagoDetailsSlice.reducer;