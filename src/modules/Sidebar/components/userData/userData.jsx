import React, {  useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { SignOutUser } from "./helpers/signoutUser";
import { clearUserData } from "../../../Login_page/components/LoginSide/components/slices/AuthReducer";
import { setTableNumber } from "../../../Order_details/slices/OrderInformation";

const UserData = ({ collapsed }) => {
    const dispatch = useDispatch();

    const { nombre, rol } = useSelector(state => state.AuthSlice);

    const [isDataDisplayed, setIsDataDisplayed] = useState(false);
    const navigate = useNavigate(); 

    const onSignOut = () => {
        dispatch(clearUserData());
        dispatch(setTableNumber(null));
        SignOutUser(navigate); 
    }

    const displayUserData = () => {
        setIsDataDisplayed(!isDataDisplayed);
    }

    return (
        <div className="relative flex w-full">
            <div onClick={displayUserData} 
                className={`flex w-full justify-normal lg:justify-normal items-center space-x-3 
                 rounded-2xl p-2 bg-background duration-100 cursor-pointer
                    ${collapsed ? 'justify-center' : 'justify-start'}`}>
                {
                    collapsed ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-8 w-8 text-primary self-center"
                                aria-hidden="true"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.93 17.93 0 0112 21.75a17.93 17.93 0 01-3.499-.82z"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="ml-2 truncate block md:hidden lg:block">
                            <p className="text-primary font-semibold text-md xl:text-lg">{nombre}</p>
                            <p className="text-primary font-normal truncate text-sm xl:text-normal">{rol }</p>
                        </div>
                    )
                }
            </div>
            {isDataDisplayed && (
                <div className="z-50 flex flex-col space-y-2 absolute bottom-20 rounded-xl bg-background dark:bg-muted p-4 w-[200px] text-primary">         
                    <p className="text-lg font-medium">Hola, {nombre}!</p>                
                    <button onClick={onSignOut} className="bg-primary p-2 rounded-3xl text-primary-foreground w-fit">Cerrar sesión</button>
                </div>
            )}
        </div>
    );
}

export default UserData;
