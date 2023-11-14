import React, { useState, useEffect } from "react";
import endpoint from "../../variables";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";
import Individual from "./individual";
const Apis = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setoptions] = useState<any>([]);
  const [cookies] = useCookies(["token"]);

  
  const [loading_options, setloading_options] = useState<any>();
  const handleadd = async () => {
    setloading_options(true);
    try {
      await axios
        .post(
          `${endpoint}/custom_api/findall_database`,
          { projectId: localStorage.getItem("projectId") },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setoptions(response.data.message);
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
    } catch (err) {
      console.log(err);
    }
    setloading_options(false);
  };

  const [loading_create, setloading_create] = useState<any>(false);
  const [data, setdata] = useState<any>([
    {
      name: "",
      endpoint: "",
      database_name: "",
      type: "",
    },
  ]);
  const handlechange = (e: any, name: any) => {
    const updateddata = [...data];
    updateddata[0][name] = e.target.value;
    setdata(updateddata);
  };
  const handlecreate = async () => {
    setloading_create(true);
    try {
      await axios
        .post(`${endpoint}/custom_api/create_api`, data[0], {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        })
        .then(function (response: any) {
          const updated = [...api];
          updated[api.length] = {
            _id: response.data.message,
            ...data[0],
          };
          setapi(updated);
          onClose();
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
    } catch (err) {
      console.log(err);
    }
    setloading_create(false);
  };
  const [loading_api, setloading_api] = useState<any>(false);
  const [api, setapi] = useState<any>([]);
  const getapi = async () => {
    setloading_api(true);
    try {
      await axios
        .post(
          `${endpoint}/custom_api/get_api`,
          {},
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setapi(response.data.message);
          console.log(response.data.message);
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
    } catch (err) {
      console.log(err);
    }
    setloading_api(false);
  };
  useEffect(() => {
    getapi();
  }, []);

  const [curr_id, setcurr_id] = useState<any>(-1);
  const handleclick = (id: any) => {
    setcurr_id(id);
    console.log("here");
  };

  const handleremove = (id: any) => {
    const updatedapi = api.filter((value: any) => value._id != id);
    setapi(updatedapi);
    setcurr_id(-1);
  };
  return (
    <div className="w-[100%] h-[95vh] mt-5">
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Your API</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Lorem count={2} /> */}
            <div className="w-[100%] flex justify-center items-center">
              {loading_options ? (
                <Spinner />
              ) : (
                <div className="flex flex-col w-[100%]">
                  <input
                    type="text"
                    placeholder="Name of the API"
                    className="p-2 bg-gray-100 rounded w-[90%] outline-none"
                    onChange={(e: any) => handlechange(e, "name")}
                  />
                  <input
                    type="text"
                    placeholder="Enter Endpoint like : example/test"
                    className="p-2 bg-gray-100 rounded w-[90%] outline-none mt-5"
                    onChange={(e: any) => handlechange(e, "endpoint")}
                  />
                  <select
                    className="p-2 bg-gray-100 rounded w-[90%] outline-none mt-5 "
                    onChange={(e: any) => handlechange(e, "database_name")}
                  >
                    <option value="test" disabled selected>
                      Select DataBase
                    </option>
                    {options.map((value: any,index:any) => {
                      return <option value={value} key={index}>{value}</option>;
                    })}
                  </select>
                  <select
                    className="p-2 bg-gray-100 rounded w-[90%] outline-none mt-5 mb-5"
                    onChange={(e: any) => handlechange(e, "type")}
                  >
                    <option value="test" disabled selected>
                      Type of API
                    </option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <div
                    className="p-2 w-[100%] rounded bg-blue-500 text-white cursor-pointer mb-5 text-center"
                    onClick={handlecreate}
                  >
                    {loading_create ? <Spinner /> : "Create"}
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <h1 className="w-[100%] text-center font-bold text-xl">Custom API</h1>

      {curr_id != -1 ? (
        <div className="w-[100%] h-[95%]">
          <Individual
            id={curr_id}
            back={() => setcurr_id(-1)}
            remove={handleremove}
          />
        </div>
      ) : (
        <div className="mt-5 w-[100%] h-fit container grid grid-cols-5 gap-5 p-5">
          <div
            className="border rounded-full w-[3vw] h-[6vh] p-2 flex justify-center items-center cursor-pointer"
            onClick={() => {
              handleadd();
              onOpen();
            }}
          >
            +
          </div>
          {loading_api ? (
            <Spinner />
          ) : (
            <>
              {api.map((value: any,index:any) => {
                return (
                  <div
                    className="border p-3 rounded flex justify-center items-center cursor-pointer hover:font-bold"
                    onClick={() => handleclick(value._id)}
                    key={index}
                  >
                    {value.name}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Apis;
