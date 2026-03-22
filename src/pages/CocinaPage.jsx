import React from 'react';
import Sidebar from "../modules/Sidebar/Sidebar";
import DashboardComponent from '../modules/DashboardComponent/DashboardComponent';
import CocinaFeed from '../modules/Cocina/CocinaFeed';

const CocinaPage = () => {
    const timestamp = Date.now();
    const fecha = new Date().toISOString().split('T')[0];
    
    return(
    <div className="flex flex-col md:flex-row w-full h-screen">
        <Sidebar/>
        <CocinaFeed fecha={fecha}/>
  </div>);
};

export default CocinaPage;