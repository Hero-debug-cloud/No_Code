"use client";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import endpoint from "../../variables";
import { useCookies } from "react-cookie";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";

const Individual = ({ id, back, remove }: any) => {
  const [cookies] = useCookies(["token"]);
  const [loading, setloading] = useState<any>(false);
  const [data, setdata] = useState<any>([]);
  const [schema, setschema] = useState<any>([]);

  //options for filter;
  const string_options = ["Sub String Present", "Equal to", "Not Equal to"];
  const number_options = ["Equal to", "Less than", "More than", "Not Equal to"];
  const bool_options = ["Equal to","Not Equal to"];
  const bool_value :any= [true, false];

  const getdata = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/custom_api/get_individualapi`,
          { _id: id },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setdata(response.data.message);
          // setreturned(response.data.message[0].return);
          // console.log("here ");
          // console.log(response.data.message[0].return);
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
      //getting schema here;
      await axios
        .post(
          `${endpoint}/custom_api/get_individualapi_schema`,
          { _id: id, projectId: localStorage.getItem("projectId") },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setschema(response.data.message);
          console.log(response.data.message);
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
    } catch (err) {
      console.log(err);
    }
    setloading(false);
  };

  useEffect(() => {
    getdata();
  }, []);

  const [loading_delete, setloading_delete] = useState<any>(false);
  const handledelete = async() => {
  setloading_delete(true);
  try {
    await axios
      .post(
        `${endpoint}/custom_api/delete_it`,
        { _id: id },
        {
          headers: { Authorization: `Bearer ${cookies["token"]}` },
        }
      )
      .then(function (response: any) {
           remove(id);
      })
      .catch(function (error: any) {
        toast("Error " + error);
      });
  } catch (err) {
    console.log(err);
  }
  setloading_delete(false);
  };

  const [isupdated, setisupdated] = useState<any>(false);

  const handlecheck = (val: any) => {
    const result = data[0]?.filter.filter((value: any) => value.name == val);
    if (result && result[0] == undefined) return false;
    return true;
  };

  const handleactive = (e: any) => {
    setisupdated(true);
    const updateddata = [...data];
    data[0].active = e.target.checked;
    setdata(updateddata);
  };
  const handlechange = (e: any, name: any) => {
    setisupdated(true);
    const updateddata = [...data];
    updateddata[0][name] = e.target.value;
    setdata(updateddata);
  };
  const handlereturn = (e: any, val: any) => {
    setisupdated(true);
    //true
    if (e.target.checked) {
      const updateddata = [...data];
      const updatedreturn = data[0].return;
      updatedreturn[updatedreturn.length] = val;
      updateddata[0].return = updatedreturn;
      setdata(updateddata);
    }
    //false
    else {
      const updateddata = [...data];
      const updatedreturn = data[0].return.filter((value: any) => value != val);
      updateddata[0].return = updatedreturn;
      setdata(updateddata);
    }
  };
  const handlefilter_bool=(e:any,val:any)=>{
    if (e.target.checked) {
      const updateddata = [...data];
      const size = updateddata[0].filter.length;
      updateddata[0].filter[size] = {
        name: val,
        operation: "Equal to",
        value: true,
      };
      setdata(updateddata);
    }
    //remove filter;
    else {
      const updateddata = [...data];
      const updatedfilter = updateddata[0].filter.filter(
        (value: any) => value.name != val
      );
      updateddata[0].filter = updatedfilter;
      setdata(updateddata);
    }
  }
  const handlefilter_number=(e:any,val:any)=>{
    if (e.target.checked) {
      const updateddata = [...data];
      const size = updateddata[0].filter.length;
      updateddata[0].filter[size] = {
        name: val,
        operation: "Equal to",
        value: 0,
      };
      setdata(updateddata);
    }
    //remove filter;
    else {
      const updateddata = [...data];
      const updatedfilter = updateddata[0].filter.filter(
        (value: any) => value.name != val
      );
      updateddata[0].filter = updatedfilter;
      setdata(updateddata);
    }
  }
  const handlefilterchange = (e: any, val: any,type:any) => {
    setisupdated(true);
    if(type=="Boolean"){
      handlefilter_bool(e,val);
      return;
    }
    else if(type=="Number"){
      handlefilter_number(e,val);
      return;
    }
    //add filter;
    if (e.target.checked) {
      const updateddata = [...data];
      const size = updateddata[0].filter.length;
      updateddata[0].filter[size] = {
        name: val,
        operation: "Equal to",
        value: "testing",
      };
      setdata(updateddata);
    }
    //remove filter;
    else {
      const updateddata = [...data];
      const updatedfilter = updateddata[0].filter.filter(
        (value: any) => value.name != val
      );
      updateddata[0].filter = updatedfilter;
      setdata(updateddata);
    }
  };
  const get_operation = (val: any) => {
    const updateddata = [...data];
    const result = updateddata[0].filter.filter(
      (value: any) => value.name == val
    );
    return result[0].operation;
  };
  const get_value = (val: any) => {
    const updateddata = [...data];
    const result = updateddata[0].filter.filter(
      (value: any) => value.name == val
    );
    return result[0].value;
  };
  const handlechange_operation = async (e: any, val: any) => {
    setisupdated(true);
    await new Promise((resolve: any, reject: any) => {
      data[0].filter.map((value: any, index: any) => {
        if (value.name == val) {
          const updateddata = [...data];
          updateddata[0].filter[index].operation = e.target.value;
          setdata(updateddata);
          resolve();
        }
      });
    });
  };
  const handlechange_value = async (e: any, val: any) => {
    if (e.target.value == "") setempty(true);
    else setempty(false);
    setisupdated(true);
    await new Promise((resolve: any, reject: any) => {
      data[0].filter.map((value: any, index: any) => {
        if (value.name == val) {
          const updateddata = [...data];
          updateddata[0].filter[index].value = e.target.value;
          setdata(updateddata);
          resolve();
        }
      });
    });
  };
  const handlechangeValue_bool=async(e:any,val:any)=>{
    setisupdated(true);
    await new Promise((resolve: any, reject: any) => {
      data[0].filter.map((value: any, index: any) => {
        if (value.name == val) {
          const updateddata = [...data];
          console.log("current "+updateddata[0].filter[index].value);
          updateddata[0].filter[index].value = Boolean(e.target.value=="true");
          // updateddata[0].filter[index].value = Boolean(answer);
          setdata(updateddata);
          resolve();
        }
      });
    });
  }
  const [empty,setempty]=useState<any>(false);
  const handlechangeValue_number=async(e:any,val:any)=>{
    if(e.target.value=="") setempty(true);
    else setempty(false);
     setisupdated(true);
     await new Promise((resolve: any, reject: any) => {
       data[0].filter.map((value: any, index: any) => {
         if (value.name == val) {
           const updateddata = [...data];
          //  console.log("current " + updateddata[0].filter[index].value);
           updateddata[0].filter[index].value =
            parseInt( e.target.value)
           ;
           // updateddata[0].filter[index].value = Boolean(answer);
           setdata(updateddata);
           resolve();
         }
       });
     });
  }
  const [loading_update, setloading_update] = useState<any>(false);
  const [edit, setedit] = useState<any>(false);
  const handleupdate = async () => {
    if(empty) return;
    setloading_update(true);
    try {
      await axios
        .post(
          `${endpoint}/custom_api/update_it`,
          { data },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then(function (response: any) {
          setisupdated(false);
          setedit(false);
        })
        .catch(function (error: any) {
          toast("Error " + error);
        });
    } catch (err) {
      console.log(err);
    }
    setloading_update(false);
  };
  useEffect(() => {
    console.log("data");
    console.log(data);
  }, [data, setdata]);

  return (
    <>
      {loading ? (
        <div className="w-[100%] h-[100%] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-[100%] h-[100%] p-5">
          {/* header layer */}
          <div className="flex w-[100%] justify-between items-center">
            <div className="flex">
              <IoIosArrowBack
                onClick={() => back()}
                className="cursor-pointer"
              />
            </div>
            <div className="font-bold">Database : {data[0]?.database_name}</div>
            <div className="flex">
              <div
                className="border rounded-lg p-2 cursor-pointer mr-4"
                onClick={() => setedit(true)}
              >
                <BiEdit />
              </div>

              <div
                onClick={handledelete}
                className="border rounded-lg p-2 cursor-pointer"
              >
                {loading_delete ? <Spinner /> : <AiFillDelete />}
              </div>
            </div>
          </div>

          <div className="ml-[8vw] mt-[3vw] h-[93%] overflow-scroll">
            {data.map((value: any,index:any) => {
              return (
                <div key={index}>
                  <div className="flex items-center">
                    <div className="font-bold w-[15%]">Active </div>
                    <div className="w-[85%] flex items-center">
                      <div
                        className={
                          "w-[1vw] h-[2vh] rounded-full mr-[10vw] " +
                          (value.active ? "bg-green-500" : "bg-red-500")
                        }
                      ></div>
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={value.active}
                        onClick={handleactive}
                        disabled={edit ? undefined : true}
                      />
                      <div className="w-[80%] flex justify-end">
                        {isupdated ? (
                          <div
                            onClick={handleupdate}
                            className="p-2 border rounded cursor-pointer bg-blue-500 text-white"
                          >
                            {loading_update ? <Spinner /> : "Update"}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex mt-4">
                    <div className="font-bold w-[15%]">Name </div>
                    <input
                      type="text"
                      value={value.name}
                      className="W-[85%] outline-none bg-gray-100 p-1 rounded"
                      onChange={(e: any) => handlechange(e, "name")}
                      disabled={edit ? undefined : true}
                    />
                    {/* <div className="w-[85%]">{value.name}</div> */}
                  </div>
                  <div className="flex mt-4">
                    <div className="font-bold w-[15%]">Endpoint </div>
                    <input
                      type="text"
                      value={value.endpoint}
                      className="W-[85%] outline-none bg-gray-100 p-1 rounded"
                      onChange={(e: any) => handlechange(e, "endpoint")}
                      disabled={edit ? undefined : true}
                    />
                    {/* <div className="w-[85%]">{value.endpoint}</div> */}
                  </div>
                  <div className="w-[40vw] mt-4">
                    <div className="font-bold ">Return Values </div>
                    <div className="w-[40vw] border flex mt-5 rounded p-1">
                      <div className="w-[50%] text-center">Name</div>
                      <div className="w-[50%] text-center">Type</div>
                      <div className="w-[50%] text-center">Requried</div>
                    </div>
                    {schema[0]?.field_name &&
                      schema[0]?.field_name.map((value: any, index: any) => {
                        return (
                          <>
                            <div className="w-[40vw] flex mt-5 justify-between" key={index}>
                              <div className="w-[50%] text-center  outline-none p-1 rounded">
                                {value}
                              </div>
                              <div className="w-[50%] text-center  outline-none p-1 rounded">
                                {schema[0]?.field_type[index]}
                              </div>
                              <div className="w-[50%] flex justify-center items-center">
                                <input
                                  type="checkbox"
                                  checked={data[0].return.includes(value)}
                                  className="cursor-pointer"
                                  onChange={(e: any) => handlereturn(e, value)}
                                  disabled={edit ? undefined : true}
                                />
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                  <div className="flex mt-5 flex-col mb-[20vh]">
                    <div className="font-bold w-[15%]">Filter (Optional)</div>
                    <div className="mt-[2vh] ml-[3vw]">
                      {schema[0]?.field_name.map((value: any,index:any) => {
                        return (
                          <div key={index}>
                            <div className="flex">
                              {value}
                              <input
                                type="checkbox"
                                checked={handlecheck(value)}
                                className="cursor-pointer ml-5"
                                onChange={(e: any) =>
                                  handlefilterchange(
                                    e,
                                    value,
                                    schema[0]?.field_type[
                                      (schema[0]?.field_name).indexOf(value)
                                    ]
                                  )
                                }
                                disabled={edit ? undefined : true}
                              />
                            </div>
                            {handlecheck(value) && (
                              <div className="flex">
                                {schema[0]?.field_type[
                                  (schema[0]?.field_name).indexOf(value)
                                ] == "String" ? (
                                  //string here
                                  <div className="flex mt-3 mb-3">
                                    <select
                                      className="outline-none w-[50%] cursor-pointer bg-gray-100 p-1 border "
                                      value={get_operation(value)}
                                      onChange={(e: any) =>
                                        handlechange_operation(e, value)
                                      }
                                      disabled={edit ? undefined : true}
                                    >
                                      <option value="none" disabled selected>
                                        Select Any Filter
                                      </option>
                                      {string_options.map(
                                        (value: any, index: any) => (
                                          <option
                                            value={value}
                                            key={index}
                                            className="cursor-pointer"
                                          >
                                            {value}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <input
                                      type="text"
                                      className="w-[50%] bg-gray-100 p-1 outline-none border ml-5"
                                      value={get_value(value)}
                                      onChange={(e: any) =>
                                        handlechange_value(e, value)
                                      }
                                      disabled={edit ? undefined : true}
                                    />
                                  </div>
                                ) : schema[0]?.field_type[
                                    (schema[0]?.field_name).indexOf(value)
                                  ] == "Number" ? (
                                  //number here
                                  <div className="flex mt-3 mb-3">
                                    <select
                                      className="outline-none w-[50%] cursor-pointer bg-gray-100 p-1 border "
                                      disabled={edit ? undefined : true}
                                      onChange={(e: any) =>
                                        handlechange_operation(e, value)
                                      }
                                      value={get_operation(value)}
                                    >
                                      <option value="none" disabled selected>
                                        Select Any Filter
                                      </option>
                                      {number_options.map(
                                        (value: any, index: any) => (
                                          <option
                                            value={value}
                                            key={index}
                                            className="cursor-pointer"
                                          >
                                            {value}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <input
                                      type="number"
                                      className="w-[50%] bg-gray-100 p-1 outline-none border ml-5"
                                      disabled={edit ? undefined : true}
                                      onChange={(e: any) =>
                                        handlechangeValue_number(e, value)
                                      }
                                      value={get_value(value)}
                                    />
                                  </div>
                                ) : (
                                  //bool here
                                  <div className="flex mt-3 mb-3">
                                    <select
                                      className="outline-none w-[50%] cursor-pointer bg-gray-100 p-1 border "
                                      disabled={edit ? undefined : true}
                                      value={get_operation(value)}
                                      onChange={(e: any) =>
                                        handlechange_operation(e, value)
                                      }
                                    >
                                      <option value="none" disabled selected>
                                        Select Any Filter
                                      </option>
                                      {bool_options.map(
                                        (value: any, index: any) => (
                                          <option
                                            value={value}
                                            key={index}
                                            className="cursor-pointer"
                                          >
                                            {value} 
                                          </option>
                                        )
                                      )}
                                      
                                    </select>
                                    <select
                                      className="w-[50%] bg-gray-100 p-1 outline-none border ml-5"
                                      disabled={edit ? undefined : true}
                                      onChange={(e: any) =>
                                        handlechangeValue_bool(e, value)
                                      }
                                      value={
                                        get_value(value)
                                      }
                                    >
                                      <option value="none" disabled selected>
                                        Select Any Value
                                      </option>
                                      {bool_value.map(
                                        (value: any, index: any) => (
                                          <option
                                            value={value?"true":"false"}
                                            key={index}
                                            className="cursor-pointer"
                                          >
                                            {value ? "True" : "False"}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Individual;
