import React, { useEffect, useState } from 'react'
import { BiCopy } from 'react-icons/bi';
import { BsCheckCircle } from 'react-icons/bs';
import endpoint from "../../variables";
import { useCookies } from 'react-cookie';
const link = `${endpoint}/custom_api/url/yourapiendpoint`;
const Documation = () => {
    const [copy, setcopy] = useState<any>(false);
    const [cookies] = useCookies(["token"]);
     const [token, settoken] = useState<any>("");
     const [projectId,setprojectId]=useState<any>("");
     useEffect(() => {
       settoken(cookies["token"]);
       setprojectId(localStorage.getItem("projectId"));
     }, []);
  return (
    //provide projectid as well;
    <div>
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
        <div className="flex mt-2">
          <b className="w-[13%]">Field to be Send :</b>
          <div className="w-[87%]">
            <div>
              <br />
              {"{"}
              <br />
              projectId : {projectId},
              <br />
              {"}"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documation