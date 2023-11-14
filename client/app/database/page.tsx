"use client";
import React, { useState, useEffect } from "react";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Spinner, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Collection_data from "./collection_data";

const Page = () => {
  // const [position,setposition]=useState<any>({
  //   top:0,
  //   right:0,
  //   bottom:0,
  //   left:0
  // });
  const [cookies] = useCookies(["token"]);
  const [collections, setcollections] = useState<any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setloading] = useState<any>(false);
  const getcollection = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/database/getcollections`,
          { projectId: localStorage.getItem("projectId") },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setcollections(response.data.message);
          console.log(response.data.message);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading(false);
  };

  useEffect(() => {
    getcollection();
  }, []);

  const [selected_index, setselected_index] = useState<any>(-1);
  const handleclick = (index: any) => {
    console.log(index);
    setselected_index(index);
  };

  const [name, setname] = useState<any>("");
  const handlenamechange = (e: any) => {
    setname(e.target.value);
  };
  const [loading_create, setloading_create] = useState<any>(false);
  const [success, setsuccess] = useState<any>(false);
  const create = async () => {
    if (name == "") return;
    setloading_create(true);
    try {
      await axios
        .post(
          `${endpoint}/database/createcollection`,
          { name, projectId: localStorage.getItem("projectId") },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          //add to the collection;
          const updatedcollection = [...collections];
          updatedcollection[collections.length] = name;
          setcollections(updatedcollection);
          setname("");
          setsuccess(true);
          const myTimeout = setTimeout(onClose, 500);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err: any) {
      console.log(err);
    }
    setloading_create(false);
  };

  const delete_collection = (name: any) => {
    const updatecollections = collections.filter((val: any) => val != name);
    setcollections(updatecollections);
    setselected_index(-1);
  };

  return (
    <div className="w-[100%] mt-5 relative">
      <div className="text-center w-[100%] font-bold">DataBase</div>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Your New Database</ModalHeader>
          <ModalCloseButton onClick={() => setsuccess(false)} />
          <div className="flex justify-center items-center flex-col">
            <div className="flex justify-center items-center">
              <input
                type="text"
                value={name}
                placeholder="Name of the Collection"
                onChange={(e: any) => (success ? "" : handlenamechange(e))}
                className="outline-none p-1 border ml-2 w-[20vw] rounded"
              />
            </div>

            <div
              className="bg-blue-500 text-white p-2 mt-3 mb-4 w-[20vw] text-center rounded cursor-pointer"
              onClick={() => {
                success ? "" : create();
              }}
            >
              {loading_create ? <Spinner /> : success ? "Created" : "Create"}
            </div>
          </div>
        </ModalContent>
      </Modal>
      {/* animation idea : like raining map function load */}
      {/* <div className={"w-[100%] absolute top-"+(position.top)}>|</div> */}
      <div className="h-[90vh] w-[100%] mt-6">
        {selected_index != -1 ? (
          <Collection_data
            name={collections[selected_index]}
            back={() => setselected_index(-1)}
            remove={delete_collection}
          />
        ) : loading ? (
          <div className="w-[100%] h-[100%] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="w-[100%] h-fit container grid grid-cols-5 gap-5 p-5">
            <div className="p-4 rounded-full w-[10vw] h-[10vh] flex justify-center items-center cursor-pointer">
              <div
                className="border rounded-full w-[3vw] h-[6vh] p-2 flex justify-center items-center"
                onClick={() => onOpen()}
              >
                +
              </div>
            </div>
            {collections.map((value: any, index: any) => {
              return (
                <div
                  className="border p-2 rounded w-[10vw] h-[10vh] flex justify-center items-center cursor-pointer hover:bg-blue-500 hover:text-white"
                  onClick={() => handleclick(index)}
                  key={index}
                >
                  {value}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
