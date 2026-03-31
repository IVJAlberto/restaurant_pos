import { combineReducers } from '@reduxjs/toolkit';

import OrderDetailsReducer from '../modules/Order_details/slices/OrderDetailsSlice';
import CategoriaSeleccionadaSliceReducer from '../modules/Main_catalog/components/slices/CategoriaSeleccionadaSlice';
import OrdersFeedSliceReducer from '../modules/Order_details/slices/OrdersFeedSlice';

import toggleModalSlice from '../modules/Order_details/slices/toggleModalSlice';

import togglePagoSlice from '../modules/Order_details/slices/togglePagoSlice';

import PagoDetailsSlice from '../modules/Order_details/slices/PagoDetailsSlice';

import MesaSeleccionSlice from '../modules/Order_details/slices/MesaSeleccionSlice';

import OrderInformation from '../modules/Order_details/slices/OrderInformation';

import toggleTableModalSlice from '../modules/Order_details/slices/toggleTableModalSlice';

import toggleModalSliceOrdenUnica from '../modules/DashboardComponent/slices/toggleModalOrdenUnica';

import toggleModalSliceOrdenes from '../modules/DashboardComponent/slices/toggleModalOrdenes';

import darkModeVisibility from '../modules/Sidebar/components/ThemeToggler/slices/darkModeVisibility';

import AuthReducer  from '../modules/Login_page/components/LoginSide/components/slices/AuthReducer';

const rootReducer = combineReducers({
  OrderDetails: OrderDetailsReducer,
  Categorias: CategoriaSeleccionadaSliceReducer,
  OrdersFeed: OrdersFeedSliceReducer,
  ModalSlice: toggleModalSlice,
  OrdenUnicaSlice: toggleModalSliceOrdenUnica,
  OrdenesSlice: toggleModalSliceOrdenes,
  PagoSlice: togglePagoSlice,
  PagoDetails: PagoDetailsSlice,
  MesaSeleccion: MesaSeleccionSlice,
  OrderTotal: OrderInformation,
  ToggleTableModal: toggleTableModalSlice,
  DarkModeToggler: darkModeVisibility,
  AuthSlice: AuthReducer ,
});

export default rootReducer;