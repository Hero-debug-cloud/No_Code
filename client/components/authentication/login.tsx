"use client";
import { Spinner, Toast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import { GiCancel } from "react-icons/gi";
import { BiEdit } from "react-icons/bi";
import { BiCopy } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import { AnalysisName } from "aws-sdk/clients/quicksight";

const link = `${endpoint}/auth/custom_loginuser`;

const Login = () => {
  // const router = useRouter();
  const [cookies] = useCookies(["token"]);

  const [loading, setloading] = useState<boolean>(false);
  //to show rest of the documentation;
  const [show, setshow] = useState<any>(false);

  const [schema, setschema] = useState<any>([]);
  const [loading_schema, setloading_schema] = useState<any>(false);
  const getschema = async () => {
    setloading_schema(true);
    try {
      const { data } = await axios.post(
        `${endpoint}/auth/getschema`,
        { name: "users", projectId: localStorage.getItem("projectId") },
        {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        }
      );
      if (data.message == null) {
        setschema(null);
      } else {
        setschema(data.message.schema);
        setrequired(data.message.required_field);
      }
    } catch (err) {
      console.log(err);
    }
    setloading_schema(false);
  };

  const [token,settoken]=useState<any>("");
  useEffect(() => {
    getschema();
    settoken(cookies["token"]);
  }, []);

  const [copy, setcopy] = useState<any>(false);

  const clicked = async () => {
    setloading(true);
    try {
      const data = {
        field: "required_field",
        value: required,
      };
      await axios
        .post(`${endpoint}/database/register_update`, data, {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        })
        .then((response: any) => {
          Toast(response.data.message);
          setshow(true);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error: any) {
      console.log(error);
    }
    setloading(false);
    setisupdated(false);
    setedit(false);
  };
  const [required, setrequired] = useState<any>([]);
  const [isupdated, setisupdated] = useState<any>(false);
  const handlecheck = (e: any, name: any) => {
    if (name == "Password") return;
    setisupdated(true);
    if (e.target.checked) {
      setrequired([...required, name]);
    } else {
      const updatedrequired = required.filter((value: any) => value != name);
      setrequired(updatedrequired);
    }
  };

  const [edit, setedit] = useState<any>(false);

  const checkit = (field: AnalysisName) => {
    return required.includes(field);
  };

  return (
    <div className="p-10 h-[85vh] overflow-scroll ml-[7vw]">
      {schema == null ? (
        <div className="w-[40vw] text-center font-bold">Register First</div>
      ) : (
        <>
          <h1 className=" font-bold w-[40vw] text-center">
            Custom Input to get Login Link
          </h1>
          <div className="mt-5 flex w-[40vw] justify-between items-center ">
            <div>Choose the Requried Option needed for login by User</div>
            <div>
              {edit ? (
                <></>
              ) : (
                <BiEdit
                  onClick={() => setedit(true)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>

          <div className="w-[40vw] border flex mt-5 rounded p-1">
            <div className="w-[50%] text-center">Name</div>
            <div className="w-[50%] text-center">Required ( Yes or No)</div>
          </div>
          {loading_schema ? (
            <div className="w-[40vw] mt-5 flex justify-center items-center">
              <Spinner className="" />
            </div>
          ) : (
            schema[0]?.field_name &&
            schema[0]?.field_name.map((value: any, index: any) => {
              return (
                <>
                  <div className="w-[40vw] flex mt-5 justify-between" key={index}>
                    <input
                      type="text"
                      value={value}
                      className="w-[45%] text-center border outline-none p-1 rounded"
                      disabled={edit ? undefined : true}
                    />
                    <div className="w-[45%] text-center p-1 rounded">
                      <input
                        type="checkbox"
                        checked={checkit(value)}
                        onChange={(e: any) => handlecheck(e, value)}
                        disabled={
                          edit ? (value == "Password" ? true : undefined) : true
                        }
                      />
                    </div>
                  </div>
                </>
              );
            })
          )}

          {isupdated && (
            <div
              className="w-[40vw] bg-blue-500 text-white mt-5 p-2 rounded text-center cursor-pointer"
              onClick={clicked}
            >
              {loading ? <Spinner /> : "Select"}
            </div>
          )}

          {/* Link for the Registration */}
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
                {"}"}
                <br />
                {"}"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
