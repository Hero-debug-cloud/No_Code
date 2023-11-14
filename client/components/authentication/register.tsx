"use client";
import { Spinner, Toast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import { GiCancel } from "react-icons/gi";
import { BiEdit } from "react-icons/bi";
import { bool } from "aws-sdk/clients/signer";
import { BiCopy } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import { Cookie } from "next/font/google";

const link = `${endpoint}/auth/custom_registeruser`;

const Register = () => {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);

  const types_options = ["String", "Number", "Boolean"];
  const [edit, setedit] = useState<any>(false);
  type field_value = {
    name: string;
    type: string;
  };
  const [fields, setfields] = useState<any>([
    { name: "Password", type: "String" },
  ]);
  const handleChange = (e: any, index: any) => {
    //password cann't be updated;
    if (index == 0) return;

    const updatedfields = [...fields];
    updatedfields[index].name = e.target.value;
    setfields(updatedfields);
  };

  const handleTypeChange = (e: any, index: any) => {
    const fieldType = e.target.value;
    const updatedfield = [...fields];
    updatedfield[index].type = fieldType;
    setfields(updatedfield);
  };

  const createnewfield = () => {
    const updatedfields = [...fields];
    updatedfields.push({
      name: `FieldName${fields.length}`,
      type: "String",
    });
    setfields(updatedfields);
  };
  const [loading, setloading] = useState<boolean>(false);
  const clicked = () => {
    if (edit) update();
    else create();
  };
  const update = async () => {
    setloading(true);
    try {
      const data = {
        field: "schema",
        value: schema,
        projectId: localStorage.getItem("projectId"),
      };
      await axios
        .post(`${endpoint}/user_database/register_update`, data, {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        })
        .then((response: any) => {
          Toast(response.data.message);
          setedit(false);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error: any) {
      console.log(error);
    }
    setloading(false);
  };
  const create = async () => {
    setloading(true);
    try {
      const data = {
        field: fields,
        projectId: localStorage.getItem("projectId"),
      };
      await axios
        .post(`${endpoint}/user_database/register`, data, {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        })
        .then((response: any) => {
          Toast(response.data.message);
          getschema();
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (error: any) {
      console.log(error);
    }
    setloading(false);
  };
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
      if (data.message == null) setschema(null);
      else setschema(data.message.schema);
      console.log(data.message.schema);
    } catch (err) {
      console.log(err);
    }
    setloading_schema(false);
  };

  const [token, settoken] = useState<any>("");

  useEffect(() => {
    getschema();
    settoken(cookies["token"]);
  }, []);

  const [started, setstarted] = useState<any>(false);
  const handleupdate = () => {
    setedit(true);
  };
  const handleupdate_cancel = () => {
    setedit(false);
  };

  const handleChange_schema = (e: any, index: any) => {
    if (index == 0) return;
    setstarted(true);
    const updated = [...schema];
    updated[0].field_name[index] = e.target.value;
    setschema(updated);
  };

  const handleTypeChange_schema = (e: any, index: any) => {
    setstarted(true);
    const updated = [...schema];
    updated[0].field_type[index] = e.target.value;
    setschema(updated);
  };

  const createnewschema = () => {
    const updatedschema = [...schema];
    const length = updatedschema[0].field_name.length;
    updatedschema[0].field_name[length] = "";
    updatedschema[0].field_type[length] = "";
    setschema(updatedschema);
  };

  const [copy, setcopy] = useState<any>(false);

  return (
    <div className="p-10 h-[85vh] overflow-scroll ml-[7vw]">
      <h1 className=" font-bold w-[40vw] text-center">
        Custom Input for the Link
      </h1>
      <div className="mt-5 flex w-[40vw] justify-between items-center ">
        <div>
          {schema == null
            ? "Define Schema Structure"
            : "Your Defined Schema Structure"}
        </div>
        {schema != null && !edit ? (
          <div className="cursor-pointer" onClick={handleupdate}>
            <BiEdit />
          </div>
        ) : (
          <>
            {started ? (
              <></>
            ) : (
              <div className="cursor-pointer" onClick={handleupdate_cancel}>
                <GiCancel />
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[40vw] border flex mt-5 rounded p-1">
        <div className="w-[50%] text-center">Name</div>
        <div className="w-[50%] text-center">Type</div>
      </div>

      {loading_schema ? (
        <div className="w-[40vw] mt-5 flex justify-center items-center">
          <Spinner className="" />
        </div>
      ) : schema == null ? (
        <>
          {fields?.map((value: any, index: any) => {
            return (
              <>
                <div className="w-[40vw] flex mt-5 justify-between" key={index}>
                  <input
                    type="text"
                    value={value.name}
                    className="w-[45%] text-center border outline-none p-1 rounded"
                    onChange={(e: any) => {
                      handleChange(e, index);
                    }}
                  />
                  <div className="w-[45%] border text-center p-1 rounded">
                    <select
                      id="cars"
                      name="cars"
                      value={value.type}
                      className="outline-none w-[60%] cursor-pointer"
                      onChange={(e: any) => handleTypeChange(e, index)}
                    >
                      {types_options.map((value, index) => (
                        <option
                          value={value}
                          key={index}
                          className="cursor-pointer"
                        >
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            );
          })}
        </>
      ) : (
        //updating or visible schema;
        <>
          {schema[0]?.field_name &&
            schema[0]?.field_name.map((value: any, index: any) => {
              return (
                <div key={index}>
                  <div className="w-[40vw] flex mt-5 justify-between">
                    <input
                      type="text"
                      value={value}
                      className="w-[45%] text-center border outline-none p-1 rounded"
                      onChange={(e: any) => {
                        handleChange_schema(e, index);
                      }}
                      disabled={edit ? undefined : true}
                    />
                    <div className="w-[45%] border text-center p-1 rounded">
                      <select
                        id="cars"
                        name="cars"
                        value={schema[0]?.field_type[index]}
                        className="outline-none w-[60%] cursor-pointer"
                        onChange={(e: any) => handleTypeChange_schema(e, index)}
                        disabled={edit ? undefined : true}
                      >
                        {types_options.map((value, index) => {
                          return (
                            <>
                              <option
                                value={value}
                                key={index}
                                className="cursor-pointer"
                              >
                                {value}
                              </option>
                            </>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      )}
      {(edit || schema == null) && (
        <div className="flex justify-center items-center w-[40vw] mt-5">
          <div
            className="rounded-full flex justify-center items-center border w-10 h-10 p-2  cursor-pointer"
            onClick={schema == null ? createnewfield : createnewschema}
          >
            +
          </div>
        </div>
      )}
      {(schema == null || edit) && (
        <div
          className="w-[40vw] bg-blue-500 text-white mt-5 p-2 rounded text-center cursor-pointer"
          onClick={clicked}
        >
          {loading ? (
            <Spinner />
          ) : schema == null ? (
            "Create"
          ) : edit ? (
            "Update"
          ) : (
            ""
          )}
        </div>
      )}

      {/* Link for the Registration */}
      {schema != null && (
        <div className="mt-10">
          <div className="flex items-center">
            <div>
              <b>Link for the Register : </b>
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
            <b className="w-[20%]">Your Token for the header:</b>
            <div className="w-[80%]">{token}</div>
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
              {schema[0]?.field_name.map((value: any, index: any) => {
                return <div key={index}>{value} : value</div>;
              })}
              {"}"},
              <br />
              strict : 0/1 (1 : strict type checking or 0 : loose type checking)
              <br />
              {"}"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
