"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import { Spinner, useDisclosure } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { GrLinkNext } from "react-icons/gr";

const Page = () => {
  const [loading, setloading] = useState<any>(false);
  const [projects, setprojects] = useState<any>([]);
  const [cookies] = useCookies(["token"]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const getprojects = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/projects/read`,
          {},
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response) => {
          setprojects(response.data.message);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading(false);
  };
  useEffect(() => {
    getprojects();
  }, []);
  const router = useRouter();
  const handleclick = (_id: any) => {
    localStorage.setItem("projectId", _id);
    router.push("/main");
  };
  const [edit, setedit] = useState<any>(false);
  const [edit_index, setedit_index] = useState<any>(-1);
  const handlevalue = (e: any, index: any) => {
    const newprojects = [...projects];
    newprojects[index].name = e.target.value;
    setprojects(newprojects);
  };
  const [loading_update, setloading_update] = useState<any>(false);
  const handleupdate = async (_id: any) => {
    setloading_update(true);
    try {
      await axios
        .post(
          `${endpoint}/projects/update`,
          {
            _id,
            value: projects[edit_index].name,
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response) => {
          if (response.data.message.modifiedCount == 1) {
          } else {
            getprojects();
          }
        })
        .catch((error: any) => {
          console.log(error);
          getprojects();
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading_update(false);
    setedit(false);
    setedit_index(-1);
  };
  const [del, setdel] = useState<any>(false);
  const [delete_index, setdelete_index] = useState<any>(-1);

  const handlecancel = () => {
    setdel(false);
    setdelete_index(-1);
  };
  const [loading_delete, setloading_delete] = useState<any>(false);
  const handledelete = async (_id: any) => {
    setloading_delete(true);
    try {
      await axios
        .post(
          `${endpoint}/projects/delete`,
          {
            _id,
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response) => {
          if (response.data.message.deletedCount == 1) {
            const newprojects = projects.filter(
              (value: any) => value._id != _id
            );
            setprojects(newprojects);
          } else {
            getprojects();
          }
        })
        .catch((error: any) => {
          console.log(error);
          getprojects();
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading_delete(false);
    setdel(false);
    setdelete_index(-1);
  };
  const [input, setinput] = useState<any>("");
  const handleinput = (e: any) => {
    setinput(e.target.value);
  };
  const [loading_create, setloading_create] = useState<any>(false);
  const handleCreate = async () => {
    setloading_create(true);
    try {
      await axios
        .post(
          `${endpoint}/projects/create`,
          {
            name: input,
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response) => {
          const newprojects = [...projects];
          console.log("number is " + newprojects.length);
          newprojects[newprojects.length] = response.data.message;
          setprojects(newprojects);
          setinput("");
          onClose();
        })
        .catch((error: any) => {
          console.log(error);
          getprojects();
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading_create(false);
  };
  return (
    <ChakraProvider>
      <div className="w-[100vw] h-[100vh] w-max-[100vh] h-max-[100vh]">
        <div className="h-[10vh] bg-gray-100"></div>
        <div className="flex justify-center">
          <div className="w-[60%] mt-4">
            <div className="flex justify-between">
              <h1 className="font-bold text-lg">Your Projects</h1>
              <div
                className="bg-blue-500 text-white rounded p-1 cursor-pointer w-[5vw] text-center"
                onClick={onOpen}
              >
                Add
              </div>
            </div>
            {loading ? (
              <div className="w-[100%] h-[75vh] mt-4 flex justify-center items-center">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </div>
            ) : (
              <div className="w-[100%] h-[75vh] mt-4 overflow-scroll">
                <div className="flex justify-between border rounded p-2 mb-3 font-bold">
                  <div className="w-[20%] flex justify-center">S No.</div>
                  <div className="w-[60%]">Name</div>
                  <div className="w-[20%] flex justify-center">Operations</div>
                </div>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Create Your Projects</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <div className="flex flex-col">
                        <label>Name</label>
                        <input
                          type="text"
                          placeholder="Enter..."
                          onChange={(e: any) => handleinput(e)}
                          value={input}
                          className="outline-none border p-2 mt-2 mb-2"
                        />
                        <div
                          className="cursor-pointer bg-blue-500 text-white flex justify-center items-center p-2 rounded"
                          onClick={handleCreate}
                        >
                          {loading_create ? <Spinner /> : "Create"}
                        </div>
                      </div>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {projects.map((value: any, index: any) => {
                  return (
                    <div
                      className="flex justify-between p-2 mb-2 border "
                      key={index}
                    >
                      <div className="w-[80%] flex">
                        <div className="w-[20%] flex justify-center items-center">
                          {index + 1}
                        </div>
                        <div className="w-[60%] flex justify-between">
                          <input
                            type="text"
                            className={
                              "outline-none rounded p-2 w-[90%]  " +
                              (edit && edit_index == index
                                ? "bg-gray-100 cursor-pointer"
                                : "bg-white ")
                            }
                            onChange={(e: any) => handlevalue(e, index)}
                            value={value.name}
                            disabled={
                              edit && index == edit_index ? undefined : true
                            }
                          />
                          <div
                            className="w-[10%] flex items-center justify-end cursor-pointer"
                            onClick={() => {
                              if (!edit) handleclick(value._id);
                              else console.log("there");
                            }}
                          >
                            <GrLinkNext />
                          </div>
                        </div>
                      </div>

                      <div className="w-[20%] flex justify-center items-center">
                        {edit && edit_index == index ? (
                          <>
                            <div
                              className="bg-blue-500 text-white p-2 cursor-pointer rounded"
                              onClick={() => handleupdate(value._id)}
                            >
                              {loading_update ? <Spinner /> : "Update"}
                            </div>
                          </>
                        ) : del && delete_index == index ? (
                          <>
                            <div
                              className="bg-blue-500 text-white rounded p-1 cursor-pointer mr-3 "
                              onClick={() => handledelete(value._id)}
                            >
                              {loading_delete ? <Spinner /> : "Confirm"}
                            </div>
                            <div
                              className="bg-blue-500 text-white rounded p-1 cursor-pointer "
                              onClick={handlecancel}
                            >
                              Cancel
                            </div>
                          </>
                        ) : (
                          <>
                            <FaEdit
                              className="cursor-pointer mr-3"
                              onClick={() => {
                                setedit(true);
                                setedit_index(index);
                              }}
                            />
                            <AiFillDelete
                              className="cursor-pointer"
                              onClick={() => {
                                setdel(true);
                                setdelete_index(index);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default Page;
