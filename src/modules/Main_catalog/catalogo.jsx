import React from 'react';
import Categorias from './components/categories_feed/categorias';
import CategoriaSeleccionada from './components/categories_feed/CategoriaSeleccionada';
import TextHeader from '../../UI/textHeader';
import CheckoutBtn from '../../UI/CheckoutBtn';
import MesaSelector from '../Order_details/components/CommonOrderDetails/MesaSelector';

const Catalogo = () => {

  return (
    <div className="w-full flex flex-1 flex-col md:w-10/12 lg:w-9/12">
      <div className='z-50 sticky top-0 bg-primary-foreground'>
        <div className='flex justify-between items-center py-3 md:h-24 px-5'>
          <TextHeader text="Menú" color="text-black" size="text-xl" />
          <MesaSelector origen={"catalogo"}/>
          <CheckoutBtn displayOnBig={true}/>
        </div>
          <Categorias />
      </div>
      <div className='px-2 bg-primary-foreground overflow-hidden'>
        <CategoriaSeleccionada />
      </div>
    </div>
  );
};

export default Catalogo;