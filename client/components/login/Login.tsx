"use client";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import endpoint from "../../variables";

const Login = () => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const [checked, setchecked] = useState(false);

  const togglehandle = () => {
    setchecked((prev) => !prev);
  };

  type usertype = {
    username: string;
    password: string;
  };

  const [user, setuser] = useState<usertype>({
    username: "",
    password: "",
  });

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setuser({ ...user, [e.target.name]: e.target.value });
  };

  const userpasserror = () => toast("Username or Passowrd is Wrong");
  const internalerror = () => toast("Internal Error, Please try Again...");
  const success = () => toast("Login Successfully...");

  const [loading, setloading] = useState<boolean>(false);
  const submit = async () => {
    setloading(true);
    try {
      await axios
        .post(`${endpoint}/auth/login_user`, user)
        .then(function (response) {
          setloading(false);
          setCookie("token", response.data);
          if (typeof window !== "undefined") {
            // This code will only run in the browser
            router.push("/projects");
          }

        })
        .catch(function (error) {
          setloading(false);
          if (error.response.status == 401) {
            userpasserror();
          } else {
            internalerror();
          }
        });
    } catch (err) {
      setloading(false);
      console.log(err);
    }
  };

  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="">
        <label className="font-bold">Username</label>
        <br />
        <input
          type="text"
          placeholder="Enter your Username"
          className="p-2 w-[100%] border rounded outline-none mt-2"
          name="username"
          value={user.username}
          onChange={handlechange}
        />
      </div>
      <div className="">
        <label className="font-bold">Password</label>
        <br />
        <input
          type={checked ? "text" : "password"}
          placeholder="Enter your Password"
          className="p-2 w-[100%] border rounded outline-none mt-2"
          name="password"
          value={user.password}
          onChange={handlechange}
        />
        <div className="">
          <input
            type="checkbox"
            name="pass"
            className="mt-2 mb-2 mr-2 cursor-pointer"
            checked={checked}
            onClick={togglehandle}
          />
          <span className="">Show Password</span>
        </div>
      </div>
      <button
        className="w-[100%] bg-blue-500 text-white rounded p-2 mt-2 mb-2"
        onClick={submit}
      >
        {loading ? <Spinner /> : "Login"}
      </button>
    </div>
  );
};

export default Login;
