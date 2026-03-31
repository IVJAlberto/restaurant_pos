import { createSlice } from "@reduxjs/toolkit";

const AuthReducer = createSlice({
  name: 'auth',
  initialState: {
    uid: null,
    nombre: null,
    rol: null,
    loading: true
  },
  reducers: {
    setUserData: (state, action) => {
      state.uid = action.payload.uid;
      state.nombre = action.payload.nombre;
      state.rol = action.payload.rol;
      state.loading = false;
    },
    clearUserData: (state) => {
      state.uid = null;
      state.nombre = null;
      state.rol = null;
      state.loading = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTempUID: (state, action) => {
        state.uid = action.payload;
        state.loading = true;
    },
  }
});

export const { setUserData, clearUserData, setLoading, setTempUID } = AuthReducer.actions;
export default AuthReducer.reducer;