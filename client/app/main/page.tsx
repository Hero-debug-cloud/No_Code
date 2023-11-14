"use client"
import Sidebar from "../../components/sidebar/Sidebar";
import React ,{useEffect,useState} from 'react'
import { BrowserRouter, Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authentication from "../authentication/page";
import Database from "../database/page";
import Custom_api from "../custom_api/page";
import { ChakraProvider } from "@chakra-ui/react";


const Page = () => {
  const pages_array: any = [<Authentication key={0}/>,<Database key={1}/>,<Custom_api key={2}/>];
  const [curr_index, setcurr_index] = useState<any>(0);
  const handlechange = (index: any) => {
    setcurr_index(index);
  };
  const success = () => toast("Login Successfully...");
  useEffect(() => {
    // success();
  }, []);
  return (
    <div className=" w-[100vw] h-[100vh] border">
      <ChakraProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Sidebar active={curr_index} change={handlechange} />
        <div className="ml-[24vw] w-[75vw] h-[99vh] ">{pages_array[curr_index]}</div>
      </ChakraProvider>
    </div>
  );
};

export default Page