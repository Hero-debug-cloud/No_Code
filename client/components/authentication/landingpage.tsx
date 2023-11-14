import React, { useState } from "react";

import endpoint from "../../variables";
import Register from "./register";
import Login from "./login";
import Create from "./create";
import Dashboard from "./dashboard";

const Navbar = () => {
  const list = ["Schema", "Dashboard"];

  const [curr_index, set_curr_index] = useState<any>(0);
  return (
    <div className="w-[100%] p-2 ">
      <div className="flex justify-evenly items-center">
        {list.map((value: any, index: any) => {
          return (
            <div
              className={
                "p-2 rounded hover:bg-blue-500 hover:text-white cursor-pointer " +
                (curr_index == index ? "bg-blue-500 text-white" : "")
              }
              onClick={() => {
                set_curr_index(index);
              }}
              key={index}
            >
              {value}
            </div>
          );
        })}
      </div>
      {curr_index == 0 ? (
        <div className="mt-10">
          <Create name="users"/>
        </div>
      ) : (
        <div className="mt-10">
          <Dashboard />
        </div>
      )}
    </div>
  );
};

export default Navbar;
