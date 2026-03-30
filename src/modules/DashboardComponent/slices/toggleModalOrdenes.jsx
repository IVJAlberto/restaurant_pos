import { createSlice } from '@reduxjs/toolkit';

const modalSliceOrdenes = createSlice({
  name: 'modalOrdenes',
  initialState: {
    isModalVisible: false,
  },
  reducers: {
    toggleModal: (state) => {
        state.isModalVisible = !state.isModalVisible;
    }
}
});

export const { toggleModal } = modalSliceOrdenes.actions;
export default modalSliceOrdenes.reducer;
