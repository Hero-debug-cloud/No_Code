"use client";
import React from "react";
import { useEffect, useState } from "react";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import { ChakraProvider } from "@chakra-ui/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import endpoint from "../variables";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [check, setcheck] = useState("register");
	const [cookies] = useCookies(["token"]);

	//changing css of the element;
	const inner = {
		border: "1px solid black",
		borderRadius: "5px",
		width: "460px",
		// height: check == "register" ? "600px" : "380px",
		padding: "10px",
	};
	const register = {
		borderBottom: check == "register" ? "4px solid #19A2D8" : "none",
	};
	const login = {
		borderBottom: check == "login" ? "4px solid #19A2D8" : "none",
	};
	const success = () => toast("Your Registration is Complete Now...");
	const gottologin = () => {
		success();
		setcheck("login");
	};

	const checkToken = async () => {
		if (cookies["token"]) {
			await axios.get(`${endpoint}/auth/token_check`, {
				headers: { Authorization: `Bearer ${cookies["token"]}` },
			});
			router.push("/projects");
		}
	};

	useEffect(() => {
		checkToken();
	}, []);

	return (
		<ChakraProvider>
			{/* if already login then redirect to the main page; */}
			<div className="h-[100vh] flex justify-center items-center bg-[#FEFCFF]">
				<div style={inner}>
					<div className="flex w-[100%]">
						<h1
							style={register}
							className="cursor-pointer w-[50%] p-2 text-center"
							onClick={() => {
								setcheck("register");
							}}
						>
							Register
						</h1>
						<h1
							style={login}
							className="cursor-pointer w-[50%] p-2 text-center"
							onClick={() => {
								setcheck("login");
							}}
						>
							Login
						</h1>
					</div>

					{check == "register" ? <Register go={gottologin} /> : <Login />}
					<div className="text-center mt-2 mb-2">
						By continuing, you agree to our Terms and Conditions and Privacy
						Statement
					</div>
				</div>
			</div>
		</ChakraProvider>
	);
}
