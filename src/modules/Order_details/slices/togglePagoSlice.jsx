import { createSlice } from '@reduxjs/toolkit';

const pagoSlice = createSlice({
  name: 'pagoModal',
  initialState: {
    isModalVisible: false,
    mesaData: null, 
    carritoLocal: [] 
  },
  reducers: {
    toggleModal: (state) => {
        state.isModalVisible = !state.isModalVisible;
    },
    agregarMesaData: (state, action) => {  
      state.mesaData = action.payload;
    },
    limpiarMesaData: (state) => {  
      state.mesaData = null;
      state.carritoLocal = [];
    }
}
});

export const { toggleModal, agregarMesaData, limpiarMesaData } = pagoSlice.actions;
export default pagoSlice.reducer;
