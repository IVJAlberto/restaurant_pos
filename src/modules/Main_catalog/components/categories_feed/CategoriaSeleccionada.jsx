import React, { useEffect, useState } from "react";
import ProductCard from "../dish_component/Product_card";
import TextHeader from "../../../../UI/textHeader";
import { useSelector } from "react-redux";
import { database } from "../../../../firebase_config";
import { ref, onValue, off } from "firebase/database";

const CategoriaSeleccionada = () => {
  
  const [platillos, setPlatillos] = useState(null);
  const categoriaSeleccionada = useSelector((state) => state.Categorias.categoriaSeleccionada);

  useEffect(() => {
    const platillosRef = ref(database, "platillos");
    
    onValue(platillosRef, (snapshot) => {
      const data = snapshot.val();
      setPlatillos(data || {});
    });

    return () => {
      off(platillosRef, "value");
    };
  }, []);

  if (!platillos) return <p className="p-5 text-zinc-500 dark:text-zinc-400">Cargando menú...</p>;

  const platillosFiltrados = categoriaSeleccionada === "All" ? Object.keys(platillos) : [categoriaSeleccionada];

  return (
    <>
      <TextHeader text="Explora nuestro increíble menú" size="text-md md:text-xl p-4" color="text-zinc-950 dark:text-gray-300"/>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-10 lg:gap-4">
      {platillosFiltrados.map((categoria) => (
              platillos[categoria || []].map((value, dishIndex) => (
                <ProductCard key={`${categoria}-${dishIndex}`} platillo={value}/>
              ))
          ))}
      </div>
    </>
  );
};

export default CategoriaSeleccionada;
