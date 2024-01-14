"use client"
import React, { useState, useEffect } from "react";

import Api from "./apis";
import Documation from "./doc";

const Page = () => {
  const options:any=[<Api key={0}/>,<Documation key={1}/>];
  const array = ["API Collection","Documentation"];
  const [index,setindex]=useState<any>(0);
  return (
    <div className="w-[100%] h-[95vh] mt-5">
      <div className=" flex justify-center">
        {array.map((value: any, ind: any) => {
          return <div onClick={() => setindex(ind)} className={"p-2 rounded cursor-pointer ml-4 mr-4 "+(index===ind?"bg-blue-500 text-white":"")} key={ind}>{value}</div>;
        })}
      </div>

      {options[index]}
    </div>
  );
};

export default Page;
