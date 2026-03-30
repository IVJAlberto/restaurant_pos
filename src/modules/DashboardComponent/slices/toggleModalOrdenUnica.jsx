import { createSlice } from '@reduxjs/toolkit';

const modalSliceOrdenUnica = createSlice({
  name: 'modalOrdenUnica',
  initialState: {
    isModalVisible: false,
  },
  reducers: {
    toggleModal: (state) => {
        state.isModalVisible = !state.isModalVisible;
    }
}
});

export const { toggleModal } = modalSliceOrdenUnica.actions;
export default modalSliceOrdenUnica.reducer;
