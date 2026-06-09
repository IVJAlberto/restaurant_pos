import React from "react";
import Logo from './logo';

const MainLogo = ({params = "text-xl font-bold text-primary-foreground "}) => {
    return(
        <div className="flex md:h-24 items-center justify-start md:justify-center">
            <Logo params={params}/> 
        </div>
    );
}

export default MainLogo;