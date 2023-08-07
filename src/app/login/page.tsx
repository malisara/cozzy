"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import Button from "@/components/Button";
import { imageCover } from "@/components/utils/style";
import { BACKEND_API_URL } from "@/constants";
import UserCredentials from "@/models/userCredentials";
import loginImage from "@/../public/login.png";

function Login(): JSX.Element {
  const formStyle =
    "rounded-md outline-none bg-white h-[3rem] px-3 \
    text-gray-600 focus:outline-base-secondary border border-gray-200";

  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<UserCredentials>({
    username: "",
    password: "",
  });

  function togglePasswordVisibility() {
    setVisiblePassword((previous) => !previous);
  }

  function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.name === "username") {
      const username = event.currentTarget.value.trim();
      setLoginData({ ...loginData, username: username });
    } else {
      const password = event.currentTarget.value.trim();
      setLoginData({ ...loginData, password: password });
    }
  }

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: loginData.username,
        password: loginData.password,
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((error) => {
        console.error("Error unable to login:", error);
      });
  }

  useEffect(() => {
    if (loginData.password.length > 0 && loginData.username.length > 0) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [loginData]);

  return (
    <div
      className="mt-[5rem] md:mt-[10rem] flex flex-col 
    md:flex-row px-2 md:px-10 mb-[6rem]"
    >
      <div className="flex-1 text-center">
        <div className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Welcome back!
        </div>
        <div className=" text-l md:text-xl pb-8">Let's get you logged in</div>

        <form
          className="flex flex-col mx-5 xl:mx-[5rem] mb-3 gap-5 md:gap-10"
          method="post"
          onSubmit={(event) => handleLogin(event)}
        >
          <input
            className={`${formStyle}`}
            placeholder="username"
            onBlur={(event) => handleBlur(event)}
            name="username"
          />
          <div className="relative">
            <input
              type={visiblePassword ? "text" : "password"}
              className={`${formStyle} w-full`}
              placeholder="password"
              onBlur={(event) => handleBlur(event)}
              name="password"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2
               cursor-pointer inline-block"
              onClick={togglePasswordVisibility}
            >
              {visiblePassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <Button text={"login"} disabled={btnDisabled} />
        </form>
        <Link
          href="/register"
          className="text-s underline
         hover:text-base-secondary"
        >
          Register?
        </Link>
      </div>
      <div className="bg-yellow-200 flex-1 order-first md:order-none">
        <Image src={loginImage} alt="" className={`${imageCover}`} />
      </div>
    </div>
  );
}
<div className="bg-green-200"></div>;

export default Login;
