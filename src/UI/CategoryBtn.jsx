import React from "react";

import { useSelector, useDispatch } from 'react-redux';
import { setCategoriaSeleccionada } from '../modules/Main_catalog/components/slices/CategoriaSeleccionadaSlice';

const CategoryBtn = ({ nombre="", imagen }) => {
  const dispatch = useDispatch();
  const categoriaSeleccionada = useSelector((state) => state.Categorias.categoriaSeleccionada);

  const handleCategoriaSeleccionada = () => {
    dispatch(setCategoriaSeleccionada(nombre));
  };

  const isSelected = categoriaSeleccionada === nombre;
  let style = "flex items-center justify-center min-w-[40px] md:min-w-[60px] rounded-3xl px-4 py-2.5 font-semibold shadow-md hover:shadow-lg duration-100 bg-background hover:text-primary-foreground hover:bg-secondary/25";
  style += isSelected ? " bg-secondary/25 hover:bg-primary text-primary-foreground" : " bg-gray-200 hover:bg-gray-300 text-zinc-950";

  return (
    <button onClick={handleCategoriaSeleccionada} className={style}>
      <img src={imagen} alt="Pasta Icon" className="mr-2 w-6 h-6 md:w-7 md:h-7 rounded-full" />
      <span className="text-sm md:text-lg">{nombre}</span>
    </button>
  );
};

export default CategoryBtn;