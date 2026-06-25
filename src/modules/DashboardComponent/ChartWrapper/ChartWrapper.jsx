import React from "react";

const ChartWrapper = ({chart}) => {
    return(
        <div className="w-full md:w-1/2 rounded-2xl p-5 flex flex-col shadow-md h-96">
            <div className=" h-full w-full" id="chart-container">
                {chart}
            </div>
        </div>
    );
}

export default ChartWrapper;