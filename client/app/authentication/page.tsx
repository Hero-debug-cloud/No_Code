"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import LandingPage from "../../components/authentication/landingpage";

import User from "../../components/database/user";
import { setLazyProp } from "next/dist/server/api-utils";
import { Spinner } from "@chakra-ui/react";
import endpoint from "../../variables";

const Page = () => {
  const [cookies] = useCookies(["token"]);
  const [has_userdatabase, set_has_userdatabase] = useState<any>();

  const [loading, setloading] = useState<any>(false);

  const check_userdatabase = async () => {
    setloading(true);
    try {
      await axios
        .post(
          `${endpoint}/user_database/checkuser`,
          {
            projectId: localStorage.getItem("projectId"),
          },
          {
            headers: { Authorization: `Bearer ${cookies["token"]}` },
          }
        )
        .then((response: any) => {
          set_has_userdatabase(response.data.message);
        })
        .catch((err: any) => {
          toast("Error " + err.message);
        });
    } catch (err) {
      toast("API Failed Check Console or Try Again Later!");
      console.log(err);
    }
    setloading(false);
  };
  useEffect(() => {
    //check if database is created for the user or not;
    check_userdatabase();
  }, []);
  return (
    <>
      {loading ? (
        <div className="w-[100%] text-center h-[90vh] flex justify-center items-center">
          <Spinner />
        </div>
      ) : has_userdatabase == 1 ? (
        //register and login page;
        <>
          <LandingPage />
        </>
      ) : (
        <>
          <User refresh={check_userdatabase} />
        </>
      )}
    </>
  );
};

export default Page;
