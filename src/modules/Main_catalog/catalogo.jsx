import React from 'react';
import Categorias from './components/categories_feed/categorias';
import CategoriaSeleccionada from './components/categories_feed/CategoriaSeleccionada';
import TextHeader from '../../UI/textHeader';
import CheckoutBtn from '../../UI/CheckoutBtn';
import MesaSelector from '../Order_details/components/CommonOrderDetails/MesaSelector';

const Catalogo = () => {

  return (
    <div className="w-full flex flex-1 flex-col md:w-10/12 lg:w-9/12 bg-zinc-100 dark:bg-zinc-800">
      <div className='sticky bg-opacity-90 top-0 flex justify-between items-center py-3 md:h-24 px-5 bg-zinc-200 dark:bg-stone-950'>
        <TextHeader text="Menú" color="text-zinc-950 dark:text-gray-300" size="text-sm md:text-xl" />
        <MesaSelector origen={"catalogo"}/>
        <CheckoutBtn displayOnBig={true}/>
      </div>
      <div className='px-2'>
        <Categorias />
        <CategoriaSeleccionada />
      </div>
    </div>
  );
};

export default Catalogo;