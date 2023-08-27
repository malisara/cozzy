"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import Button from "@/components/Button";
import { imageCover } from "@/components/utils/style";
// import { BACKEND_API_URL } from "@/constants";
import { SESSION_TOKEN, USER_ID } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import UserCredentials from "@/models/userCredentials";
import loginImage from "@/../public/login.png";

function createDummyToken(): string {
  //taken from:
  //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  let token = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 10) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return token;
}

const formStyle =
  "rounded-md outline-none bg-white h-[3rem] px-3 \
    text-gray-600 focus:outline-base-secondary border border-gray-200";

function Login(): JSX.Element {
  const router = useRouter();
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const { userId, setUserId } = useGlobalContext();
  const [loginData, setLoginData] = useState<UserCredentials>({
    username: "",
    password: "",
  });

  useEffect(() => {
    //redirect logged-in user to homepage
    if (userId !== 0) {
      router.push("/");
    }
  }, []);

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

  // function handleLogin(event: React.FormEvent) {
  //   //TODO fix when issue is closed
  //   //https://github.com/keikaavousi/fake-store-api/issues/97
  //   event.preventDefault();
  //   fetch(`${BACKEND_API_URL}/auth/login`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       username: loginData.username,
  //       password: loginData.password,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       //returns {'token' : '...'}
  //       if ("token" in json) {
  //         sessionStorage.setItem("token", "token");
  //         router.push("/");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error unable to login:", error);
  //     });
  // }

  async function handleLogin(event: React.FormEvent) {
    //temporary dummy function
    //always logs in user as one of the users provided in API
    event.preventDefault();

    const randomUserId = await getRandomUserId();

    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_TOKEN, createDummyToken());
      sessionStorage.setItem(USER_ID, JSON.stringify(randomUserId));
    }
    setUserId(randomUserId);
    router.push("/");
  }

  async function getRandomUserId(): Promise<number> {
    const allUserIds = await fetchUsers();
    const randomIndex = Math.floor(Math.random() * allUserIds.length);
    return allUserIds[randomIndex];
  }

  async function fetchUsers(): Promise<number[]> {
    return fetch("https://fakestoreapi.com/users")
      .then((res) => res.json())
      .then((json) => json.map((user: any) => user.id))
      .catch((error) => {
        console.error("Error fetching users data:", error);
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
        <p className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Welcome back!
        </p>
        <p className=" text-l md:text-xl pb-8">Let's get you logged in</p>

        <form
          className="flex flex-col mx-5 xl:mx-[5rem] mb-3 gap-5 md:gap-10"
          method="post"
          onSubmit={(event) => handleLogin(event)}
        >
          <input
            className={formStyle}
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
        <Image src={loginImage} alt="" className={imageCover} />
      </div>
    </div>
  );
}

export default Login;
