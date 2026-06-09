import React from "react";
import AuthorShipLogo from "../../../../assets/common_icons/authorship.png"

const InfoContainer = ({ collapsed}) => {
    return(
        <div className="flex flex-col items-center bg-background rounded-2xl mx-3 mb-3 mt-3 space-y-3 md:hidden lg:flex">
            
            <div className="w-full px-4 py-3 rounded-2xl text-primary font-medium text-sm md:text-xs flex space-x-3 items-center">
                <img className="w-6 h-6" src={AuthorShipLogo} alt="Authorship logo"/>
                {
                    collapsed ? (
                        <span className="hidden"></span>
                    ) : (
                        <span>Designed by Box Collider</span>
                    )
                }
            </div>
        </div>
    );
}

export default InfoContainer;