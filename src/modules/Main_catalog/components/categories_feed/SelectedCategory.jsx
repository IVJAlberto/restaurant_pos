import React, { useEffect, useState } from "react";
import ProductCard from "../dish_component/Product_card";
import TextHeader from "../../../../UI/textHeader";
import { useSelector } from "react-redux";
import { database } from "../../../../firebase_config";
import { ref, onValue, off } from "firebase/database";

const SelectedCategory = () => {
  
  const [dishes, setDishes] = useState({});
  const selectedCategory = useSelector((state) => state.Categories.selectedCategory);

  useEffect(() => {
    const dishesRef = ref(database, "platillos");
    
    onValue(dishesRef, (snapshot) => {
      const data = snapshot.val();
      setDishes(data || {});
    });

    return () => {
      off(dishesRef, "value");
    };
  }, []);

  const filteredDishes = selectedCategory === "All" ? Object.keys(dishes) : [selectedCategory];

  return (
    <>
      <TextHeader text="Explora nuestro increíble menú" size="text-md md:text-xl p-4" color="text-zinc-950 dark:text-gray-300"/>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-10 lg:gap-4">
      {filteredDishes.map((category) => (
              dishes[category].map((value, dishIndex) => (
                <ProductCard key={`${category}-${dishIndex}`} platillo={value}/>
              ))
          ))}
      </div>
    </>
  );
};

export default SelectedCategory;
