"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm, SubmitHandler } from "react-hook-form";

import Button from "@/components/Button";
import { imageCover } from "@/components/utils/style";
// import { SESSION_TOKEN } from "@/constants";

import { BACKEND_API_URL, BASKET_SESSION_KEY, USER_ID_KEY } from "@/constants";
import { useGlobalContext } from "@/context/GlobalContext";
import { BasketItem, BasketItems } from "@/models/basket";
import { noBlankSpacesMEssage, noBlankSpacesRegEx } from "@/utils/regExValues";
import loginImage from "@/../public/login.png";

const formStyle =
  "rounded-md outline-none bg-white h-[3rem] px-3 text-gray-600\
   focus:outline-base-secondary border border-gray-200";
const inputDivStyle = "flex flex-col w-full";
const allUsersIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //https://fakestoreapi.com/users

type Inputs = {
  userName: string;
  password: string;
};

function getRandomUserId(): number {
  const randomIndex = Math.floor(Math.random() * allUsersIds.length);
  return allUsersIds[randomIndex];
}

function Login(): JSX.Element | null {
  const router = useRouter();
  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);
  const { userId, setUserId, setBasketItems } = useGlobalContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>();

  useEffect(() => {
    //redirect logged-in user to homepage
    if (userId !== null) {
      router.push("/");
    }
  }, []);

  const onSubmit: SubmitHandler<Inputs> = () => {
    const userId = getRandomUserId();
    sessionStorage.setItem(USER_ID_KEY, JSON.stringify(userId));
    setUserId(userId);
    router.back();
  };

  useEffect(() => {
    if (userId !== null) {
      setBasket();
    }
  }, [userId]);

  async function setBasket() {
    const basket = await getBasketItems();
    setBasketItems(basket);
    sessionStorage.setItem(BASKET_SESSION_KEY, JSON.stringify(basket));
  }

  async function getBasketItems(): Promise<BasketItems> {
    return fetch(`${BACKEND_API_URL}/carts/user/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.length < 1) {
          //user doesn't have a basket yet
          return new BasketItems(null, userId, null, []);
        }
        //return the first basket if user has multiple baskets
        return new BasketItems(
          json[0].id,
          userId,
          json[0].date,
          json[0].products.map(
            (item: any) => new BasketItem(item.productId, item.quantity)
          )
        );
      });
  }

  function togglePasswordVisibility() {
    setPasswordIsVisible((previous) => !previous);
  }

  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //   //TODO fix when issue is closed
  //   //https://github.com/keikaavousi/fake-store-api/issues/97
  //   fetch(`${BACKEND_API_URL}/auth/login`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       username: data.userName,
  //       password: data.password,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((json) => {
  //       //returns {'token' : '...'}
  //       if ("token" in json && typeof window !== "undefined") {
  //         sessionStorage.setItem(SESSION_TOKEN, json["token"]);
  //         router.push("/");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error unable to login:", error);
  //     });
  // };

  return (
    <div
      className="mt-[5rem] md:mt-[10rem] flex flex-col md:flex-row 
      px-2 md:px-10 mb-[6rem]"
    >
      <div className="flex-1 text-center">
        <p className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Welcome back!
        </p>
        <p className=" text-l md:text-xl pb-8">Let's get you logged in</p>

        <form
          action="submit"
          className="flex flex-col mx-5 xl:mx-[5rem] mb-3 gap-5 md:gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={inputDivStyle}>
            <input
              placeholder="Username"
              {...register("userName", {
                required: "This field is required",

                pattern: {
                  value: noBlankSpacesRegEx,
                  message: noBlankSpacesMEssage,
                },
              })}
              className={formStyle}
            />

            {errors.userName && <span>{errors.userName.message}</span>}
          </div>

          <div className={`${inputDivStyle} relative`}>
            <input
              placeholder="Password"
              {...register("password", {
                required: "This field is required",

                pattern: {
                  value: noBlankSpacesRegEx,
                  message: noBlankSpacesMEssage,
                },
              })}
              className={formStyle}
              type={passwordIsVisible ? "text" : "password"}
            />
            {errors.password && <span>{errors.password.message}</span>}

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2
               cursor-pointer inline-block"
              onClick={togglePasswordVisibility}
            >
              {passwordIsVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
          <Button text={"login"} disabled={!isDirty || !isValid} />
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
