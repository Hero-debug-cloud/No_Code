"use client";
import { Spinner, Toast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import { GiCancel } from "react-icons/gi";
import { BiEdit } from "react-icons/bi";
// import { bool } from "aws-sdk/clients/signer";
import { BiCopy } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import { Cookie } from "next/font/google";
import { IoIosArrowBack } from "react-icons/io";
import Read from "./crud/read";
import Create from "./crud/create";
import Update from "./crud/update";
import Delete from "./crud/delete";

const link = `${endpoint}/auth/custom_registeruser`;

const Schema = ({ name }: any) => {
  const router = useRouter();
  const [cookies] = useCookies(["token"]);

  const types_options = ["String", "Number", "Boolean"];
  const [edit, setedit] = useState<any>(false);
  type field_value = {
    name: string;
    type: string;
  };
  const [fields, setfields] = useState<any>([]);
  const [required, setrequired] = useState<any>([]);
  const handleChange = (e: any, index: any) => {
    //password cann't be updated;
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
      name: `FieldName${fields.length + 1}`,
      type: "String",
    });
    const updatedrequired = [...required];
    updatedrequired[fields.length] = false;
    setrequired(updatedrequired);
    setfields(updatedfields);
  };
  const [loading, setloading] = useState<boolean>(false);
  const clicked = () => {
    if (edit) update();
    else create();
  };
  const update = async () => {
    setloading(true);
    const new_required: any = [];
    await new Promise((resolve: any, reject: any) => {
      required.map((value: any, index: any) => {
        if (value || typeof value == "string") {
          new_required.push(schema[0].field_name[index]);
        }
      });
      resolve();
    });

    try {
      const data = {
        field1: "schema",
        value1: schema,
        field2: "required_field",
        value2: new_required,
        name,
        projectId: localStorage.getItem("projectId"),
      };
      await axios
        .post(`${endpoint}/database/update_schema`, data, {
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
    const new_required: any = [];
    await new Promise((resolve: any, reject: any) => {
      required.map((value: any, index: any) => {
        if (value) {
          new_required.push(fields[index].name);
        }
      });
      resolve();
    });

    try {
      const data = {
        field: fields,
        name: name,
        required: new_required,
        projectId: localStorage.getItem("projectId"),
      };
      await axios
        .post(`${endpoint}/database/register_schema`, data, {
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
        { name, projectId: localStorage.getItem("projectId") },
        {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        }
      );
      if (data.message == null) setschema(null);
      else {
        setschema(data.message.schema);
        setrequired(data.message.required_field);
      }
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
    updatedschema[0].field_name[length] = `Field${length + 1}`;
    updatedschema[0].field_type[length] = "String";

    const updatedrequired = [...required];
    updatedrequired[length] = false;
    setrequired(updatedrequired);
    setschema(updatedschema);
  };

  const handlecheck = (e: any, index: any) => {
    const updatedrequired = [...required];
    updatedrequired[index] = e.target.checked;
    setrequired(updatedrequired);
  };

  //documentation;
  const list = ["Create", "Read", "Update", "Delete"];
  const pages: any = [
    <Create schema={schema} key={0} />,
    <Read key={1} />,
    <Update key={2} />,
    <Delete key={3} />,
  ];
  const [curr_index, set_curr_index] = useState<any>(0);

  return (
    <div className="p-10 h-[80vh] overflow-scroll ml-[7vw]">
      <h1 className=" font-bold w-[40vw] text-center">PlayGround</h1>
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
        <div className="w-[50%] text-center">Requried</div>
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
                    className="w-[50%] text-center border outline-none p-1 rounded"
                    onChange={(e: any) => {
                      handleChange(e, index);
                    }}
                  />
                  <div className="w-[50%] border text-center p-1 rounded ml-1 mr-1">
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
                  <div className="w-[50%] flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={required[index]}
                      onChange={(e: any) => handlecheck(e, index)}
                      className="cursor-pointer"
                    />
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
                <>
                  <div
                    className="w-[40vw] flex mt-5 justify-between"
                    key={index}
                  >
                    <input
                      type="text"
                      value={value}
                      className="w-[50%] text-center border outline-none p-1 rounded"
                      onChange={(e: any) => {
                        handleChange_schema(e, index);
                      }}
                      disabled={edit ? undefined : true}
                    />
                    <div className="w-[50%] border text-center p-1 rounded">
                      <select
                        id="cars"
                        name="cars"
                        value={schema[0]?.field_type[index]}
                        className="outline-none w-[60%] cursor-pointer"
                        onChange={(e: any) => handleTypeChange_schema(e, index)}
                        disabled={edit ? undefined : true}
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
                    <div className="w-[50%] flex justify-center items-center">
                      <input
                        type="checkbox"
                        checked={required[index]}
                        onChange={(e: any) => handlecheck(e, index)}
                        className="cursor-pointer"
                        disabled={edit ? undefined : true}
                      />
                    </div>
                  </div>
                </>
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

      {schema != null && (
        <div className="mt-5">
          <div className="flex justify-evenly items-center mt-3">
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
          </div>
          <div>{pages[curr_index]}</div>
        </div>
      )}
    </div>
  );
};

export default Schema;
