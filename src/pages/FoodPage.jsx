import React from "react";
import Sidebar from "../modules/Sidebar/Sidebar";
import Catalog from "../modules/Main_catalog/catalog";
import OrderDetails from "../modules/Order_details/OrderDetails";
import {  useSelector } from "react-redux";
import ModalPedido from "../modules/Modal/ModalPedido";
import TableNumberModal from "../modules/TableNumberModal/TableNumberModal"
import { ModalPago } from './../modules/Modal/ModalPago';
import ModalMesa from './../modules/Modal/ModalMesa';

function FoodPage() {

    const isOpen = useSelector(state => state.ToggleTableModal.isToggleModalVisible);
    const modalPedidoVisibility = useSelector(state => state.ModalSlice.isModalVisible);
    const modalPagoVisibility = useSelector(state => state.PagoSlice.isModalVisible);
    const modalMesaVisibility = useSelector(state => state.MesaSeleccion.isVisible);
    
    return (
      <div className="flex flex-col md:flex-row">
        {/* Se quitó la funcionalidad del modal para la mesa porque se selecciona desde el menú de orden */}
        {/* {isOpen && <TableNumberModal />}  */}
        <Sidebar/>
        <Catalog /> 
        <OrderDetails />
        {modalPedidoVisibility && <ModalPedido />}
        {modalPagoVisibility && <ModalPago />}
        {modalMesaVisibility && <ModalMesa />}
      </div>
    );
  }
  
export default FoodPage;
