"use client";
import React, { useEffect, useState } from "react";
import endpoint from "../../../variables";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { BsCheckCircle } from "react-icons/bs";
const link = `${endpoint}/crud/updateone`;

const Update = () => {
  const [copy,setcopy]=useState<any>(false);
  const [projectId, setprojectId] = useState<any>("");

  useEffect(() => {
    setprojectId(localStorage.getItem("projectId"));
  }, []);
  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div>
          <b>Link for the Update : </b>
          {link}
        </div>
        <div
          onClick={() => {
            if (copy) return;
            navigator.clipboard.writeText(link);
            setcopy(!copy);
            setTimeout(() => {
              setcopy(copy);
            }, 1000);
          }}
          className="ml-2 cursor-pointer"
        >
          {!copy ? <BiCopy /> : <BsCheckCircle />}
        </div>
      </div>

      <div className="flex mt-2 ">
        <b>Data to be send :</b>
        <div>
          <br />
          {"{"}
          <br />
          name : value (Database Name),
          <br />
          value : {"{"}
          <br />
          _id : value ( Compulsory ) ...Other Values ( Optional )
          <br />
          Field 1 : Value 1,
          <br />
          Field 2 : Value 2...,
          <br />
          {"}"},
          <br />
          projectId : {projectId}
          <br />
          {"}"},
        </div>
      </div>
    </div>
  );
};

export default Update;
