import React from 'react';
import NotificationGif from "../assets/common_icons/done.gif"
import close from "../assets/common_icons/close.png"

const Toast = ({type='platillo', gif="bien"}) => {
  const opciones = {
    'platillo': 'El platillo fue agregado correctamente.',
    'order': 'Order was placed succesfully.',
    'no_mesa': 'Selecciona una mesa antes de agregar un platillo.'

  }

  return (
    <div className='flex text-center space-x-2 font-light bg-white rounded-xl px-6 py-3 border border-zinc-300 shadow-md'>
      {
        gif === "bien" ?
          <img src={NotificationGif} className="w-6 h-6" alt="success animation" loop={false}/>
          :
          <img src={close} className="w-6 h-6" alt="success animation" loop={false}/>
        
      }
      <p>{opciones[type]}</p>
    </div>
  );
};

export default Toast;