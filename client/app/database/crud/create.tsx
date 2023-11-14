import React, { useEffect, useState } from "react";
import endpoint from "../../../variables";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { BsCheckCircle } from "react-icons/bs";
const link = `${endpoint}/crud/insert`;

//projectid;

const Create = ({schema}:any) => {
  const [token, settoken] = useState<any>("");
  const [projectId,setprojectId]=useState<any>("");
  const [cookies] = useCookies(["token"]);
  const [copy,setcopy]=useState<any>(false);
  useEffect(() => {
    settoken(cookies["token"]);
    setprojectId(localStorage.getItem("projectId"));
  }, []);
  return (
    <div className="mt-5">
      <div className="flex items-center">
        <div>
          <b>Link for the Create : </b>
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
      <div className="mt-5">
        <div className="font-bold">Required Fields</div>

        <div className="w-[100%] flex items-start mt-2">
          <span className="w-[15%]">Header : Bearer</span>
          <span className="w-[85%]">{token}</span>
        </div>
        

        <div className="flex mt-2 ">
          <b>Data to be send :</b>
          <div>
            <br />
            {"{"}
            <br />
            field :
            <br />
            {"{"}
            <br />
            {schema[0]?.field_name.map((value: any,index:any) => {
              return <div key={index}>{value} : value</div>;
            })}
            {"}"},
            <br />
            strict : 0/1 (1 : strict type checking or 0 : loose type checking)
            <br />
            name : value (Database Name),
            <br />
            projectId : {projectId}
            <br />
            {"}"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
