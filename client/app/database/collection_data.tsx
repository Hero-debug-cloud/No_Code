"use client";
import React, { useState } from 'react'
import Schema from "./schema";
import Data from "./data";
import {AiFillDelete} from "react-icons/ai";
import {IoIosArrowBack} from "react-icons/io";
import { Spinner } from '@chakra-ui/react';
import axios from 'axios';
import endpoint from '../../variables';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

const Collection_data = ({name,back,remove}:any) => {
  const list=["Schema","Data"];
  const [curr_index,set_curr_index]=useState<any>(0);
  const [cookies] = useCookies(["token"]);

  const [loading_delete,setloading_delete]=useState<any>(false);
  const handledelete=async()=>{
    setloading_delete(true);
   try {
     await axios
       .post(
         `${endpoint}/database/delete_schema`,
         {
           name,
           projectId: localStorage.getItem("projectId"),
         },
         {
           headers: { Authorization: `Bearer ${cookies["token"]}` },
         }
       )
       .then((response: any) => {
         remove(name);
       })
       .catch((err: any) => {
         toast("Try Again Later");
         console.log(err);
       });
   } catch (error: any) {
     console.log(error);
   }
   setloading_delete(false);
  }
  return (
    <div className="w-[100%] h-[100%]">
      <div className="flex justify-evenly items-center mt-3">
        <div className='cursor-pointer' onClick={()=>back()}><IoIosArrowBack/></div>
        <div className="font-bold">Name : {name}</div>
        {list.map((value: any, index: any) => {
          return (
            <div
              className={
                "p-2 rounded hover:bg-blue-500 hover:text-white cursor-pointer " +
                (curr_index == index ? "bg-blue-500 text-white" : "")
              }
              key={index}
              onClick={() => {
                set_curr_index(index);
              }}
            >
              {value}
            </div>
          );
        })}
        <div onClick={handledelete} className='border rounded-lg p-2 cursor-pointer'>
          {loading_delete?<Spinner/>:<AiFillDelete />}
        </div>
      </div>
      <div>
        {curr_index != -1 && curr_index == 0 ? (
          <Schema name={name} />
        ) : (
          <Data name={name} />
        )}
      </div>
    </div>
  );
}

export default Collection_data