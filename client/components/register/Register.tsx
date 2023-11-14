import { FormEvent, useRef, useState } from "react";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Spinner } from "@chakra-ui/react";

type propstype = {
  go: Function;
};
import endpoint from "../../variables";
const Register = (props: propstype) => {


  const [checked, setcheck] = useState(false);
  const togglehandle = () => {
    setcheck((prev) => !prev);
  };

  const errorishere = () => toast("Username Already Registered!!");
  const internalerror = () => toast("Internal Error, Please try Again...");

  //all variables;
  type values = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    username: string;
  };
  const [user, setuser] = useState<values>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    username: "",
  });

  const handlingchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setuser({ ...user, [e.target.name]: e.target.value });
  };
  const [loading,setloading]=useState<boolean>(false);
  const submit = async (e: FormEvent) => {
    setloading(true);
    try {
      e.preventDefault();
      await axios
        .post(`${endpoint}/auth/register_user`, user)
        .then(function () {
          props.go();
        })
        .catch(function (error) {
          if (error.response.status == 403) {
            errorishere();
          } else {
            internalerror();
          }
        });
    } catch (err) {
      console.log(err);
    }
    setloading(false);
  };

  return (
    <form className="p-2" onSubmit={submit}>
      <div className="">
        <label className="font-bold">Name</label>
        <br />
        <input
          type="text"
          placeholder="First Name"
          className="p-2 w-[100%] border rounded outline-none mt-1"
          onChange={handlingchange}
          name="firstname"
          value={user.firstname}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-2 w-[100%] border rounded outline-none mt-2"
          onChange={handlingchange}
          value={user.lastname}
          name="lastname"
          required
        />
      </div>
      <div className="">
        <label className="font-bold">E-mail</label>
        <br />
        <input
          type="email"
          placeholder="Enter your Email"
          className="p-2 w-[100%] border rounded outline-none mt-1"
          onChange={handlingchange}
          value={user.email}
          name="email"
          required
        />
      </div>
      <div className="">
        <label className="font-bold">Username</label>
        <br />
        <input
          type="text"
          placeholder="Enter your Username"
          className="p-2 w-[100%] border rounded outline-none mt-1"
          onChange={handlingchange}
          value={user.username}
          name="username"
          required
        />
      </div>
      <div className="">
        <label className="font-bold">Password</label>
        <br />
        <input
          type={checked ? "text" : "password"}
          placeholder="Enter your Password"
          className="p-2 w-[100%] border rounded outline-none mt-1"
          onChange={handlingchange}
          value={user.password}
          name="password"
          required
        />
        <div className="">
          <input
            type="checkbox"
            className="mt-2 mb-2 mr-2 cursor-pointer"
            name="checkbox"
            checked={checked}
            onClick={togglehandle}
          />
          <span className="">Show Password</span>
        </div>
      </div>
      <button
        className="w-[100%] bg-blue-500 text-white rounded p-2 mt-2 mb-2"
        type="submit"
      >
        {loading?<Spinner/>:"SignUp"}
      </button>
    </form>
  );
};

export default Register;
