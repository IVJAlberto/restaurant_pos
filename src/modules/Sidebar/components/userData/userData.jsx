import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { database } from "../../../../firebase_config";
import { ref, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";
import { SignOutUser } from "./helpers/signoutUser";
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import { Link } from "react-router-dom";

const UserData = ({ collapsed }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user.uid;

    const [isDataDisplayed, setIsDataDisplayed] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', role: '', image: '' }); // to keep all the userData which i do need for this component.
    const navigate = useNavigate(); 

    const onSignOut = () => {
        SignOutUser(navigate); 
    }

    const displayUserData = () => {
        setIsDataDisplayed(!isDataDisplayed);
    }

    useEffect(() => {
        if (userUID) {
            const userRef = ref(database, `users/${userUID}`);
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserInfo(snapshot.val());
                } else {
                }
            });

            return () => {
                off(userRef);
            };
        }
    }, [userUID]);

    return (
        <div className="relative flex w-full">
            <div onClick={displayUserData} 
                className={`flex w-full justify-normal lg:justify-normal items-center space-x-3 
                 rounded-2xl p-2 bg-zinc-300 dark:bg-zinc-900 duration-100 cursor-pointer
                    ${collapsed ? 'justify-center' : 'justify-start'}`}>
                {
                    collapsed ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-8 w-8 text-gray-700 dark:text-gray-300 self-center"
                            aria-hidden="true"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.93 17.93 0 0112 21.75a17.93 17.93 0 01-3.499-.82z"
                            />
                        </svg>
                    ) : (
                        <div className="ml-5 truncate block md:hidden lg:block">
                            <p className="text-zinc-950 dark:text-gray-300 font-semibold text-md xl:text-lg">{userInfo.name  || "Usuario"}</p>
                            <p className="text-zinc-950 dark:text-gray-400 font-normal truncate text-sm xl:text-normal">{userInfo.role  || "Administrador"}</p>
                        </div>
                    )
                }
            </div>
            {isDataDisplayed && (
                <div className="flex flex-col space-y-2 absolute bottom-20 rounded-xl bg-zinc-300 dark:bg-zinc-900 p-4 w-[200px] text-zinc-950 dark:text-gray-300">         
                    <p className="text-lg font-medium">Hola, {userInfo.name}!</p>                
                    <button onClick={onSignOut} className="text-red-500 w-fit">Cerrar sesión</button>
                </div>
            )}
        </div>
    );
}

export default UserData;
