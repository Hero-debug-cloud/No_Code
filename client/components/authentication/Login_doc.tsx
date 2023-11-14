import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { BiCopy } from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';
import endpoint from "../../variables";

const link = `${endpoint}/auth/custom_loginuser`;

const Login_doc = ({schema}:any) => {
    const [copy,setcopy]=useState<any>("");
    const [cookies] = useCookies(["token"]);
    const [token, settoken] = useState<any>("");
    const [projectId, setprojectId] = useState<any>("");
    useEffect(() => {
      settoken(cookies["token"]);
      setprojectId(localStorage.getItem("projectId"));
    }, []);
  return (
    <div>
      {/* Link for the Registration */}
      {schema != null && (
        <div className="mt-10">
          <div className="flex items-center">
            <div>
              <b>Link for the Login : </b>
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
          <div className="flex mt-2">
            <b className="w-[13%]">Your Token :</b>
            <div className="w-[87%]">{token}</div>
          </div>

          {/* data to be save */}
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
              projectId : {projectId}
              <br />
              {"}"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login_doc