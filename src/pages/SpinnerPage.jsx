import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { database } from '../firebase_config';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../modules/Login_page/components/LoginSide/components/slices/AuthReducer';

const SpinnerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid, loading: reduxLoading } = useSelector(state => state.AuthSlice);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      navigate('/');
      return;
    }

    const userRef = ref(database, `usuarios/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      setLocalLoading(false);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Dispatch datos completos
        dispatch(setUserData({
          uid,
          nombre: userData.nombre || userData.name,
          rol: userData.rol || userData.role
        }));

        // Redirigir según rol
        const rol = userData.rol || userData.role;
        switch (rol) {
          case 'Administrador':
            navigate('/dashboard');
            break;
          case 'Cocinero':
            navigate('/cocina');
            break;
          case 'Mesero':
            navigate('/food_catalog');
            break;
          default:
            navigate('/food_catalog'); // Fallback
        }
      } else {
        dispatch(setUserData({
          uid,
          name: 'Usuario',
          rol: 'mesero'
        }));
        navigate('/food_catalog');
      }
    });

    return () => {
      unsubscribe();
      setLocalLoading(true);
    };
  }, [uid, dispatch, navigate]);


  if (reduxLoading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"></div>
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          ¡Perfil cargado!
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Redirigiendo según tu rol...
        </p>
      </div>
    </div>
  );
};

export default SpinnerPage;