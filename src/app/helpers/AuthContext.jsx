// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useDispatch, useSelector } from 'react-redux';

import { database } from '../../firebase_config';
import { setUserData, clearUserData } from '../../modules/Login_page/components/LoginSide/components/slices/AuthReducer';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const fetchPerfilDeDB = async (uid) => {
    const userRef = ref(database, `usuarios/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    const dispatch = useDispatch();
    const authState = useSelector(state => state.AuthSlice);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (!user) {
                dispatch(clearUserData());
            return;
            }

            // Declaras una función async interna
            const syncPerfil = async () => {
                // si ya tienes los datos en Redux, no vuelvas a ir a la DB
                if (authState.uid === user.uid && authState.nombre && authState.rol) {
                    return;
                }

                try {
                    const perfil = await fetchPerfilDeDB(user.uid);
                    dispatch(setUserData({
                        uid: user.uid,
                        nombre: perfil.nombre,
                        rol: perfil.rol,
                    }));
                } catch (e) {
                    console.error("Error cargando perfil:", e);
                    // aquí decides si haces clearUserData, pones un flag de error, etc.
                }
            };

        // Llamas la función async (sin await, porque onAuthStateChanged no espera nada)
            syncPerfil();
        });

        return unsubscribe;
    }, [auth, dispatch, authState.uid, authState.nombre, authState.rol]);

    const value = {
        currentUser,
        loading
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
