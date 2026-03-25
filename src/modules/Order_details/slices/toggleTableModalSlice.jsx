import { createSlice } from '@reduxjs/toolkit';

const toggleTableModal = createSlice({
  name: 'tableModal',
  initialState: {
    toggleVisibility: false,
  },
  reducers: {
    toggleModal: (state) => {
        state.toggleVisibility = !state.toggleVisibility;
    }
}
});

export const { toggleModal } = toggleTableModal.actions;
export default toggleTableModal.reducer;