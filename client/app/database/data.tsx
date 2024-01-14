"use client";
import React, { useEffect, useState, ReactNode } from "react";
import endpoint from "../../variables";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Spinner, Toast, useSafeLayoutEffect } from "@chakra-ui/react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { AiOutlineDownCircle } from "react-icons/ai";
import { AiOutlineUpCircle } from "react-icons/ai";

const Data = ({name}:any) => {
  const [cookies] = useCookies(["token"]);
  type DataObject = {
    [key: string]: string | number;
  };

  const [users, setusers] = useState<any>([]);
  const [loading, setloading] = useState<any>(false);
  const [showoperation_index, setshowoperation_index] = useState<any>(-1);
  const [operation_type, setoperation_type] = useState<any>("");
  const [ischange, setischange] = useState<any>(false);
  const [edit, setedit] = useState<any>(false);
  const [edit_index, setedit_index] = useState<any>(-1);
  const [show_index, setshow_index] = useState<any>(-1);
  const getusers = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/access/findall`,
          { name, projectId: localStorage.getItem("projectId") },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response: any) => {
          Toast(response.data.message);
          setusers(response.data.message);
          setusers(response.data.message);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading(false);
  };
  const handleupdate = (index: any) => {
    setedit(true);
    setedit_index(index);
  };
  const handledelete = (index: any) => {
    setischange(true);
    setoperation_type("delete");
    setedit_index(index);
    setupdate(true);
  };
  const [loading_operation, setloading_operation] = useState<any>(false);
  const [loading_delete, setloading_delete] = useState<any>(false);
  const confirm_delete = async (index: any) => {
    setloading_delete(true);
    try {
      await axios
        .post(
          `${endpoint}/access/deleteone`,
          {
            name: "users",
            _id: users[index]._id,
            projectId: localStorage.getItem("projectId"),
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response: any) => {
          Toast(response.data.message);
          if (response.data.message.deletedCount > 0) {
            const updatedusers = users.filter(
              (object: any, ind: any) => ind != index
            );
            setusers(updatedusers);
          }
          handlecancel();
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading_delete(false);
  };
  const confirm_update = async () => {
    setloading_operation(true);
    try {
      await axios
        .post(
          `${endpoint}/access/updateone`,
          {
            name: "users",
            value: users[edit_index],
            projectId: localStorage.getItem("projectId"),
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response: any) => {
          Toast(response.data.message);
          handlecancel();
        })
        .catch((err: any) => {
          console.log(err);
          getusers();
        });
    } catch (err: any) {
      console.log(err);
      getusers();
    }
    setloading_operation(false);
  };
  const handlecancel = () => {
    setischange(false);
    setshowoperation_index(-1);
    setedit_index(-1);
    setupdate(false);
  };
  const [update, setupdate] = useState<any>(false);
  const handlevalue = (e: any, val: any, index: any) => {
    if (val == "_id") return;
    setischange(true);
    setoperation_type("update");
    const changeusers = [...users];
    changeusers[index][val] = e.target.value;
    setusers(changeusers);
  };
  useEffect(() => {
    getusers();
  }, []);

  return (
    <div>
      <b>User Database</b>
      <div className="w-[90%] h-[82vh] overflow-scroll ml-[5vw] mt-4">
        {loading ? (
          <div className="flex justify-center items-center w-[100%] h-[100%]">
            <Spinner />
          </div>
        ) : users && users[0] == undefined ? (
          <div className="flex justify-center items-center w-[100%] h-[100%]">
            No User is Registered till Now
          </div>
        ) : (
          <>
            <div className=" flex justify-between">
              {Object.entries(users[0]).map(
                ([key, value]: [any, any], index: any) => {
                  if (index < 3)
                    return <div className=" text-center w-[25%]" key={index}>{key}</div>;
                  return <></>;
                }
              )}
              <div className="w-[25%] text-center">Operation</div>
            </div>
            <div className="mt-3">
              {users.map((object: any, index: any) => {
                return (
                  <>
                    {show_index != -1 && index == show_index ? (
                      <>
                        <div
                          key={index}
                          className="border w-[100%] p-5 mt-2 mb-2 bg-[#FAFAFA] rounded"
                          onMouseOver={() => {
                            setshowoperation_index(show_index);
                          }}
                          
                        >
                          <div className="flex justify-end h-[5vh] ">
                            {show_index == showoperation_index && (
                              <>
                                <AiOutlineUpCircle
                                  onClick={() => setshow_index(-1)}
                                  className="cursor-pointer mr-3"
                                  size={20}
                                />
                                <BiEdit
                                  className="cursor-pointer mr-3"
                                  onClick={() => handleupdate(show_index)}
                                  size={20}
                                />
                                <MdDelete
                                  className="cursor-pointer"
                                  onClick={() => handledelete(show_index)}
                                  size={20}
                                />
                              </>
                            )}
                          </div>
                          {Object.entries(users[show_index]).map(
                            ([key, value]: [any, any]) => (
                              <div
                                key={key}
                                className="mt-2 mb-2 flex items-center"
                              >
                                <div>
                                  <b>{key}</b>
                                </div>
                                <span> : </span>
                                <input
                                  type="text"
                                  className={
                                    "outline-none rounded p-2 w-[100%] " +
                                    (edit && index == edit_index
                                      ? "bg-white"
                                      : "bg-inherit")
                                  }
                                  onChange={(e: any) =>
                                    handlevalue(e, key, index)
                                  }
                                  value={value}
                                  disabled={
                                    edit && index == edit_index
                                      ? undefined
                                      : true
                                  }
                                />
                              </div>
                            )
                          )}
                          <div className="flex justify-end h-[5vh] items-center mt-2">
                            {index == edit_index && (
                              <>
                                {update && (
                                  <div
                                    className="cursor-pointer border p-1 mr-2 rounded"
                                    onClick={() => {
                                      handlecancel();
                                    }}
                                  >
                                    Cancel
                                  </div>
                                )}
                                {ischange && (
                                  <div
                                    className="cursor-pointer border p-1 mr-2 rounded"
                                    onClick={() => {
                                      operation_type == "update"
                                        ? confirm_update()
                                        : confirm_delete(index);
                                    }}
                                  >
                                    {loading_operation ? (
                                      <Spinner />
                                    ) : operation_type == "update" ? (
                                      "Update"
                                    ) : (
                                      "Delete"
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between mt-2 bg-gray-100 p-2 rounded">
                        {Object.entries(object).map(
                          ([key, value]: [any, any], index: any) => {
                            if (index < 3)
                              return (
                                <div className=" w-[25%] text-center overflow-hidden" key={index}>
                                  {value.length > 21
                                    ? `${value.slice(0, 21)}...`
                                    : value}{" "}
                                </div>
                              );
                            return <></>;
                          }
                        )}
                        <div className="flex justify-center w-[25%]">
                          <div
                            className="p-1 border rounded cursor-pointer"
                            onClick={() => setshow_index(index)}
                          >
                            <AiOutlineDownCircle />
                          </div>
                          <div
                            className="p-1 border rounded cursor-pointer ml-3 mr-3"
                            onClick={() => {
                              setshow_index(index);
                              handleupdate(index);
                            }}
                          >
                            <BiEdit />
                          </div>
                          <div
                            className="p-1 border rounded cursor-pointer"
                            onClick={() => confirm_delete(index)}
                          >
                            {loading_delete ? <Spinner /> : <MdDelete />}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Data;
