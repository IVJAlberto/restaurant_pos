import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../dish_component/Product_card";
import TextHeader from "../../../../UI/textHeader";
import { useSelector } from "react-redux";
import { database } from "../../../../firebase_config";
import { ref, onValue, off } from "firebase/database";

const CategoriaSeleccionada = () => {
  const [platillos, setPlatillos] = useState(null);
  const categoriaSeleccionada = useSelector(
    (state) => state.Categorias.categoriaSeleccionada
  );

  useEffect(() => {
    const platillosRef = ref(database, "platillos");

    const unsubscribe = onValue(platillosRef, (snapshot) => {
      const data = snapshot.val();
      setPlatillos(data || {});
    });

    return () => {
      off(platillosRef);
    };
  }, []);

  const categoriasAMostrar = useMemo(() => {
    if (!platillos) return [];

    if (categoriaSeleccionada === "Todos") {
      return Object.keys(platillos).filter((categoria) => categoria !== "Todos");
    }

    return [categoriaSeleccionada];
  }, [platillos, categoriaSeleccionada]);

  if (!platillos) {
    return (
      <p className="p-5 text-zinc-500 dark:text-zinc-400">
        Cargando menú...
      </p>
    );
  }

  return (
    <>
      <TextHeader
        text="Explora nuestro increíble menú"
        size="text-md md:text-xl p-4"
        color="text-zinc-950 dark:text-gray-300"
      />

      <div className="grid grid-cols-1 gap-10 p-5 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {categoriasAMostrar.map((categoria) =>
          platillos[categoria]?.map((value, dishIndex) => (
            <ProductCard
              key={`${categoria}-${value.id ?? value.nombre ?? dishIndex}`}
              platillo={value}
            />
          ))
        )}
      </div>
    </>
  );
};

export default CategoriaSeleccionada;