"use client";

import Image from "next/image";
import Link from "next/link";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import { imageCover } from "@/components/utils/style";
import registerImage from "@/../public/register.png";
import { AiOutlineClose } from "react-icons/ai";

class UserRegisterCredentials {
  username: string;
  password: string;
  firstName: string;
  lastName: string;

  city: string;
  street: string;
  number: number;
  zip: number;
  email: string;

  constructor(
    username: string,
    password: string,
    firstName: string,
    flastName: string,
    city: string,
    street: string,
    number: number,
    zip: number,
    email: string
  ) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = flastName;

    this.city = city;
    this.street = street;
    this.number = number;
    this.zip = zip;
    this.email = email;
  }
}
//todo better handling of input data
//change hard-coded values
function Register(): JSX.Element {
  const formStyle =
    "rounded-md outline-none bg-white h-[3rem] px-3 text-gray-600\
     focus:outline-base-secondary border border-gray-200 w-full xl:w-[48%]";

  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [registerData, setRegisterData] = useState<UserRegisterCredentials>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    number: 0,
    zip: 0,
    email: "",
  });

  function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    let currentValue = event.currentTarget.value.trim();
    const lettersPattern = /[A-Za-z]/;
    const numbersPattern = /[0-9]/;

    switch (event.currentTarget.name) {
      case "first-name":
        if (lettersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, firstName: currentValue });
        } else {
          console.log(
            "Please enter a valid first name. It should only contain letters."
          );
        }
        break;
      case "last-name":
        if (lettersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, lastName: currentValue });
        } else {
          console.log(
            "Please enter a valid last name. It should only contain letters."
          );
        }
        break;
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(currentValue)) {
          setRegisterData({ ...registerData, email: currentValue });
        } else {
          console.log("wrong email format");
        }
        break;
      case "username":
        //TODO check if username doesn't exist
        setRegisterData({ ...registerData, username: currentValue });
        break;
      case "password":
        setCheckPassword(currentValue);
        break;
      case "confirm-password":
        if (currentValue === checkPassword) {
          setRegisterData({ ...registerData, password: currentValue });
        } else {
          console.log("passwords don't match");
        }
        break;
      case "city":
        if (lettersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, city: currentValue });
        } else {
          console.log(
            "Please enter a valid city. It should only contain letters."
          );
        }
        break;
      case "street":
        if (lettersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, street: currentValue });
        } else {
          console.log(
            "Please enter a valid street. It should only contain letters."
          );
        }
        break;
      case "number":
        if (numbersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, number: Number(currentValue) });
        } else {
          console.log(
            "Please enter a valid street number. It should be a positive number."
          );
        }
        break;
      case "zip-code":
        if (numbersPattern.test(currentValue)) {
          setRegisterData({ ...registerData, zip: Number(currentValue) });
        } else {
          console.log(
            "Please enter a valid zip code. It should be a positive number."
          );
        }
        break;
      default:
        console.log("error");
    }
  }

  useEffect(() => {
    if (
      registerData.username.length > 0 &&
      registerData.city.length > 0 &&
      registerData.email.length > 0 &&
      registerData.firstName.length > 0 &&
      registerData.lastName.length > 0 &&
      registerData.number !== 0 &&
      registerData.password.length > 0 &&
      registerData.street.length > 0 &&
      registerData.zip !== 0
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [registerData]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    fetch("https://fakestoreapi.com/users", {
      method: "POST",
      body: JSON.stringify({
        email: registerData.email,
        username: registerData.username,
        password: registerData.password,
        name: {
          firstname: registerData.firstName,
          lastname: registerData.lastName,
        },
        address: {
          city: registerData.city,
          street: registerData.street,
          number: registerData.number,
          zipcode: registerData.zip,
          geolocation: {
            lat: "-37.3159",
            long: "81.1496",
          },
        },
        phone: "1-570-236-7033",
      }),
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((error) => {
        console.error("Error unable to register:", error);
      });

    setModalIsOpen(true);
  }

  return (
    <div
      className="mt-[5rem] md:mt-[10rem] flex flex-col 
    md:flex-row px-2 md:px-10 mb-[6rem]"
    >
      {/* modal */}
      <ReactModal
        isOpen={modalIsOpen}
        className="transition-opacity ease-in-out duration-600"
        ariaHideApp={false}
      >
        <div
          className="px-4 py-10 bg-white/60 w-[80%] lg:w-[45%] h-60 top-[15rem]
           rounded-lg border border-gray-400 absolute left-1/2 transform
             -translate-x-1/2 text-center"
        >
          <button
            className="absolute top-4 right-4 hover:text-base-secondary
             text-gray-700 text-2xl"
            onClick={() => {
              setModalIsOpen(false);
            }}
          >
            <AiOutlineClose />
          </button>
          <div
            className="text-base font-bold mb-4 flex
           flex-col gap-5 text-gray-600"
          >
            Awesome, your account is up and running.
            <p className="text-2xl">Welcome to the family!</p>
            <Link
              href={"/login"}
              className="underline text-base-secondary
               hover:text-base-secondary/75"
            >
              Login here
            </Link>
          </div>
        </div>
      </ReactModal>

      {/* register form */}
      <div className="flex-1 text-center">
        <div className="mt-4 md:mt-0 text-3xl pb-3 md:pb-10 font-semibold">
          Create an account and join our community today
        </div>
        <div className=" text-l md:text-xl pb-8">
          We're thrilled to have you onboard!
        </div>

        <form
          className="flex flex-col mx-5 xl:mx-[5rem] mb-3 gap-5 md:gap-10 "
          method="post"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="flex flex-wrap gap-4 justify-between">
            <input
              className={`${formStyle}`}
              placeholder="first name"
              onBlur={(event) => handleBlur(event)}
              name="first-name"
            />
            <input
              className={`${formStyle}`}
              placeholder="last name"
              onBlur={(event) => handleBlur(event)}
              name="last-name"
            />
            <input
              className={`${formStyle}`}
              placeholder="email"
              onBlur={(event) => handleBlur(event)}
              name="email"
            />
            <input
              className={`${formStyle}`}
              placeholder="username"
              onBlur={(event) => handleBlur(event)}
              name="username"
            />
            <input
              className={`${formStyle}`}
              placeholder="password"
              onBlur={(event) => handleBlur(event)}
              name="password"
            />
            <input
              type="passwrod"
              className={`${formStyle}`}
              placeholder="confirm password"
              onBlur={(event) => handleBlur(event)}
              name="confirm-password"
            />
            <input
              className={`${formStyle}`}
              placeholder="city"
              onBlur={(event) => handleBlur(event)}
              name="city"
            />
            <input
              className={`${formStyle}`}
              placeholder="street"
              onBlur={(event) => handleBlur(event)}
              name="street"
            />
            <input
              type="number"
              className={`${formStyle}`}
              placeholder="house number"
              onBlur={(event) => handleBlur(event)}
              name="number"
            />
            <input
              type="number"
              className={`${formStyle}`}
              placeholder="zip-code"
              onBlur={(event) => handleBlur(event)}
              name="zip-code"
            />
          </div>
          <Button text={"register"} disabled={btnDisabled} />
        </form>
        <Link
          href="/login"
          className="text-s underline
         hover:text-base-secondary"
        >
          Already have an account?
        </Link>
      </div>
      <div className="bg-yellow-200 flex-1 order-first">
        <Image src={registerImage} alt="" className={`${imageCover}`} />
      </div>
    </div>
  );
}
<div className="bg-green-200"></div>;

export default Register;
