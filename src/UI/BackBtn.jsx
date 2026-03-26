import React from "react";
import BackButton from '../assets/common_icons/back.png';

const BackBtn = ({onClick}) => {
    return(
        <button onClick={onClick} className="">
            <img src={BackButton} alt="back_btn" className="w-7 h-7 md:w-10 md:h-10"/>
        </button>
    );
}

export default BackBtn;