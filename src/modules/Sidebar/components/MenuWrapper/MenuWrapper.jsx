import React from "react";

const MenuWrapper = ({ children }) => {
    return(
        <div className="flex flex-col h-full justify-between bg-brand-gradient-soft">
            {children}
        </div>
    );
}

export default MenuWrapper;