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
import { BasketItem, Basket } from "@/models/basket";
import { noBlankSpacesMEssage, noBlankSpacesRegEx } from "@/utils/regExValues";
import loginImage from "@/../public/login.png";

const formStyle =
  "rounded-md outline-none bg-white h-[3rem] px-3 text-gray-600\
   focus:outline-base-secondary border border-gray-200";
const inputDivStyle = "flex flex-col w-full";

// The array of all valid user ids (from API) is temp. used for dummy login
// for more info see the comments below
const allUsersIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //https://fakestoreapi.com/users

function getRandomUserId(): number {
  const randomIndex = Math.floor(Math.random() * allUsersIds.length);
  return allUsersIds[randomIndex];
}

type Inputs = {
  userName: string;
  password: string;
};

function Login(): JSX.Element | null {
  const router = useRouter();
  const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false);
  const { userId, setUserId, setBasket } = useGlobalContext();

  useEffect(() => {
    //redirect logged-in user to homepage
    if (userId !== null) {
      router.push("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>();

  //The onSubmit is temporarily commented out because the backend currently
  //doesn't return the expected response (user token).
  //Since authent. doesn't work, a temp. onSubmit imitates login.

  //The current onSubmit always logs in user, even if he isn't registered.
  //It takes a random user Id from API and saves it to SS instead of token

  //TODO fix when issue is closed
  //https://github.com/keikaavousi/fake-store-api/issues/97

  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //   fetch(`${BACKEND_API_URL}/auth/login`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       username: data.userName,
  //       password: data.password,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       //returns {'token' : '...'}
  //       if ("token" in data && typeof window !== "undefined") {
  //         sessionStorage.setItem(SESSION_TOKEN, data["token"]);
  //         router.push("/");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error unable to login:", error);
  //     });
  // };

  const onSubmit: SubmitHandler<Inputs> = () => {
    //Temp. solution.
    //The function takes a random id of one of the users provided in the API,
    //and imitates login of a random registered user

    const userId = getRandomUserId();
    sessionStorage.setItem(USER_ID_KEY, JSON.stringify(userId));
    setUserId(userId);
  };

  useEffect(() => {
    if (
      userId !== null &&
      sessionStorage.getItem(BASKET_SESSION_KEY) === null
    ) {
      fetchAndSaveBasketData();
      // TODO implement better routing
      // router.back works fine when when unauthenticated user was previously
      //'shopping' for items and was redirected to login (he gets redirected
      // back to item page after login). It also makes a bad UX if he came from
      // another page and gets redirected back to f.ex. register after login
      router.back();
    }
  }, [userId]);

  async function fetchAndSaveBasketData() {
    const basket = await fetchBasketData();
    if (basket instanceof Basket) {
      setBasket(basket);
      sessionStorage.setItem(BASKET_SESSION_KEY, JSON.stringify(basket));
    }
  }

  async function fetchBasketData(): Promise<Basket | void> {
    return fetch(`${BACKEND_API_URL}/carts/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length < 1) {
          //user doesn't have a basket yet
          return new Basket(null, userId, null, []);
        }

        //Api can return none, one or multiple baskets. In case when it returns
        //multiple baskets, the code initializes new Basket instance from
        //the first one.
        return new Basket(
          data[0].id,
          userId,
          data[0].date,
          data[0].products.map(
            (item: any) => new BasketItem(item.productId, item.quantity)
          )
        );
      })
      .catch((error) => {
        console.error("Error unable to fetch basket:", error);
      });
  }

  function togglePasswordVisibility() {
    setPasswordIsVisible((previous) => !previous);
  }

  return (
    <div
      className="mt-[5rem] md:mt-[10rem] flex flex-col md:flex-row 
      px-2 md:px-10 mb-[6rem]"
    >
      <div className="flex-1 text-center">
        <h2 className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Welcome back!
        </h2>
        <p className=" text-l md:text-xl pb-8">Let&apos;s get you logged in</p>

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
          className="text-s underline hover:text-base-secondary"
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
